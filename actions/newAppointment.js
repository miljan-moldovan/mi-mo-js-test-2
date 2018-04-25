import apiWrapper from '../utilities/apiWrapper';

import {
  ADD_APPOINTMENT,
} from './appointment';

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

const setNewApptTime = (startTime, endTime) => ({
  type: SET_NEW_APPT_START_TIME,
  data: { startTime, endTime },
});

const setNewApptDate = date => ({
  type: SET_NEW_APPT_DATE,
  data: { date },
});

const setNewApptEmployee = employee => ({
  type: SET_NEW_APPT_EMPLOYEE,
  data: { employee },
});

const setNewApptService = service => ({
  type: SET_NEW_APPT_SERVICE,
  data: { service },
});

const setNewApptClient = client => ({
  type: SET_NEW_APPT_CLIENT,
  data: { client },
});

const setNewApptRequested = requested => ({
  type: SET_NEW_APPT_REQUESTED,
  data: { requested },
});

const setNewApptFirstAvailable = isFirstAvailable => ({
  type: SET_NEW_APPT_FIRST_AVAILABLE,
  data: { isFirstAvailable },
});

const setNewApptDuration = () => (dispatch, getState) => {
  const { service } = getState().newAppointmentReducer;
};

const bookNewAppt = callback => (dispatch, getState) => {
  const { body } = getState().newAppointmentReducer;
  dispatch({ type: BOOK_NEW_APPT });
  return apiWrapper.doRequest('postNewAppointment', {
    body,
  })
    .then((res) => {
      dispatch({
        type: ADD_APPOINTMENT,
        data: { appointment: res[0] },
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
