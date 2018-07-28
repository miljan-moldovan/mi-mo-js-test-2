import moment from 'moment';
import { get, isNil, isFunction, isArray, isNull, reject } from 'lodash';
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
export const ADD_SERVICE_ITEM_EXTRAS = 'newAppointment/ADD_SERVICE_ITEM_EXTRAS';

export const CLEAN_FORM = 'newAppointment/CLEAN_FORM';
export const IS_BOOKING_QUICK_APPT = 'newAppointment/IS_BOOKING_QUICK_APPT';
export const CHECK_CONFLICTS = 'newAppointment/CHECK_CONFLICTS';
export const CHECK_CONFLICTS_SUCCESS = 'newAppointment/CHECK_CONFLICTS_SUCCESS';
export const CHECK_CONFLICTS_FAILED = 'newAppointment/CHECK_CONFLICTS_FAILED';

export const BOOK_NEW_APPT = 'newAppointment/BOOK_NEW_APPT';
export const BOOK_NEW_APPT_SUCCESS = 'newAppointment/BOOK_NEW_APPT_SUCCESS';
export const BOOK_NEW_APPT_FAILED = 'newAppointment/BOOK_NEW_APPT_FAILED';

export const SET_REMARKS = 'newAppointment/SET_REMARKS';

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

const removeGuest = (guestId = false) => ({
  type: REMOVE_GUEST,
  data: { guestId },
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
      let fromTime = initialFromTime;
      if (prevItem) {
        fromTime = get(prevItem.service, 'toTime', initialFromTime);
      }
      item.service.fromTime = fromTime;
      item.service.toTime = moment(item.service.fromTime).add(item.service.length);
    }
  });

  return items;
};

const isBookingQuickAppt = isBookingQuickAppt => ({
  type: IS_BOOKING_QUICK_APPT,
  data: { isBookingQuickAppt },
});

