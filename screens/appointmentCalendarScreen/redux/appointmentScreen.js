import moment from 'moment';
import { groupBy, keyBy, times } from 'lodash';

import {
  GET_APPOINTMENTS_SUCCESS,
} from '../../../actions/appointment';

import { GET_PROVIDERS_SUCCESS } from '../../providersScreen/redux';

import apiWrapper from '../../../utilities/apiWrapper';

export const SET_PROVIDER_DATES = 'appointmentCalendar/SET_PROVIDER_DATES';
export const GET_APPOINTMENTS_CALENDAR = 'appointmentCalendar/GET_APPOINTMENTS';
export const GET_APPOINTMENTS_CALENDAR_SUCCESS = 'appointmentCalendar/GET_APPOINTMENTS_CALENDAR_SUCCESS';
export const GET_APPOINTMENTS_CALENDAR_FAILED = 'appointmentCalendar/GET_APPOINTMENTS_FAILED';
export const GET_PROVIDERS_CALENDAR = 'appointmentCalendar/GET_PROVIDERS';
export const GET_PROVIDERS_CALENDAR_FAILED = 'appointmentCalendar/GET_PROVIDERS_FAILED';

const getProvidersScheduleSuccess = (apptGridSettings, dictionary) => ({
  type: GET_APPOINTMENTS_CALENDAR_SUCCESS,
  data: { apptGridSettings, dictionary },
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
      const step = 15;
      const apptGridSettings = {
        startTime,
        endTime,
        numOfRow: endTime.diff(startTime, 'minutes') / step,
        step,
      };
      dispatch(getProvidersScheduleSuccess(apptGridSettings, response));
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

const getProviderCalendar = (id, startDate, endDate) => (dispatch) => {
  dispatch({ type: GET_PROVIDERS_CALENDAR });
  return apiWrapper.doRequest('getEmployeeAppointments', {
    path: { id, dateFrom: startDate, dateTo: endDate },
  })
    .then((appointmentResponse) => {
      dispatch({ type: GET_APPOINTMENTS_SUCCESS, data: { appointmentResponse } });
      return dispatch(getProviderSchedule(id, startDate, endDate, appointmentResponse));
    })
    .catch(err => dispatch(getProvidersCalendarError(err)));
};

const getProviderSchedule = (id, startDate, endDate, appointmentResponse) => dispatch => apiWrapper.doRequest('getEmployeeScheduleRange', {
  path: { id, startDate, endDate },
})
  .then((response) => {
    const indexedArray = [];

    let startTime;
    let endTime;
    let newTime;
    let schedule;
    let appointment;
    for (let i = 0; i < response.length; i += 1) {
      schedule = response[i];
      if (schedule) {
        schedule.provider = { id };
        if (!indexedArray[moment(schedule.date).format('YYYY-MM-DD')]) {
          indexedArray[moment(schedule.date).format('YYYY-MM-DD')] = schedule;
        }
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
        schedule = indexedArray[moment(appointment.date).format('YYYY-MM-DD')];
        if (schedule) {
          if (!schedule.appointments) {
            schedule.appointments = [];
          }
          schedule.appointments.push(appointment);
        }
      }
    }

    const step = 30;
    const apptGridSettings = {
      startTime,
      endTime,
      numOfRow: endTime.diff(startTime, 'minutes') / step,
      step,
    };
    dispatch(getProvidersScheduleSuccess(apptGridSettings, indexedArray));
  })
  .catch((err) => {
    console.log(err);
  });

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

const setProviderScheduleDates = dates => ({
  type: SET_PROVIDER_DATES,
  data: { dates },
});

export const appointmentCalendarActions = {
  getAppoinmentsCalendar,
  getProviderCalendar,
  setProviderScheduleDates,
};

const initialState = {
  isLoading: false,
  error: null,
  dates: [moment()],
  providerAppointments: [],
  apptGridSettings: {
    startTime: moment('07:00', 'HH:mm'),
    endTime: moment('21:00', 'HH:mm'),
    numOfRow: 0,
    step: 15,
  },
};

export default function appoinmentScreenReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_PROVIDER_DATES:
      return {
        ...state,
        dates: data.dates,
      };
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
        apptGridSettings: data.apptGridSettings,
        providerAppointments: data.dictionary,
      };
    default:
      return state;
  }
}
