import moment, { isDuration } from 'moment';
import {
  get,
  isNil,
  cloneDeep,
  isFunction,
  isArray,
  isNull,
  isNumber,
  chain,
  groupBy,
  reject,
} from 'lodash';
import uuid from 'uuid/v4';

import {
  Client,
  AppointmentBook,
  Appointment,
} from '@/utilities/apiWrapper';
import { isBookedByEditEnabled } from '@/utilities/helpers';
import { ADD_APPOINTMENT } from './appointmentBook';
import {
  appointmentLength,
  serializeApptToRequestData,
  getBookedByEmployee,
} from '../selectors/newAppt';
import { showErrorAlert } from './utils';
import { PureProvider, Maybe, Client as ClientModel, Service, AppointmentCard, AppStore } from '@/models';
import { NewAppointmentReducer } from '../reducers/newAppointment';
import { ServiceItem } from '@/models/new-appointment';

export const SET_SELECTED_APPT = 'newAppointment/SET_SELECTED_APPT';
export const POPULATE_STATE_FROM_APPT =
  'newAppointment/POPULATE_STATE_FROM_APPT';

export const ADD_GUEST = 'newAppointment/ADD_GUEST';
export const SET_GUEST_CLIENT = 'newAppointment/SET_GUEST_CLIENT';
export const REMOVE_GUEST = 'newAppointment/REMOVE_GUEST';

export const SET_DATE = 'newAppointment/SET_DATE';
export const SET_START_TIME = 'newAppointment/SET_START_TIME';
export const SET_BOOKED_BY = 'newAppointment/SET_BOOKED_BY';
export const SET_MAIN_EMPLOYEE = 'newAppointment/SET_MAIN_EMPLOYEE';
export const SET_CLIENT = 'newAppointment/SET_CLIENT';
export const SET_QUICK_APPT_REQUESTED =
  'newAppointment/SET_QUICK_APPT_REQUESTED';

export const CLEAR_SERVICE_ITEMS = 'newAppointment/CLEAR_SERVICE_ITEMS';
export const ADD_QUICK_SERVICE_ITEM = 'newAppointment/ADD_QUICK_SERVICE_ITEM';
export const ADD_SERVICE_ITEM = 'newAppointment/ADD_SERVICE_ITEM';
export const UPDATE_SERVICE_ITEM = 'newAppointment/UPDATE_SERVICE_ITEM';
export const REMOVE_SERVICE_ITEM = 'newAppointment/REMOVE_SERVICE_ITEM';
export const ADD_SERVICE_ITEM_EXTRAS = 'newAppointment/ADD_SERVICE_ITEM_EXTRAS';

export const IS_BOOKED_BY_FIELD_ENABLED = 'newAppointment/IS_BOOKED_BY_FIELD_ENABLED';
export const CLEAN_FORM = 'newAppointment/CLEAN_FORM';
export const IS_BOOKING_QUICK_APPT = 'newAppointment/IS_BOOKING_QUICK_APPT';
export const CHECK_CONFLICTS = 'newAppointment/CHECK_CONFLICTS';
export const CHECK_CONFLICTS_SUCCESS = 'newAppointment/CHECK_CONFLICTS_SUCCESS';
export const CHECK_CONFLICTS_FAILED = 'newAppointment/CHECK_CONFLICTS_FAILED';

export const BOOK_NEW_APPT = 'newAppointment/BOOK_NEW_APPT';
export const BOOK_NEW_APPT_SUCCESS = 'newAppointment/BOOK_NEW_APPT_SUCCESS';
export const BOOK_NEW_APPT_FAILED = 'newAppointment/BOOK_NEW_APPT_FAILED';

export const SET_REMARKS = 'newAppointment/SET_REMARKS';

export const MESSAGE_ALL_CLIENTS = 'newAppointment/MESSAGE_ALL_CLIENTS';
export const MESSAGE_ALL_CLIENTS_SUCCESS =
  'newAppointment/MESSAGE_ALL_CLIENTS_SUCCESS';