const addQuickServiceItem = (selectedServices, guestId = false) => (dispatch, getState) => {
  const {
    client,
    guests,
    startTime,
    bookedByEmployee,
  } = getState().newAppointmentReducer;
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
  const serviceClient = guestId ? get(guests.filter(guest => guest.guestId === guestId), 'client', null) : client;
  const newService = {
    service,
    length: serviceLength,
    client: serviceClient,
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
  dispatch({
    type: ADD_QUICK_SERVICE_ITEM,
    data: { serviceItem },
  });
  dispatch(addServiceItemExtras(
    serviceItem.itemId, // parentId
    'addon', // extraService type
    addons,
  ));
  dispatch(addServiceItemExtras(
    serviceItem.itemId, // parentId
    'recommended', // extraService type
    recommended,
  ));
  dispatch(addServiceItemExtras(
    serviceItem.itemId, // parentId
    'required', // extraService type
    required,
  ));
};

// const addServiceItem = (service, guestId = false) => (dispatch, getState) => {
//   const {
//     client,
//     guests,
//     startTime,
//     bookedByEmployee,
//   } = getState().newAppointmentReducer;
//   const length = appointmentLength(getState());
//   const fromTime = moment(startTime).add(moment.duration(length));
//   const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
//   const serviceClient = guestId ? get(guests.filter(guest => guest.guestId === guestId), 'client', null) : client;
//   const newService = {
//     service,
//     client: serviceClient,
//     requested: true,
//     employee: bookedByEmployee,
//     fromTime,
//     toTime,
//   };
//   const serviceItem = {
//     itemId: uuid(),
//     guestId,
//     service: newService,
//   };

//   return dispatch({
//     type: ADD_SERVICE_ITEM,
//     data: { serviceItem },
//   });
// };

const addServiceItem = serviceItem => (dispatch, getState) => {
  const { startTime } = getState().newAppointmentReducer;
  const newServiceItems = getState().newAppointmentReducer.serviceItems;
  newServiceItems.push(serviceItem);
  resetTimeForServices(newServiceItems, -1, startTime);
  return dispatch({
    type: ADD_SERVICE_ITEM,
    data: { serviceItems: newServiceItems },
  });
};

const addServiceItemExtras = (parentId, type, services) => (dispatch, getState) => {
  if (isNull(services)) {
    return;
  }
  const {
    client,
    guests,
    startTime,
    serviceItems,
    bookedByEmployee,
  } = getState().newAppointmentReducer;
  const [parentService] = serviceItems.filter(item => item.itemId === parentId);
  const { guestId } = parentService;
  const serializeServiceItem = (service) => {
    if (!service) {
      return;
    }
    const length = appointmentLength(getState());
    const serviceLength = moment.duration(service.maxDuration);
    const fromTime = moment(startTime).add(moment.duration(length));
    const toTime = moment(fromTime).add(serviceLength);
    const serviceClient = guestId ? get(guests.filter(guest => guest.guestId === guestId), 'client', null) : client;
    const newService = {
      service,
      length: serviceLength,
      client: serviceClient,
      requested: true,
      employee: bookedByEmployee,
      fromTime,
      toTime,
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
    item => item.type === type && item.parentId === parentId,
  );

  if (isArray(services)) {
    services.forEach((service) => {
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

const updateServiceItem = (serviceId, updatedService, guestId) => (dispatch, getState) => {
  const newServiceItems = getState().newAppointmentReducer.serviceItems;
  const serviceIndex = newServiceItems.findIndex(item => item.itemId === serviceId);
  const serviceItemToUpdate = newServiceItems[serviceIndex];
  const serviceItem = {
    guestId,
    itemId: newServiceItems[serviceIndex].itemId,
    service: updatedService,
  };
  newServiceItems.splice(serviceIndex, 1, serviceItem);
  resetTimeForServices(
    newServiceItems,
    serviceIndex - 1,
    serviceItemToUpdate.service.fromTime,
  );
  return dispatch({
    type: UPDATE_SERVICE_ITEM,
    data: { serviceItems: newServiceItems },
  });
};

const removeServiceItem = serviceId => (dispatch, getState) => {
  const newServiceItems = getState().newAppointmentReducer.serviceItems;
  const serviceIndex = newServiceItems.findIndex(item => item.itemId === serviceId);
  const removedAppt = newServiceItems.splice(serviceIndex, 1)[0];
  const extrasToRemove = newServiceItems.filter(item => item.parentId === removedAppt.itemId);
  extrasToRemove.forEach((extra) => {
    const extraIndex = newServiceItems.findIndex(item => item.itemId === extra.itemId);
    newServiceItems.splice(extraIndex, 1);
  });
  resetTimeForServices(
    newServiceItems,
    serviceIndex - 1,
    removedAppt.service.fromTime,
  );
  return dispatch({
    type: REMOVE_SERVICE_ITEM,
    data: { serviceItems: newServiceItems },
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

const getConflicts = callback => (dispatch, getState) => {
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
      clientId: serviceItem.guestId ? client.id : get(serviceItem.service.client, 'id', client.id),
      serviceId: serviceItem.service.service.id,
      employeeId: serviceItem.service.employee.id,
      fromTime: serviceItem.service.fromTime.format('HH:mm:ss', { trim: false }),
      toTime: serviceItem.service.toTime.format('HH:mm:ss', { trim: false }),
      bookBetween: false,
      roomId: get(get(serviceItem.service, 'room', null), 'id', null),
      roomOrdinal: get(serviceItem.service, 'roomOrdinal', null),
      resourceId: get(get(serviceItem.service, 'resource', null), 'id', null),
      resourceOrdinal: get(serviceItem.service, 'resourceOrdinal', null),
    });
  });

  AppointmentBook.postCheckConflicts(conflictData)
    .then((conflicts) => {
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

const quickBookAppt = (successCallback, errorCallback) => (dispatch, getState) => {
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
      dispatch(bookNewApptSuccess(successCallback));
    })
    .catch((err) => {
      alert('There was an error posting the appointment, please try again');
      dispatch({
        type: BOOK_NEW_APPT_FAILED,
        data: { error: err },
      });
      if (isFunction(errorCallback)) {
        errorCallback();
      }
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

const setRemarks = remarks => ({
  type: SET_REMARKS,
  data: { remarks },
});

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
};
export default newAppointmentActions;
