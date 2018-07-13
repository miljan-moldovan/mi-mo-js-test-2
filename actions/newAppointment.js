import moment, { updateLocale } from 'moment';
import { get, isNil } from 'lodash';
import uuid from 'uuid/v4';

import { AppointmentBook, Appointment } from '../utilities/apiWrapper';
import {
  ADD_APPOINTMENT,
} from '../screens/appointmentCalendarScreen/redux/appointmentScreen';
import {
  appointmentLength,
} from '../redux/selectors/newAppt';

export const ADD_GUEST = 'newAppointment/ADD_GUEST';
export const REMOVE_GUEST = 'newAppointment/REMOVE_GUEST';

export const SET_DATE = 'newAppointment/SET_DATE';
export const SET_START_TIME = 'newAppointment/SET_START_TIME';
export const SET_BOOKED_BY = 'newAppointment/SET_BOOKED_BY';
export const SET_CLIENT = 'newAppointment/SET_CLIENT';
export const SET_QUICK_APPT_REQUESTED = 'newAppointment/SET_QUICK_APPT_REQUESTED';

export const SET_GUEST_CLIENT = 'newAppointment/SET_GUEST_CLIENT';
export const ADD_GUEST_SERVICE = 'newAppointment/ADD_GUEST_SERVICE';
export const REMOVE_GUEST_SERVICE = 'newAppointment/REMOVE_GUEST_SERVICE';

export const CLEAR_SERVICE_ITEMS = 'newAppointment/CLEAR_SERVICE_ITEMS';
export const ADD_QUICK_SERVICE_ITEM = 'newAppointment/ADD_QUICK_SERVICE_ITEM';
export const ADD_SERVICE_ITEM = 'newAppointment/ADD_SERVICE_ITEM';
export const UPDATE_SERVICE_ITEM = 'newAppointment/UPDATE_SERVICE_ITEM';
export const REMOVE_SERVICE_ITEM = 'newAppointment/REMOVE_SERVICE_ITEM';

export const CLEAN_FORM = 'newAppointment/CLEAN_FORM';
export const UPDATE_TOTALS = 'newAppointment/UPDATE_TOTALS';
export const CHECK_CONFLICTS = 'newAppointment/CHECK_CONFLICTS';
export const CHECK_CONFLICTS_SUCCESS = 'newAppointment/CHECK_CONFLICTS_SUCCESS';
export const CHECK_CONFLICTS_FAILED = 'newAppointment/CHECK_CONFLICTS_FAILED';
export const ADD_NEW_APPT_ITEM = 'newAppointment/ADD_NEW_APPT_ITEM';
export const REMOVE_NEW_APPT_ITEM = 'newAppointment/REMOVE_NEW_APPT_ITEM';
export const SET_NEW_APPT_EMPLOYEE = 'newAppointment/SET_NEW_APPT_EMPLOYEE';
export const SET_NEW_APPT_REMARKS = 'newAppointment/SET_NEW_APPT_REMARKS';
export const SET_NEW_APPT_ENDS_AFTER = 'newAppointment/SET_NEW_APPT_ENDS_AFTER';
export const SET_NEW_APPT_ENDS_ON_DATE = 'newAppointment/SET_NEW_APPT_ENDS_ON_DATE';
export const SET_NEW_APPT_REPEAT_PERIOD = 'newAppointment/SET_NEW_APPT_REPEAT_PERIOD';
export const SET_NEW_APPT_DATE = 'newAppointment/SET_NEW_APPT_DATE';
export const SET_NEW_APPT_SERVICE = 'newAppointment/SET_NEW_APPT_SERVICE';
export const SET_NEW_APPT_CLIENT = 'newAppointment/SET_NEW_APPT_CLIENT';
export const SET_NEW_APPT_START_TIME = 'newAppointment/SET_NEW_APPT_START_TIME';
export const SET_NEW_APPT_DURATION = 'newAppointment/SET_NEW_APPT_DURATION';
export const SET_NEW_APPT_REQUESTED = 'newAppointment/SET_NEW_APPT_REQUESTED';
export const SET_NEW_APPT_RECURRING = 'newAppointment/SET_NEW_APPT_RECURRING';
export const SET_NEW_APPT_RECURRING_TYPE = 'newAppointment/SET_NEW_APPT_RECURRING_TYPE';
export const SET_NEW_APPT_FIRST_AVAILABLE = 'newAppointment/SET_NEW_APPT_FIRST_AVAILABLE';
export const BOOK_NEW_APPT = 'newAppointment/BOOK_NEW_APPT';
export const BOOK_NEW_APPT_SUCCESS = 'newAppointment/BOOK_NEW_APPT_SUCCESS';
export const BOOK_NEW_APPT_FAILED = 'newAppointment/BOOK_NEW_APPT_FAILED';

const clearServiceItems = () => ({
  type: CLEAR_SERVICE_ITEMS,
});

// const addQuickServiceItem = (service, guestId = false) => (dispatch) => {
//   dispatch(clearServiceItems());
//   return dispatch(addServiceItem(service, guestId));
// };

