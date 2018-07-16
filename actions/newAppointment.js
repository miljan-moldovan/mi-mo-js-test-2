import moment from 'moment';
import { get, isNil, isFunction } from 'lodash';
import uuid from 'uuid/v4';

import { AppointmentBook, Appointment } from '../utilities/apiWrapper';
import {
  ADD_APPOINTMENT,
} from '../screens/appointmentCalendarScreen/redux/appointmentScreen';
import {
  appointmentLength,
  serializeApptToRequestData,
} from '../redux/selectors/newAppt';

export const ADD_GUEST = 'newAppointment/ADD_GUEST';
export const SET_GUEST_CLIENT = 'newAppointment/SET_GUEST_CLIENT';
export const REMOVE_GUEST = 'newAppointment/REMOVE_GUEST';

export const SET_DATE = 'newAppointment/SET_DATE';
export const SET_START_TIME = 'newAppointment/SET_START_TIME';
export const SET_BOOKED_BY = 'newAppointment/SET_BOOKED_BY';
export const SET_CLIENT = 'newAppointment/SET_CLIENT';
export const SET_QUICK_APPT_REQUESTED = 'newAppointment/SET_QUICK_APPT_REQUESTED';

export const CLEAR_SERVICE_ITEMS = 'newAppointment/CLEAR_SERVICE_ITEMS';
export const ADD_QUICK_SERVICE_ITEM = 'newAppointment/ADD_QUICK_SERVICE_ITEM';
export const ADD_SERVICE_ITEM = 'newAppointment/ADD_SERVICE_ITEM';
export const UPDATE_SERVICE_ITEM = 'newAppointment/UPDATE_SERVICE_ITEM';
export const REMOVE_SERVICE_ITEM = 'newAppointment/REMOVE_SERVICE_ITEM';

export const CLEAN_FORM = 'newAppointment/CLEAN_FORM';
export const IS_BOOKING_QUICK_APPT = 'newAppointment/IS_BOOKING_QUICK_APPT';
export const CHECK_CONFLICTS = 'newAppointment/CHECK_CONFLICTS';
export const CHECK_CONFLICTS_SUCCESS = 'newAppointment/CHECK_CONFLICTS_SUCCESS';
export const CHECK_CONFLICTS_FAILED = 'newAppointment/CHECK_CONFLICTS_FAILED';

export const BOOK_NEW_APPT = 'newAppointment/BOOK_NEW_APPT';
export const BOOK_NEW_APPT_SUCCESS = 'newAppointment/BOOK_NEW_APPT_SUCCESS';
export const BOOK_NEW_APPT_FAILED = 'newAppointment/BOOK_NEW_APPT_FAILED';

const clearServiceItems = () => ({
  type: CLEAR_SERVICE_ITEMS,
});

const addGuest = () => ({
  type: ADD_GUEST,
  data: {
    guest: {
      guestId: uuid(),
      client: null,
    },
  },
});

const removeGuest = () => ({
  type: REMOVE_GUEST,
});

const setGuestClient = (guestId, client) => (dispatch, getState) => {
  const newGuests = getState().newAppointmentReducer.guests;
  const guestIndex = newGuests.findIndex(item => item.guestId === guestId);
  newGuests[guestIndex].client = client;

  return dispatch({
    type: SET_GUEST_CLIENT,
    data: { guests: newGuests },
  });
};

const resetTimeForServices = (items, index, initialFromTime) => {
  items.forEach((item, i) => {
    if (i > index) {
      const prevItem = items[i - 1];

      item.fromTime = prevItem && prevItem.toTime ?
        moment(prevItem.toTime) : initialFromTime;
      item.toTime = moment(item.fromTime).add(moment.duration(item.service ?
        item.service.service.maxDuration : item.maxDuration));
    }
  });

  return items;
};

const isBookingQuickAppt = isBookingQuickAppt => ({
  type: IS_BOOKING_QUICK_APPT,
  data: { isBookingQuickAppt },
});

const addQuickServiceItem = (service, guestId = false) => (dispatch, getState) => {
  const {
    client,
    guests,
    startTime,
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

// const addServiceItemExtras = (parentId, type, services) => (dispatch, getState) => {

// };


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

const getConflicts = () => async (dispatch, getState) => {
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
  serviceItems.forEach((serviceItem) => {
    conflictData.items.push({
      clientId: serviceItem.guestId ? client.id : serviceItem.service.client.id,
      serviceId: serviceItem.service.service.id,
      employeeId: serviceItem.service.employee.id,
      fromTime: serviceItem.fromTime.format('HH:mm:ss', { trim: false }),
      toTime: serviceItem.toTime.format('HH:mm:ss', { trim: false }),
      bookBetween: false,
      roomId: get(get(serviceItem.service, 'room', null), 'id', null),
      roomOrdinal: get(serviceItem.service, 'roomOrdinal', null),
      resourceId: get(get(serviceItem.service, 'resource', null), 'id', null),
      resourceOrdinal: get(serviceItem.service, 'resourceOrdinal', null),
    });
  });

  try {
    const conflicts = await AppointmentBook.postCheckConflicts(conflictData);
    dispatch({
      type: CHECK_CONFLICTS_SUCCESS,
      data: { conflicts },
    });
  } catch (err) {
    dispatch({
      type: CHECK_CONFLICTS_FAILED,
    });
  }
};

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

const checkConflictsSuccess = conflicts => ({
  type: CHECK_CONFLICTS_SUCCESS,
  data: { conflicts },
});

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

const quickBookAppt = (callback = false) => (dispatch, getState) => {
  const {
    startTime,
    serviceItems,
  } = getState().newAppointmentReducer;

  dispatch({
    type: BOOK_NEW_APPT,
  });
  resetTimeForServices(serviceItems, -1, startTime);
  const requestBody = serializeApptToRequestData(getState(), true);

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
  if (isFunction(callback)) {
    callback();
  }
  return dispatch({ type: BOOK_NEW_APPT_SUCCESS });
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
  isBookingQuickAppt,
  addGuest,
  setGuestClient,
  removeGuest,
};
export default newAppointmentActions;