export const MESSAGE_ALL_CLIENTS_FAILED =
  'newAppointment/MESSAGE_ALL_CLIENTS_FAILED';
export const MESSAGE_PROVIDERS_CLIENTS =
  'newAppointment/MESSAGE_PROVIDERS_CLIENTS';
export const MESSAGE_PROVIDERS_CLIENTS_SUCCESS =
  'newAppointment/MESSAGE_PROVIDERS_CLIENTS_SUCCESS';
export const MESSAGE_PROVIDERS_CLIENTS_FAILED =
  'newAppointment/MESSAGE_PROVIDERS_CLIENTS_FAILED';

export const POPULATE_STATE_FROM_REBOOKED_APPT =
  'newAppointment/POPULATE_STATE_FROM_REBOOKED_APPT';

const clearServiceItems = () => ({
  type: CLEAR_SERVICE_ITEMS,
});

const addGuest = (client) => ({
  type: ADD_GUEST,
  data: {
    guest: {
      guestId: uuid(),
      client,
    },
  },
});

const removeGuest = (guestId: Maybe<string> = null): any => ({
  type: REMOVE_GUEST,
  data: { guestId },
});

const setGuestClient = (guestId: Maybe<string>, client: Maybe<ClientModel>): any => (dispatch, getState) => {
  const { guests } = getState().newAppointmentReducer;
  const guestIndex = guests.findIndex(item => item.guestId === guestId);
  const guest = guests[guestIndex];
  guest.client = client;
  return dispatch({
    type: SET_GUEST_CLIENT,
    data: { guest },
  });
};

const resetTimeForServices = (items: any, index: Maybe<number>,
  initialFromTime: Maybe<string | moment.Moment>): any => {
  return items.map((item, i) => {
    if (i > index) {
      const prevItem = items[i - 1];
      let fromTime = initialFromTime;
      if (prevItem) {
        fromTime = get(prevItem.service, 'toTime', initialFromTime);
      }
      return {
        ...item,
        service: {
          ...item.service, fromTime, toTime: moment(item.service.fromTime).add(
            item.service.length,
          ),
        },
      };
    }
  });
};

const isBookingQuickAppt = (isBookingQuickAppt: boolean): any => async (dispatch, getState: () => AppStore) => {
  dispatch({
    type: IS_BOOKING_QUICK_APPT,
    data: { isBookingQuickAppt },
  });
};

export interface ServiceWithAddons {
  service: Maybe<Service>;
  addons: Maybe<Service[]>;
  recommended: Maybe<Service[]>;
  required: Maybe<Service>;
}

const addQuickServiceItem = (selectedServices: Maybe<ServiceWithAddons>, guestId: Maybe<string> = null) => (
  dispatch,
  getState,
) => {
  const {
    client,
    guests,
    startTime,
    mainEmployee: employee,
  } = getState().newAppointmentReducer as NewAppointmentReducer;
  const {
    service,
    addons = [],
    recommended = [],
    required = null,
  } = selectedServices;

  const length = appointmentLength(getState());
  const serviceLength = moment.duration(service.maxDuration);
  const fromTime = moment(startTime).add(moment.duration(length));
  const toTime = moment(fromTime).add(serviceLength);
  const serviceClient = guestId
    ? get(guests.filter(guest => guest.guestId === guestId), 'client', null)
    : client;
  const newService = {
    service,
    employee,
    length: serviceLength,
    client: serviceClient,
    requested: getState().newAppointmentReducer.isQuickApptRequested,
    fromTime,
    toTime,
    bookBetween: get(service, 'bookBetween', false),
    gapTime: moment.duration(get(service, 'gapDuration', 0)),
    afterTime: moment.duration(get(service, 'afterDuration', 0)),
  };
  const serviceItem = {
    itemId: uuid(),
    guestId,
    service: newService,
  };
  dispatch({
    type: ADD_QUICK_SERVICE_ITEM,
    data: { serviceItem },
  });
  setTimeout(() => {
    dispatch(
      addServiceItemExtras(
        serviceItem.itemId, // parentId
        'addon', // extraService type
        addons,
      ),
    );
    dispatch(
      addServiceItemExtras(
        serviceItem.itemId, // parentId
        'recommended', // extraService type
        recommended,
      ),
    );
    dispatch(
      addServiceItemExtras(
        serviceItem.itemId, // parentId
        'required', // extraService type
        required,
      ),
    );
  });
};

