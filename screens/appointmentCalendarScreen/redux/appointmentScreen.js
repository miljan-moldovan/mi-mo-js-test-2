import moment from 'moment';

import {
  GET_APPOINTMENTS_SUCCESS,
} from '../../../actions/appointment';

import { GET_PROVIDERS_SUCCESS } from '../../providersScreen/redux';

import apiWrapper from '../../../utilities/apiWrapper';

export const GET_APPOINTMENTS_CALENDAR = 'appointmentCalendar/GET_APPOINTMENTS';
export const GET_APPOINTMENTS_CALENDAR_SUCCESS = 'appointmentCalendar/GET_APPOINTMENTS_CALENDAR_SUCCESS';
export const GET_APPOINTMENTS_CALENDAR_FAILED = 'appointmentCalendar/GET_APPOINTMENTS_FAILED';
export const GET_PROVIDERS_CALENDAR = 'appointmentCalendar/GET_PROVIDERS';
export const GET_PROVIDERS_CALENDAR_FAILED = 'appointmentCalendar/GET_PROVIDERS_FAILED';

const getProvidersScheduleSuccess = (startTime, endTime, dictionary) => ({
  type: GET_APPOINTMENTS_CALENDAR_SUCCESS,
  data: { startTime, endTime, dictionary },
});

const getProvidersSchedule = (providers, date, appointmentResponse) => (dispatch) => {
  let ids = '';
  for (let i = 0; i < providers.length; i += 1) {
    if (i !== 0) {
      ids += `&ids=${providers[i].id}`;
    } else {
      ids += `${providers[i].id}`;
    }
  }
  return apiWrapper.doRequest('getEmployeeSchedule', {
    path: {
      date,
    },
    query: {
      ids,
    },
  })
    .then((response) => {
      let startTime;
      let endTime;
      let newTime;
      let schedule;
      let appointment;
      for (let i = 0; i < providers.length; i += 1) {
        schedule = response[providers[i].id];
        if (schedule) {
          schedule.provider = providers[i];
          if (schedule.scheduledIntervals && schedule.scheduledIntervals.length > 0) {
            newTime = moment(schedule.scheduledIntervals[0].start, 'HH:mm');
            startTime = startTime && startTime.isBefore(newTime) ? startTime : newTime;
            newTime = moment(schedule.scheduledIntervals[0].end, 'HH:mm');
            endTime = endTime && endTime.isAfter(newTime) ? endTime : newTime;
          }
        }
      }
      for (let i = 0; i < appointmentResponse.length; i += 1) {
        appointment = appointmentResponse[i];
        if (appointment.employee) {
          schedule = response[appointment.employee.id];
          if (schedule) {
            if (!schedule.appointments) {
              schedule.appointments = [];
            }
            schedule.appointments.push(appointment);
          }
        }
      }
      dispatch(getProvidersScheduleSuccess(startTime, endTime, response));
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProvidersCalendarError = error => ({
  type: GET_PROVIDERS_CALENDAR_FAILED,
  data: { error },
});

const getProvidersCalendar = (appointmentResponse, date) => (dispatch) => {
  dispatch({ type: GET_PROVIDERS_CALENDAR });
  return apiWrapper.doRequest('getEmployees', {})
    .then((providers) => {
      dispatch({ type: GET_PROVIDERS_SUCCESS, data: { providers } });
      return dispatch(getProvidersSchedule(providers, date, appointmentResponse));
    })
    .catch(err => dispatch(getProvidersCalendarError(err)));
};

const getAppointmentsFailed = error => ({
  type: GET_APPOINTMENTS_CALENDAR_FAILED,
  data: { error },
});

const getAppoinmentsCalendar = date => (dispatch) => {
  dispatch({ type: GET_APPOINTMENTS_CALENDAR });
  return apiWrapper.doRequest('getAppointmentsByDate', {
    path: {
      date,
    },
  })
    .then((response) => {
      dispatch({ type: GET_APPOINTMENTS_SUCCESS, data: { appointmentResponse: response } });
      return dispatch(getProvidersCalendar(response, date));
    })
    .catch(error => dispatch(getAppointmentsFailed(error)));
};

export const appointmentCalendarActions = {
  getAppoinmentsCalendar,
};

const initialState = {
  isLoading: false,
  error: null,
  providerAppointments: [],
  startTime: '',
  endTime: '',
};

export default function appoinmentScreenReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case GET_APPOINTMENTS_CALENDAR:
      return {
        ...state,
        isLoading: true,
      };
    case GET_APPOINTMENTS_CALENDAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        startTime: data.startTime,
        endTime: data.endTime,
        providerAppointments: data.dictionary,
      };
    default:
      return state;
  }
}