const addQuickServiceItem = (service, guestId = false) => (dispatch, getState) => {
  const {
    client,
    guests,
    startTime,
    serviceItems,
    bookedByEmployee,
  } = getState().newAppointmentReducer;
  const length = appointmentLength(getState());
  const fromTime = moment(startTime).add(moment.duration(length));
  const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
  const newService = {
    service,
    client: guestId ? get(this.getGuest(guestId), 'client', null) : client,
    requested: true,
    employee: bookedByEmployee,
    fromTime,
    toTime,
  };
  const serviceItem = {
    itemId: uuid(),
    guestId,
    service: newService,
  };

  return dispatch({
    type: ADD_QUICK_SERVICE_ITEM,
    data: { serviceItem },
  });
};

export function serializeNewApptItem(appointment, service) {
  const isFirstAvailable = get(service.employee, 'isFirstAvailable', false);
  const itemData = {
    clientId: service.isGuest ? get(service.client, 'id') : get(appointment.client, 'id'),
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
  };

  if (!isNil(service.gapTime)) {
    itemData.gapTime = moment().startOf('day').add(service.gapTime, 'minutes').format('HH:mm:ss');
    itemData.afterTime = moment().startOf('day').add(service.afterTime, 'minutes').format('HH:mm:ss');
  }

  // if (srv.room) {
  //   itemData.roomId = srv.room.id
  // }

  // if (srv.resource) {
  //   itemData.resourceId = srv.resource.id
  // }

  return itemData;
}

resetTimeForServices = (items, index, initialFromTime) => {
  items.forEach((item, i) => {
    if (i > index) {
      const prevItem = items[i - 1];

      item.fromTime = prevItem && prevItem.toTime ?
        moment(prevItem.toTime) : initialFromTime;
      item.toTime = moment(item.fromTime).add(moment.duration(item.service ?
        item.service.maxDuration : item.maxDuration));
    }
  });

  return items;
}

export function serializeApptToRequestData(appt, extraServices) {
  const services = appt.items;
  for (let i = 0; i < extraServices.length; i += 1) {
    for (let j = 0; j < extraServices[i].services.length; j += 1) {
      const copy = extraServices[i].services[j];
      services.push({ isGuest: true, ...copy });
    }
  }
  const filteredServices = services.filter(srv => srv.service !== null);

  const data = {
    dateRequired: true,
    date: moment(appt.date).format('YYYY-MM-DD'),
    bookedByEmployeeId: get(appt.bookedByEmployee, 'id'),
    rebooked: get(appt, 'rebooked', false),
    remarks: appt.remarks,
    // displayColor: appt.displayColor,
    clientInfo: {
      id: get(appt.client, 'id'),
      email: appt.client.email || '',
      phones: appt.client.phones || [],
      // confirmationType: appt.client.confirmationType
    },
    items: filteredServices.map(srv => serializeNewApptItem(appt, srv)),
  };

  // if (isRecurring) {
  //   data.recurring = {
  //     repeatPeriod: 0,
  //     endsAfterCount: 0,
  //     endsOnDate: '2018-01-01'
  //   };
  // }

  return data;
}

const getConflicts => () => (dispatch, getState) => {
  const {
    client,
    date,
    startTime,
    bookedByEmployee: provider,
    serviceItems,
  } = getState().newAppointmentReducer;
  if (!client || !provider || !serviceItems.length > 0) {
    return;
  }
  dispatch({
    type: CHECK_CONFLICTS,
  });

  resetTimeForServices(serviceItems, -1, moment(startTime, 'HH:mm'));

  const conflictData = {
    date: date.format('YYYY-MM-DD'),
    clientId: client.id,
    items: [],
  };
  serviceItems.forEach((service) => {
    conflictData.items.push({
      clientId: client.id,
      serviceId: service.service.id,
      employeeId: provider.id,
      fromTime: service.fromTime.format('HH:mm:ss', { trim: false }),
      toTime: service.toTime.format('HH:mm:ss', { trim: false }),
      bookBetween: false,
      roomId: get(get(service, 'room', null), 'id', null),
      roomOrdinal: get(service, 'roomOrdinal', null),
      resourceId: get(get(service, 'resource', null), 'id', null),
      resourceOrdinal: get(service, 'resourceOrdinal', null),
    });
  });

  const conflicts = await AppointmentBook.postCheckConflicts(conflictData);
  this.setState({
    conflicts,
    isLoading: false,
  });
});
}


const cleanForm = () => ({
  type: CLEAN_FORM,
});

const setBookedBy = employee => ({
  type: SET_BOOKED_BY,
  data: { employee },
});

const setDate = date => ({
  type: SET_DATE,
  data: { date },
});

const setStartTime = startTime => ({
  type: SET_START_TIME,
  data: { startTime },
});

const setClient = client => ({
  type: SET_CLIENT,
  data: { client },
});

const setQuickApptRequested = requested => ({
  type: SET_QUICK_APPT_REQUESTED,
  data: { requested },
});