const addServiceItem = (serviceItem: ServiceItem): any => (dispatch, getState: () => AppStore) => {
  const { startTime } = getState().newAppointmentReducer;
  const newServiceItems = getState().newAppointmentReducer.serviceItems;
  newServiceItems.push(serviceItem);
  resetTimeForServices(newServiceItems, -1, startTime);
  return dispatch({
    type: ADD_SERVICE_ITEM,
    data: { serviceItems: newServiceItems },
  });
};

const addServiceItemExtras = (
  parentId: Maybe<string>, type: Maybe<string>, services: Maybe<Service[] | Service>): any => (
    dispatch,
    getState: () => AppStore,
  ) => {
    if (isNull(services)) {
      return;
    }
    const {
      client,
      guests,
      startTime,
      serviceItems,
      mainEmployee: employee,
    } = getState().newAppointmentReducer;
    const [parentService] = serviceItems.filter(
      item => item.itemId === parentId,
    );
    const { guestId, service: { employee: parentEmployee } } = parentService;
    const serializeServiceItem = service => {
      if (!service) {
        return null;
      }
      const length = appointmentLength(getState());
      const serviceLength = moment.duration(
        service.maxDuration || service.duration,
      );
      const fromTime = moment(startTime).add(moment.duration(length));
      const toTime = moment(fromTime).add(serviceLength);
      const serviceClient = guestId
        ? get(
          guests.filter(guest => guest.guestId === guestId)[0],
          'client',
          null,
        )
        : client;
      const newService = {
        length: serviceLength,
        client: serviceClient,
        requested: true,
        service,
        employee: parentEmployee || employee,
        fromTime,
        toTime,
        bookBetween: get(service, 'bookBetween', false),
        gapTime: moment.duration(get(service, 'gapDuration', 0)),
        afterTime: moment.duration(get(service, 'afterDuration', 0)),
      };
      const serviceItem = {
        itemId: uuid(),
        guestId,
        parentId,
        type,
        isRequired: type === 'required',
        service: newService,
      };

      return serviceItem;
    };

    const newServiceItems = reject(
      serviceItems,
      item => get(item, 'type', null) === type && item.parentId === parentId,
    );

    if (Array.isArray(services)) {
      services.forEach(service => {
        newServiceItems.push(serializeServiceItem(service));
      });
    } else {
      newServiceItems.push(serializeServiceItem(services));
    }

    resetTimeForServices(newServiceItems, -1, startTime);

    dispatch({
      type: ADD_SERVICE_ITEM_EXTRAS,
      data: { serviceItems: newServiceItems },
    });
  };

const updateServiceItem = (
  serviceId: Maybe<string>, updatedService: ServiceItem['service'], guestId: Maybe<string>) => (
    dispatch,
    getState: () => AppStore,
  ) => {
    const newServiceItems: ServiceItem[] = cloneDeep(
      getState().newAppointmentReducer.serviceItems,
    );
    const serviceIndex = newServiceItems.findIndex(
      item => item.itemId === serviceId,
    );
    const serviceItemToUpdate = newServiceItems[serviceIndex];
    const serviceItem: ServiceItem = {
      ...serviceItemToUpdate,
      service: { ...updatedService },
    };
    newServiceItems.splice(serviceIndex, 1, serviceItem);
    resetTimeForServices(
      newServiceItems,
      serviceIndex - 1,
      updatedService.fromTime,
    );
    return dispatch({
      type: UPDATE_SERVICE_ITEM,
      data: { serviceItems: newServiceItems },
    });
  };

