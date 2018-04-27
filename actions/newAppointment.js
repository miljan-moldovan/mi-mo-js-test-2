import moment from 'moment';

import apiWrapper from '../utilities/apiWrapper';
import {
  ADD_APPOINTMENT,
} from '../screens/appointmentCalendarScreen/redux/appointmentScreen';

export const ADD_NEW_APPT_ITEM = 'newAppointment/ADD_NEW_APPT_ITEM';
export const SET_NEW_APPT_EMPLOYEE = 'newAppointment/SET_NEW_APPT_EMPLOYEE';
export const SET_NEW_APPT_DATE = 'newAppointment/SET_NEW_APPT_DATE';
export const SET_NEW_APPT_SERVICE = 'newAppointment/SET_NEW_APPT_SERVICE';
export const SET_NEW_APPT_CLIENT = 'newAppointment/SET_NEW_APPT_CLIENT';
export const SET_NEW_APPT_START_TIME = 'newAppointment/SET_NEW_APPT_START_TIME';
export const SET_NEW_APPT_DURATION = 'newAppointment/SET_NEW_APPT_DURATION';
export const SET_NEW_APPT_REQUESTED = 'newAppointment/SET_NEW_APPT_REQUESTED';
export const SET_NEW_APPT_FIRST_AVAILABLE = 'newAppointment/SET_NEW_APPT_FIRST_AVAILABLE';
export const BOOK_NEW_APPT = 'newAppointment/BOOK_NEW_APPT';
export const BOOK_NEW_APPT_SUCCESS = 'newAppointment/BOOK_NEW_APPT_SUCCESS';
export const BOOK_NEW_APPT_FAILED = 'newAppointment/BOOK_NEW_APPT_FAILED';

const addNewApptItem = () => ({
  type: ADD_NEW_APPT_ITEM,
});

const setNewApptTime = (startTime, endTime, index = 0) => ({
  type: SET_NEW_APPT_START_TIME,
  data: { index, startTime, endTime },
});

const setNewApptDate = (date, index = 0) => ({
  type: SET_NEW_APPT_DATE,
  data: { index, date },
});

const setNewApptEmployee = (employee, index = 0) => ({
  type: SET_NEW_APPT_EMPLOYEE,
  data: { index, employee },
});

const setNewApptService = (service, index = 0) => (dispatch) => {
  dispatch({
    type: SET_NEW_APPT_SERVICE,
    data: { index, service },
  });

  return dispatch(setNewApptDuration());
};

const setNewApptClient = (client, index = 0) => ({
  type: SET_NEW_APPT_CLIENT,
  data: { index, client },
});

const setNewApptRequested = (requested, index = 0) => ({
  type: SET_NEW_APPT_REQUESTED,
  data: { index, requested },
});

const setNewApptFirstAvailable = (isFirstAvailable, index = 0) => ({
  type: SET_NEW_APPT_FIRST_AVAILABLE,
  data: { index, isFirstAvailable },
});

const setNewApptDuration = (index = 0) => (dispatch, getState) => {
  const { service, body: { items } } = getState().newAppointmentReducer;
  const { fromTime } = items[index];
  const serviceDuration = moment.duration(service.maxDuration);
  const endTime = moment(fromTime, 'HH:mm').add(serviceDuration);

  return dispatch({ type: SET_NEW_APPT_START_TIME, data: { startTime: fromTime, endTime, index } });
};

const bookNewAppt = callback => (dispatch, getState) => {
  const { body } = getState().newAppointmentReducer;
  dispatch({ type: BOOK_NEW_APPT });
  return apiWrapper.doRequest('postNewAppointment', {
    body,
  })
    .then((res) => {
      const { service } = body.items[0];
      service.description = service.name;
      body.items[0].service = service;
      dispatch({
        type: ADD_APPOINTMENT,
        data: { appointment: body.items[0] },
      });
      dispatch(bookNewApptSuccess(callback));
    })
    .catch((err) => {
      dispatch({ type: BOOK_NEW_APPT_FAILED });
    });
};

const bookNewApptSuccess = (callback = false) => (dispatch) => {
  dispatch({ type: BOOK_NEW_APPT_SUCCESS });
  return callback ? callback() : true;
};

const newAppointmentActions = {
  setNewApptClient,
  setNewApptDate,
  setNewApptDuration,
  setNewApptTime,
  setNewApptEmployee,
  setNewApptService,
  setNewApptRequested,
  setNewApptFirstAvailable,
  bookNewAppt,
};
export default newAppointmentActions;