const checkConflictsSuccess = (conflicts, callback = false) => (dispatch) => {
  dispatch({
    type: CHECK_CONFLICTS_SUCCESS,
    data: { conflicts },
  });
  return !conflicts.length && callback ? callback() : true;
};

const checkConflictsFailed = () => ({
  type: CHECK_CONFLICTS_FAILED,
});

const checkConflicts = (appt = false, multipleClients = false, callback = false) => (dispatch, getState) => {
  dispatch({ type: CHECK_CONFLICTS });
  if (!appt) {
    const {
      date,
      service,
      client,
      startTime,
      bookedByEmployee,
    } = getState().newAppointmentReducer;

    if (service === null || client === null || bookedByEmployee === null) {
      return;
    }

    const fromTime = moment(startTime, 'HH:mm');
    const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
    appt = {
      date,
      bookedByEmployee,
      service,
      client,
      rebooked: false,
      items: [
        {
          service,
          client,
          employee: bookedByEmployee,
          isGuest: false,
          fromTime: fromTime.format('HH:mm:ss', { trim: false }),
          toTime: toTime.format('HH:mm:ss', { trim: false }),
        },
      ],
    };
  }

  const serviceItems = appt.items;
  let servicesToCheck = [];
  if (!appt.client || !appt.bookedByEmployee) {
    return;
  }

  servicesToCheck = serviceItems.filter(serviceItem => serviceItem.service &&
    serviceItem.employee && serviceItem.client);

  if (!servicesToCheck.length) {
    return;
  }

  const conflictData = {
    bookedByEmployeeId: appt.bookedByEmployee.id,
    date: appt.date.format('YYYY-MM-DD'),
    clientId: appt.client.id,
    items: [],
  };

  servicesToCheck.forEach((serviceItem) => {
    if (serviceItem.service && serviceItem.employee && serviceItem.employee.id === 0) {
      return;
    }

    const formattedItem = {
      appointmentId: serviceItem.id ? serviceItem.id : null,
      clientId: multipleClients ? serviceItem.client.id : appt.client.id,
      serviceId: serviceItem.service.id,
      employeeId: serviceItem.employee.id,
      fromTime: moment(serviceItem.fromTime, 'HH:mm').format('HH:mm:ss', { trim: false }),
      toTime: moment(serviceItem.toTime, 'HH:mm').format('HH:mm:ss', { trim: false }),
      gapTime: moment().startOf('day').add(moment.duration(serviceItem.gapTime, 'm')).format('HH:mm:ss', { trim: false }),
      afterTime: moment().startOf('day').add(moment.duration(serviceItem.afterTime, 'm')).format('HH:mm:ss', { trim: false }),
      bookBetween: !!serviceItem.gapTime,
    };

    if (serviceItem.room) {
      formattedItem.roomId = get(serviceItem, 'roomId', null);
      formattedItem.roomOrdinal = get(serviceItem, 'roomOrdinal', null);
    }
    if (serviceItem.resource) {
      formattedItem.resourceId = get(serviceItem, 'resourceId', null);
      formattedItem.resourceOrdinal = get(serviceItem, 'resourceOrdinal', null);
    }

    conflictData.items.push(formattedItem);
  });

  AppointmentBook.postCheckConflicts(conflictData)
    .then(data => dispatch(checkConflictsSuccess(data, callback)))
    .catch(err => dispatch(checkConflictsFailed(err)));
};

const quickBookAppt = callback => (dispatch, getState) => {
  const {
    date,
    service,
    client,
    startTime,
    bookedByEmployee,
  } = getState().newAppointmentReducer;

  const fromTime = moment(startTime, 'HH:mm');
  const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
  const newAppt = {
    date,
    bookedByEmployee,
    service,
    client,
    rebooked: false,
    items: [
      {
        service,
        client,
        employee: bookedByEmployee,
        isGuest: false,
        fromTime: fromTime.format('HH:mm:ss', { trim: false }),
        toTime: toTime.format('HH:mm:ss', { trim: false }),
      },
    ],
  };
  const bookCallback = () => {
    const requestBody = serializeApptToRequestData(newAppt, []);
    dispatch({ type: BOOK_NEW_APPT });
    return Appointment.postNewAppointment(requestBody)
      .then((res) => {
        dispatch({
          type: ADD_APPOINTMENT,
          data: { appointment: res },
        });
        dispatch(bookNewApptSuccess(callback));
      })
      .catch((err) => {
        dispatch({
          type: BOOK_NEW_APPT_FAILED,
          data: { error: err },
        });
      });
  };

  return dispatch(checkConflicts(newAppt, false, bookCallback));
};

const bookNewAppt = appt => (dispatch) => {
  const requestBody = serializeApptToRequestData(appt, []);
  dispatch({ type: BOOK_NEW_APPT });
  return new Promise((resolve, reject) => {
    Appointment.postNewAppointment(requestBody)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const bookNewApptSuccess = (callback = false) => (dispatch) => {
  dispatch({ type: BOOK_NEW_APPT_SUCCESS });
  return callback ? callback() : true;
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
  checkConflicts,
  setQuickApptRequested,
  getConflicts,
};
export default newAppointmentActions;