const removeServiceItem = (serviceId: Maybe<string>): any => (dispatch, getState) => {
  const newServiceItems = getState().newAppointmentReducer.serviceItems;
  const serviceIndex = newServiceItems.findIndex(
    item => item.itemId === serviceId,
  );
  const removedAppt = newServiceItems.splice(serviceIndex, 1)[0];
  const extrasToRemove = newServiceItems.filter(
    item => item.parentId === removedAppt.itemId,
  );
  extrasToRemove.forEach(extra => {
    const extraIndex = newServiceItems.findIndex(
      item => item.itemId === extra.itemId,
    );
    newServiceItems.splice(extraIndex, 1);
  });
  resetTimeForServices(
    newServiceItems,
    serviceIndex - 1,
    removedAppt.service.fromTime,
  );
  return dispatch({
    type: REMOVE_SERVICE_ITEM,
    data: {
      serviceItems: newServiceItems,
      deletedIds: removedAppt.service.id,
    },
  });
};

export function serializeNewApptItem(appointment, service) {
  const isFirstAvailable = get(service.employee, 'isFirstAvailable', false);

  const itemData = {
    clientId: service.isGuest
      ? get(service.client, 'id')
      : get(appointment.client, 'id'),
    serviceId: get(service.service, 'id'),
    employeeId: isFirstAvailable ? null : get(service.employee, 'id', null),
    fromTime: moment(service.fromTime, 'HH:mm').format('HH:mm:ss'),
    toTime: moment(service.toTime, 'HH:mm').format('HH:mm:ss'),
    bookBetween: get(service, 'bookBetween', false),
    requested: get(service, 'requested', false),
    isFirstAvailable,
    bookedByEmployeeId: get(appointment.bookedByEmployee, 'id'),
    roomId: get(service.room, 'id', null),
    roomOrdinal: get(service, 'roomOrdinal', null),
    resourceId: get(service.resource, 'id', null),
    resourceOrdinal: get(service, 'resourceOrdinal', null),
  } as any;

  if (!isNil(service.gapTime)) {
    itemData.gapTime = moment()
      .startOf('day')
      .add(service.gapTime, 'minutes')
      .format('HH:mm:ss');
    itemData.afterTime = moment()
      .startOf('day')
      .add(service.afterTime, 'minutes')
      .format('HH:mm:ss');
  }

  return itemData;
}

const getConflicts = (callback?: Maybe<Function>): any => (dispatch, getState) => {
  const {
    client,
    date,
    startTime,
    bookedByEmployee: provider,
    serviceItems,
  } = getState().newAppointmentReducer;
  if (!client || !provider || !serviceItems.length) {
    return;
  }
  dispatch({
    type: CHECK_CONFLICTS,
  });

  resetTimeForServices(serviceItems, -1, moment(startTime, 'HH:mm'));

  const conflictData = {
    date: date.format('YYYY-MM-DD'),
    clientId: client.id,
    bookedByEmployeeId: get(provider, 'id', null),
    items: [],
  };
  serviceItems.forEach(serviceItem => {
    const isFirstAvailable = get(serviceItem.service.employee, 'id', 0) === 0;
    conflictData.items.push({
      isFirstAvailable,
      appointmentId: get(serviceItem.service, 'id', null),
      clientId: serviceItem.guestId
        ? client.id
        : get(serviceItem.service.client, 'id', client.id),
      serviceId: serviceItem.service.service.id,
      employeeId: isFirstAvailable
        ? null
        : get(serviceItem.service.employee, 'id', null),
      fromTime: serviceItem.service.fromTime.format('HH:mm:ss', { trim: false }),
      toTime: serviceItem.service.toTime.format('HH:mm:ss', { trim: false }),
      bookBetween: false,
      roomId: get(get(serviceItem.service, 'room', null), 'id', null),
      roomOrdinal: get(serviceItem.service, 'roomOrdinal', null),
      resourceId: get(get(serviceItem.service, 'resource', null), 'id', null),
      resourceOrdinal: get(serviceItem.service, 'resourceOrdinal', null),
      associativeKey: get(serviceItem, 'itemId', null),
    });
  });

  AppointmentBook.postCheckConflicts(conflictData)
    .then(conflicts => {
      if (isFunction(callback)) {
        callback();
      }
      return dispatch({
        type: CHECK_CONFLICTS_SUCCESS,
        data: { conflicts },
      });
    })
    .catch(() => {
      if (isFunction(callback)) {
        callback();
      }
      return dispatch({
        type: CHECK_CONFLICTS_FAILED,
      });
    });
};

