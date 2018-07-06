import moment, { updateLocale } from 'moment';
import { get, isNil } from 'lodash';

import apiWrapper from '../utilities/apiWrapper';
import {
  ADD_APPOINTMENT,
} from '../screens/appointmentCalendarScreen/redux/appointmentScreen';

export const ADD_GUEST = 'newAppointment/ADD_GUEST';
export const REMOVE_GUEST = 'newAppointment/REMOVE_GUEST';
export const SET_GUEST_CLIENT = 'newAppointment/SET_GUEST_CLIENT';
export const ADD_GUEST_SERVICE = 'newAppointment/ADD_GUEST_SERVICE';
export const REMOVE_GUEST_SERVICE = 'newAppointment/REMOVE_GUEST_SERVICE';

export const CLEAN_FORM = 'newAppointment/CLEAN_FORM';
export const UPDATE_TOTALS = 'newAppointment/UPDATE_TOTALS';
export const CHECK_CONFLICTS = 'newAppointment/CHECK_CONFLICTS';
export const CHECK_CONFLICTS_SUCCESS = 'newAppointment/CHECK_CONFLICTS_SUCCESS';
export const CHECK_CONFLICTS_FAILED = 'newAppointment/CHECK_CONFLICTS_FAILED';
export const ADD_NEW_APPT_ITEM = 'newAppointment/ADD_NEW_APPT_ITEM';
export const REMOVE_NEW_APPT_ITEM = 'newAppointment/REMOVE_NEW_APPT_ITEM';
export const SET_BOOKED_BY = 'newAppointment/SET_BOOKED_BY';
export const SET_START_TIME = 'newAppointment/SET_START_TIME';
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

const cleanForm = () => ({
  type: CLEAN_FORM,
});

const setBookedBy = employee => ({
  type: SET_BOOKED_BY,
  data: { employee },
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

  apiWrapper.doRequest('checkConflicts', {
    body: conflictData,
  })
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
    return apiWrapper.doRequest('postNewAppointment', {
      body: requestBody,
    })
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

const udpateTotals = () => ({
  type: UPDATE_TOTALS,
});

const addGuest = () => ({
  type: ADD_GUEST,
});

const removeGuest = () => ({
  type: REMOVE_GUEST,
});

const setGuestClient = (guestIndex, client) => ({
  type: SET_GUEST_CLIENT,
  data: { guestIndex, client },
});

const addGuestService = (guestIndex, item) => (dispatch) => {
  dispatch({
    type: ADD_GUEST_SERVICE,
    data: { guestIndex, item },
  });
  return dispatch(udpateTotals());
};

const removeGuestService = (guestIndex, serviceIndex) => (dispatch) => {
  dispatch({
    type: REMOVE_GUEST_SERVICE,
    data: { guestIndex, serviceIndex },
  });
  return dispatch(udpateTotals());
};

const addNewApptItem = item => (dispatch) => {
  dispatch({
    type: ADD_NEW_APPT_ITEM,
    data: { item },
  });
  return dispatch(udpateTotals());
};

const removeNewApptItem = index => (dispatch) => {
  dispatch({
    type: REMOVE_NEW_APPT_ITEM,
    data: { index },
  });
  return dispatch(udpateTotals());
};

const setNewApptStartTime = startTime => ({
  type: SET_START_TIME,
  data: { startTime },
});

const setNewApptTime = (startTime, endTime, index = false) => ({
  type: SET_NEW_APPT_START_TIME,
  data: { index, startTime, endTime },
});

const setNewApptDate = (date, index = false) => ({
  type: SET_NEW_APPT_DATE,
  data: { index, date },
});

const setNewApptEmployee = (employee, index = false) => ({
  type: SET_NEW_APPT_EMPLOYEE,
  data: { index, employee },
});

const setNewApptService = (service, index = false) => (dispatch) => {
  dispatch({
    type: SET_NEW_APPT_SERVICE,
    data: { index, service },
  });

  return dispatch(setNewApptDuration());
};

const setNewApptClient = (client, index = false) => ({
  type: SET_NEW_APPT_CLIENT,
  data: { index, client },
});

const setNewApptRequested = (requested, index = false) => ({
  type: SET_NEW_APPT_REQUESTED,
  data: { index, requested },
});

const setNewApptRecurring = (recurring, index = false) => ({
  type: SET_NEW_APPT_RECURRING,
  data: { index, recurring },
});

const setNewApptRecurringType = (recurringType, index = false) => ({
  type: SET_NEW_APPT_RECURRING_TYPE,
  data: { recurringType, index },
});

const setNewApptRepeatPeriod = (repeatPeriod, index = false) => ({
  type: SET_NEW_APPT_REPEAT_PERIOD,
  data: { repeatPeriod, index },
});

const setNewApptEndsAfter = (endsAfter, index = false) => ({
  type: SET_NEW_APPT_ENDS_AFTER,
  data: { endsAfter, index },
});

const setNewApptEndsOnDate = (date, index = false) => ({
  type: SET_NEW_APPT_ENDS_ON_DATE,
  data: { date, index },
});

const setNewApptFirstAvailable = (isFirstAvailable, index = false) => ({
  type: SET_NEW_APPT_FIRST_AVAILABLE,
  data: { index, isFirstAvailable },
});

const setNewApptRemarks = (remarks, index = false) => ({
  type: SET_NEW_APPT_REMARKS,
  data: { index, remarks },
});

const setNewApptDuration = (index = false) => (dispatch, getState) => {
  const {
    service, startTime, body: { items },
  } = getState().newAppointmentReducer;
  const serviceDuration = moment.duration(service.maxDuration);
  const endTime = moment(startTime, 'HH:mm').add(serviceDuration);

  return dispatch({ type: SET_NEW_APPT_START_TIME, data: { startTime, endTime, index } });
};

const bookNewAppt = appt => (dispatch) => {
  const requestBody = serializeApptToRequestData(appt, []);
  dispatch({ type: BOOK_NEW_APPT });
  return new Promise((resolve, reject) => {
    apiWrapper.doRequest('postNewAppointment', {
      body: requestBody,
    })
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
  setNewApptStartTime,
  setNewApptClient,
  setNewApptDate,
  setNewApptDuration,
  setNewApptTime,
  setNewApptEmployee,
  setNewApptService,
  setNewApptRequested,
  setNewApptRecurring,
  setNewApptRecurringType,
  setNewApptFirstAvailable,
  setNewApptRemarks,
  addNewApptItem,
  removeNewApptItem,
  bookNewAppt,
  quickBookAppt,
  addGuest,
  removeGuest,
  setGuestClient,
  addGuestService,
  removeGuestService,
  udpateTotals,
  setBookedBy,
  checkConflicts,
  cleanForm,
};
export default newAppointmentActions;