const getConflictsForService = (serviceItem, callback) => (dispatch, getState) => {
  const {
    client,
    date,
    startTime,
    bookedByEmployee: provider,
  } = getState().newAppointmentReducer;

  if (!client || !provider) {
    return;
  }

  dispatch({ type: CHECK_CONFLICTS });

  resetTimeForServices([serviceItem], -1, moment(startTime, 'HH:mm'));

  const conflictData = {
    date: date.format('YYYY-MM-DD'),
    clientId: client.id,
    bookedByEmployeeId: get(provider, 'id', null),
    items: [serviceItem.service],
  };

  AppointmentBook.postCheckConflicts(conflictData)
    .then(conflicts => {
      dispatch({
        type: CHECK_CONFLICTS_SUCCESS,
        data: { conflicts },
      });
      if (isFunction(callback)) {
        callback();
      }
    })
    .catch(() => {
      if (isFunction(callback)) {
        callback();
      }
      return dispatch({
        type: CHECK_CONFLICTS_FAILED,
      });
    });
};

const cleanForm = () => (dispatch, getState: () => AppStore) => dispatch({
  type: CLEAN_FORM,
  data: { bookedByEmployee: getState().userInfoReducer.currentEmployee },
});

const setBookedBy = (
  bookedByEmployee: Maybe<PureProvider>): any => async (dispatch, getState: () => AppStore) => {
    const isBookedByFieldEnabled = await isBookedByEditEnabled(getState());
    dispatch({
      type: SET_BOOKED_BY,
      data: {
        bookedByEmployee,
        isBookedByFieldEnabled,
      },
    });
  };

const setMainEmployee = (mainEmployee: Maybe<PureProvider>): any => ({
  type: SET_MAIN_EMPLOYEE,
  data: { mainEmployee },
});

const setDate = (date: any): any => ({
  type: SET_DATE,
  data: { date },
});

const setStartTime = (startTime: any): any => ({
  type: SET_START_TIME,
  data: { startTime },
});

const setClient = (client: Maybe<ClientModel>): any => ({
  type: SET_CLIENT,
  data: { client },
});

const setQuickApptRequested = (requested: boolean): any => ({
  type: SET_QUICK_APPT_REQUESTED,
  data: { requested },
});

const quickBookAppt = (successCallback: Maybe<Function>, errorCallback: Maybe<Function>): any => (
  dispatch,
  getState,
) => {
  const { startTime, serviceItems } = getState().newAppointmentReducer;

  dispatch({
    type: BOOK_NEW_APPT,
  });
  resetTimeForServices(serviceItems, -1, startTime);

  const requestBody = serializeApptToRequestData(getState());

  return Appointment.postNewAppointment(requestBody)
    .then(res => {
      dispatch(bookNewApptSuccess(successCallback));
    })
    .catch(err => {
      if (isFunction(errorCallback)) {
        errorCallback(err);
      }
      showErrorAlert(err);
      dispatch({
        type: BOOK_NEW_APPT_FAILED,
        data: { error: err },
      });
    });
};

const populateStateFromRebookAppt = (
  appt,
  services,
  mainEmployee,
  startDate,
  startTime,
) => (dispatch, getState) => {
  dispatch({
    type: SET_SELECTED_APPT,
    data: { appt },
  });

  const { badgeData: { isParty, primaryClient } } = appt;
  const primaryClientId = isParty
    ? get(primaryClient, 'id', null)
    : get(appt.client, 'id', null);
  const mainClient = isParty ? primaryClientId : appt.client;

  let serviceItems = [];

  for (let i = 0; i < services.length; i += 1) {
    const service = services[i];

    const fromTime = moment(service.fromTime, 'HH:mm:ss');
    const toTime = moment(service.toTime, 'HH:mm:ss');
    const serviceLength = service.serviceLength || service.duration;
    const length = moment.duration(serviceLength);
    const serviceClient = mainClient;
    service.name = service.serviceName;
    service.serviceId = service.id || service.serviceId;

    const newService = {
      id: get(service, 'serviceId', null),
      serviceId: get(service, 'serviceId', null),
      length,
      service,
      requested: get(service, 'isProviderRequested', true),
      client: serviceClient,
      employee: get(service, 'employee', null),
      fromTime,
      toTime,
      bookBetween: get(service, 'bookBetween', false),
      gapTime: moment.duration(get(service, 'gapTime', 0)),
      afterTime: moment.duration(get(service, 'afterTime', 0)),
    };

    const newServiceItem = {
      itemId: uuid(),
      guestId: false,
      service: newService,
    };

    serviceItems.push(newServiceItem);
  }

  serviceItems = resetTimeForServices(
    serviceItems,
    -1,
    moment(startTime, 'HH:mm'),
  );

  serviceItems.sort((a, b) => a.service.fromTime.isAfter(b.service.fromTime));

  const newState = {
    selectedAppt: appt,
    date: startDate,
    startTime: serviceItems.length
      ? serviceItems[0].service.fromTime
      : moment(appt.fromTime, 'HH:mm:ss'),
    client: mainClient,
    bookedByEmployee: mainEmployee,
    mainEmployee,
    guests: [],
    conflicts: [],
    serviceItems,
    remarks: get(appt, 'remarks', ''),
    rebooked: true,
    existingApptIds: appt.services.map(item => get(item, 'id', null)),
  };
  if (isNumber(newState.client)) {
    return Client.getClient(newState.client).then(client => {
      newState.client = client;
      return dispatch({
        type: POPULATE_STATE_FROM_REBOOKED_APPT,
        data: { newState },
      });
    });
  }
  return dispatch({
    type: POPULATE_STATE_FROM_REBOOKED_APPT,
    data: { newState },
  });
};

const populateStateFromAppt = (appt: Maybe<AppointmentCard>, groupData: any): any => async (dispatch, getState) => {
  dispatch({
    type: SET_SELECTED_APPT,
    data: { appt },
  });

  const { badgeData: { isParty, primaryClient } } = appt;
  const clients = groupData.reduce(
    (agg, currentAppt) => [...agg, currentAppt.client],
    [],
  );
  const primaryClientId = isParty
    ? get(primaryClient, 'id', null)
    : get(appt.client, 'id', null);
  const mainClient = isParty ? primaryClientId : appt.client;
  const guests = reject(clients, item => item.id === primaryClientId)
    .map(client => ({
      client,
      guestId: uuid(),
    }))
    .reduce((agg, guest) => {
      if (
        agg.find(item => item.client && item.client.id === guest.client.id)
      ) {
        return agg;
      }
      return [...agg, guest];
    }, []);
  const serviceItems = groupData.reduce((services, appointment) => {
    const isGuest = isParty && appointment.client.id !== primaryClientId;
    let guest = false;
    if (isGuest) {
      guest = guests.find(itm => itm.client.id === appointment.client.id);
    }
    const fromTime = moment(appointment.fromTime, 'HH:mm:ss');
    const toTime = moment(appointment.toTime, 'HH:mm:ss');
    const length = moment.duration(toTime.diff(fromTime));
    const serviceClient = guest ? get(guest, 'client', null) : mainClient;
    const newService = {
      id: get(appointment, 'id', null),
      length,
      service: get(appointment, 'service', null),
      requested: get(appointment, 'requested', true),
      client: serviceClient,
      employee: get(appointment, 'employee', null),
      fromTime,
      toTime,
      bookBetween: get(appointment, 'bookBetween', false),
      gapTime: moment.duration(get(appointment, 'gapTime', 0)),
      afterTime: moment.duration(get(appointment, 'afterTime', 0)),
    };

    const newServiceItem = {
      itemId: uuid(),
      guestId: guest ? get(guest, 'guestId', false) : false,
      service: newService,
    };
    return [...services, newServiceItem];
  }, []);

  serviceItems.sort((a, b) => a.service.fromTime.isAfter(b.service.fromTime));
  const isBookedByFieldEnabled = await isBookedByEditEnabled(getState());
  const newState = {
    isBookedByFieldEnabled,
    selectedAppt: appt,
    date: moment(get(appt, 'date', moment())),
    startTime: serviceItems.length
      ? serviceItems[0].service.fromTime
      : moment(appt.fromTime, 'HH:mm:ss'),
    client: mainClient,
    bookedByEmployee: get(appt, 'bookedByEmployee', null),
    mainEmployee: get(appt, 'employee', null),
    guests,
    conflicts: [],
    serviceItems,
    remarks: get(appt, 'remarks', ''),
    existingApptIds: groupData.map(item => get(item, 'id', null)),
  };
  if (isNumber(newState.client)) {
    return Client.getClient(newState.client).then(client => {
      newState.client = client;
      return dispatch({
        type: POPULATE_STATE_FROM_APPT,
        data: { newState },
      });
    });
  }
  return dispatch({
    type: POPULATE_STATE_FROM_APPT,
    data: { newState },
  });
};

const checkIsBookedByFieldEnabled = () => async (dispatch, getState: () => AppStore) => {
  const isBookedByFieldEnabled = await isBookedByEditEnabled(getState());
  dispatch({ type: IS_BOOKED_BY_FIELD_ENABLED, data: { isBookedByFieldEnabled } });
};

const bookNewAppt = appt => (dispatch, getState) => {
  const requestBody = serializeApptToRequestData(getState());
  dispatch({ type: BOOK_NEW_APPT });
  return new Promise((resolve, reject) => {
    Appointment.postNewAppointment(requestBody)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const bookNewApptSuccess = (callback: Maybe<Function> = null) => dispatch => {
  if (isFunction(callback)) {
    callback();
  }
  return dispatch({ type: BOOK_NEW_APPT_SUCCESS });
};

const setRemarks = remarks => ({
  type: SET_REMARKS,
  data: { remarks },
});

const messageAllClientsSuccess = employeeSchedule => ({
  type: MESSAGE_ALL_CLIENTS_SUCCESS,
  data: { employeeSchedule },
});

const messageAllClientsFailed = error => ({
  type: MESSAGE_ALL_CLIENTS_FAILED,
  data: { error },
});

const messageAllClients = (date, messageText, callback?: (status: boolean) => void) => dispatch => {
  dispatch({ type: MESSAGE_ALL_CLIENTS });
  return AppointmentBook.postMessageAllClients(date, messageText)
    .then(response => {
      dispatch(messageAllClientsSuccess(response));
      if (callback) {
        callback(true);
      }
    })
    .catch(error => {
      dispatch(messageAllClientsFailed(error));
      showErrorAlert(error);
      if (callback) {
        callback(false);
      }
    });
};

const messageProvidersClientsSuccess = employeeSchedule => ({
  type: MESSAGE_PROVIDERS_CLIENTS_SUCCESS,
  data: { employeeSchedule },
});

const messageProvidersClientsFailed = error => ({
  type: MESSAGE_PROVIDERS_CLIENTS_FAILED,
  data: { error },
});

const messageProvidersClients = (
  date,
  employeeId,
  messageText,
  callback,
) => dispatch => {
  dispatch({ type: MESSAGE_PROVIDERS_CLIENTS });
  return AppointmentBook.postMessageProvidersClients(
    date,
    employeeId,
    messageText,
  )
    .then(response => {
      dispatch(messageProvidersClientsSuccess(response));
      callback(true);
    })
    .catch(error => {
      dispatch(messageProvidersClientsFailed(error));
      showErrorAlert(error);
      callback(false);
    });
};
// tslint:disable-next-line
const modifyAppt = (apptId: number, successCallback: Maybe<Function> = null, errorCallback: Maybe<Function> = null): any => (
  dispatch,
  getState,
) => {
  const {
    startTime,
    serviceItems,
    existingApptIds,
    deletedIds: idForDel,
  } = getState().newAppointmentReducer;
  dispatch({
    type: BOOK_NEW_APPT,
  });
  resetTimeForServices(serviceItems, -1, startTime);
  const requestBody = serializeApptToRequestData(getState());
  const existingServices = reject(serviceItems, itm => !itm.service.id).map(
    itm => itm.service.id,
  );
  const deletedIds = reject(existingApptIds, id =>
    existingServices.includes(id),
  );
  requestBody.deletedIds = deletedIds.length || idForDel;
  return Appointment.putAppointment(apptId, requestBody)
    .then(res => {
      return dispatch(bookNewApptSuccess(successCallback));
    })
    .catch(err => {
      if (isFunction(errorCallback)) {
        errorCallback(err);
      }
      showErrorAlert(err);
      return dispatch({
        type: BOOK_NEW_APPT_FAILED,
        data: { error: err },
      });
    });
};

const newAppointmentActions = {
  cleanForm,
  setBookedBy,
  setDate,
  setClient,
  setStartTime,
  bookNewAppt,
  quickBookAppt,
  clearServiceItems,
  addQuickServiceItem,
  setQuickApptRequested,
  getConflicts,
  isBookingQuickAppt,
  addGuest,
  setGuestClient,
  removeGuest,
  addServiceItem,
  addServiceItemExtras,
  updateServiceItem,
  removeServiceItem,
  setRemarks,
  messageAllClients,
  messageProvidersClients,
  populateStateFromAppt,
  populateStateFromRebookAppt,
  modifyAppt,
  setMainEmployee,
  getConflictsForService,
  checkIsBookedByFieldEnabled,
};

export interface NewApptActions {
  cleanForm: typeof newAppointmentActions.cleanForm;
  setBookedBy: typeof newAppointmentActions.setBookedBy;
  setDate: typeof newAppointmentActions.setDate;
  setClient: typeof newAppointmentActions.setClient;
  setStartTime: typeof newAppointmentActions.setStartTime;
  bookNewAppt: typeof newAppointmentActions.bookNewAppt;
  quickBookAppt: typeof newAppointmentActions.quickBookAppt;
  clearServiceItems: typeof newAppointmentActions.clearServiceItems;
  addQuickServiceItem: typeof newAppointmentActions.addQuickServiceItem;
  setQuickApptRequested: typeof newAppointmentActions.setQuickApptRequested;
  getConflicts: typeof newAppointmentActions.getConflicts;
  isBookingQuickAppt: typeof newAppointmentActions.isBookingQuickAppt;
  addGuest: typeof newAppointmentActions.addGuest;
  setGuestClient: typeof newAppointmentActions.setGuestClient;
  removeGuest: typeof newAppointmentActions.removeGuest;
  addServiceItem: typeof newAppointmentActions.addServiceItem;
  addServiceItemExtras: typeof newAppointmentActions.addServiceItemExtras;
  updateServiceItem: typeof newAppointmentActions.updateServiceItem;
  removeServiceItem: typeof newAppointmentActions.removeServiceItem;
  setRemarks: typeof newAppointmentActions.setRemarks;
  messageAllClients: typeof newAppointmentActions.messageAllClients;
  messageProvidersClients: typeof newAppointmentActions.messageProvidersClients;
  populateStateFromAppt: typeof newAppointmentActions.populateStateFromAppt;
  populateStateFromRebookAppt: typeof newAppointmentActions.populateStateFromRebookAppt;
  modifyAppt: typeof newAppointmentActions.modifyAppt;
  setMainEmployee: typeof newAppointmentActions.setMainEmployee;
  getConflictsForService: typeof newAppointmentActions.getConflictsForService;
  checkIsBookedByFieldEnabled: typeof newAppointmentActions.checkIsBookedByFieldEnabled;
}

export default newAppointmentActions;
