import moment from 'moment';
import { orderBy } from 'lodash';

import {
  GET_APPOINTMENTS_SUCCESS,
} from '../../../actions/appointment';

import apiWrapper from '../../../utilities/apiWrapper';

export const SET_NEW_APPT_EMPLOYEE = 'appointmentCalendar/SET_NEW_APPT_EMPLOYEE';
export const SET_NEW_APPT_DATE = 'appointmentCalendar/SET_NEW_APPT_DATE';
export const SET_NEW_APPT_SERVICE = 'appointmentCalendar/SET_NEW_APPT_SERVICE';
export const SET_NEW_APPT_CLIENT = 'appointmentCalendar/SET_NEW_APPT_CLIENT';
export const SET_NEW_APPT_START_TIME = 'appointmentCalendar/SET_NEW_APPT_START_TIME';
export const SET_NEW_APPT_DURATION = 'appointmentCalendar/SET_NEW_APPT_DURATION';
export const SET_NEW_APPT_REQUESTED = 'appointmentCalendar/SET_NEW_APPT_REQUESTED';
export const SET_NEW_APPT_FIRST_AVAILABLE = 'appointmentCalendar/SET_NEW_APPT_FIRST_AVAILABLE';

export const SET_DATE_RANGE = 'appointmentCalendar/SET_DATE_RANGE';
export const SET_PICKER_MODE = 'appointmentCalendar/SET_PICKER_MODE';
export const SET_SELECTED_PROVIDER = 'appointmentCalendar/SET_SELECTED_PROVIDER';
export const SET_PROVIDER_DATES = 'appointmentCalendar/SET_PROVIDER_DATES';
export const GET_PROVIDERS_CALENDAR = 'appointmentCalendar/GET_PROVIDERS_CALENDAR';
export const GET_PROVIDER_CALENDAR_SUCCESS = 'appointmentCalendar/GET_PROVIDER_CALENDAR_SUCCESS';
export const GET_APPOINTMENTS_CALENDAR = 'appointmentCalendar/GET_APPOINTMENTS';
export const GET_APPOINTMENTS_CALENDAR_SUCCESS = 'appointmentCalendar/GET_APPOINTMENTS_CALENDAR_SUCCESS';
export const GET_APPOINTMENTS_CALENDAR_FAILED = 'appointmentCalendar/GET_APPOINTMENTS_FAILED';

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
  const { newAppointment: { service } } = getState().appointmentScreenReducer;
};

const bookNewAppt = () => (dispatch, getState) => {
  const { newAppointment } = getState().appointmentScreenReducer;
  return apiWrapper.doRequest('postNewAppointment', {
    body: newAppointment.body,
  })
    .then(res => console.warn(res))
    .catch(err => console.warn(err));
};

const getProviderScheduleSuccess = (apptGridSettings, dictionary) => ({
  type: GET_PROVIDER_CALENDAR_SUCCESS,
  data: { apptGridSettings, dictionary },
});

const getProvidersScheduleSuccess = (apptGridSettings, dictionary, providers) => ({
  type: GET_APPOINTMENTS_CALENDAR_SUCCESS,
  data: { apptGridSettings, dictionary, providers },
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
          const provider = providers[i];
          schedule.provider = provider;
          if (schedule.scheduledIntervals && schedule.scheduledIntervals.length > 0) {
            provider.schedule = schedule.scheduledIntervals;
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
      dispatch(getProvidersScheduleSuccess(apptGridSettings, response, providers));
    })
    .catch((err) => {
      console.warn(err);
    });
};

const getProvidersCalendarError = error => ({
  type: GET_APPOINTMENTS_CALENDAR_FAILED,
  data: { error },
});

const getProvidersCalendar = (appointmentResponse, date) => (dispatch) => {
  dispatch({ type: GET_PROVIDERS_CALENDAR });
  return apiWrapper.doRequest('getEmployees', { query: { maxCount: 10000 } })
    .then((employees) => {
      const providers = orderBy(employees, 'appointmentOrder', 'asc');
      return dispatch(getProvidersSchedule(providers, date, appointmentResponse));
    })
    .catch(err => dispatch(getProvidersCalendarError(err)));
};

const getProviderCalendar = () => (dispatch, getState) => {
  const { selectedProvider, startDate, endDate } = getState().appointmentScreenReducer;
  dispatch({ type: GET_PROVIDERS_CALENDAR });
  dispatch({ type: GET_APPOINTMENTS_CALENDAR });
  return apiWrapper.doRequest('getEmployeeAppointments', {
    path: { id: selectedProvider.id, dateFrom: moment(startDate).format('YYYY-MM-DD'), dateTo: moment(endDate).format('YYYY-MM-DD') },
  })
    .then((appointmentResponse) => {
      dispatch({ type: GET_APPOINTMENTS_SUCCESS, data: { appointmentResponse } });
      return dispatch(getProviderSchedule(selectedProvider.id, moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), appointmentResponse));
    })
    .catch(err => dispatch(getProvidersCalendarError(err)));
};

const getProviderSchedule = (id, startDate, endDate, appointmentResponse) => dispatch => apiWrapper.doRequest('getEmployeeScheduleRange', {
  path: { id, startDate, endDate },
})
  .then((response) => {
    const dictionary = {};

    let startTime;
    let endTime;
    let newTime;
    let schedule;
    let appointment;
    for (let i = 0; i < response.length; i += 1) {
      schedule = response[i];
      if (schedule) {
        schedule.provider = { id };
        if (!dictionary[moment(schedule.date).format('YYYY-MM-DD')]) {
          dictionary[moment(schedule.date).format('YYYY-MM-DD')] = schedule;
        }
        // dictionary[moment(schedule.date).format('YYYY-MM-DD')].push(schedule);

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
        schedule = dictionary[moment(appointment.date).format('YYYY-MM-DD')];
        if (schedule) {
          if (!schedule.appointments) {
            schedule.appointments = [];
          }
          schedule.appointments.push(appointment);
        }
      }
    }

    const step = 15;
    if (!startTime) {
      startTime = initialState.apptGridSettings.startTime;
    }
    if (!endTime) {
      endTime = initialState.apptGridSettings.endTime;
    }

    const apptGridSettings = {
      step,
      endTime,
      startTime,
      numOfRow: endTime.diff(startTime, 'minutes') / step,
    };
    dispatch(getProviderScheduleSuccess(apptGridSettings, dictionary));
  })
  .catch((err) => {
    console.warn(err);
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

const setProviderScheduleDates = (startDate, endDate) => (dispatch) => {
  dispatch({ type: SET_PROVIDER_DATES, data: { startDate, endDate } });
  return dispatch(setScheduleDateRange());
};

const setPickerMode = pickerMode => (dispatch) => {
  dispatch({
    type: SET_PICKER_MODE,
    data: { pickerMode },
  });
  return dispatch(setScheduleDateRange());
};

const setScheduleDateRange = () => (dispatch, getState) => {
  const { startDate, endDate, pickerMode } = getState().appointmentScreenReducer;
  const dates = [];
  let diff = 0;

  if (pickerMode === 'week') {
    diff = 6;
    dispatch({ type: SET_PROVIDER_DATES, data: { startDate, endDate: moment(moment(startDate).add(6, 'day')) } });
  }
  for (let i = 0; i <= diff; i += 1) {
    dates.push(moment(moment(startDate).add(i, 'day')));
  }
  dispatch({ type: SET_DATE_RANGE, data: { dates } });
  return dispatch(getCalendarData());
};

const setSelectedProvider = selectedProvider => ({
  type: SET_SELECTED_PROVIDER,
  data: { selectedProvider },
});

const getCalendarData = () => (dispatch, getState) => {
  const { startDate, selectedProvider } = getState().appointmentScreenReducer;
  if (selectedProvider && selectedProvider !== 'all') {
    return dispatch(getProviderCalendar());
  }
  // dispatch({ type: SET_PICKER_MODE, data: { pickerMode: 'day' } });
  return dispatch(getAppoinmentsCalendar(moment(startDate).format('YYYY-MM-DD')));
};

export const appointmentCalendarActions = {
  getCalendarData,
  getAppoinmentsCalendar,
  getProviderCalendar,
  setProviderScheduleDates,
  setPickerMode,
  setSelectedProvider,
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

const initialState = {
  isLoading: false,
  error: null,
  pickerMode: 'day',
  startDate: moment(),
  endDate: moment(),
  dates: [moment()],
  selectedProvider: 'all',
  providerAppointments: [],
  providerSchedule: [],
  apptGridSettings: {
    startTime: moment('07:00', 'HH:mm'),
    endTime: moment('21:00', 'HH:mm'),
    numOfRow: 0,
    step: 15,
  },
  providers: [],
  newAppointment: {
    service: null,
    client: null,
    employee: null,
    body: {
      date: moment(),
      bookedByEmployeeId: 0,
      remarks: '',
      displayColor: '',
      recurring: {
        repeatPeriod: 0,
        endsAfterCount: 0,
        endsOnDate: moment(),
      },
      clientInfo: {
        id: 0,
        email: '',
        phones: [
          {
            type: 'work',
            value: '',
          },
        ],
        confirmationType: null,
      },
      items: [
        {
          date: moment(),
          fromTime: 'string',
          toTime: 'string',
          employeeId: 0,
          bookedByEmployeeId: 0,
          serviceId: 0,
          clientId: 0,
          requested: true,
          isFirstAvailable: false,
        },
      ],
    },
  },
};

export default function appointmentScreenReducer(state = initialState, action) {
  const { type, data } = action;
  const { newAppointment } = state;
  switch (type) {
    case SET_NEW_APPT_REQUESTED:
      newAppointment.body.item[0].requested = data.requested;
      return {
        ...state,
        newAppointment,
      };
    case SET_NEW_APPT_FIRST_AVAILABLE:
      newAppointment.body.item[0].isFirstAvailable = data.isFirstAvailable;
      return {
        ...state,
        newAppointment,
      };
    case SET_NEW_APPT_DATE:
      newAppointment.body.date = data.date;
      return {
        ...state,
        newAppointment,
      };
    case SET_NEW_APPT_START_TIME:
      newAppointment.body.startTime = data.startTime;
      newAppointment.body.endTime = data.endTime;
      newAppointment.body.items[0].fromTime = moment(data.startTime).format('HH:mm');
      newAppointment.body.items[0].toTime = moment(data.endTime).format('HH:mm');
      return {
        ...state,
        newAppointment,
      };
    case SET_NEW_APPT_CLIENT:
      newAppointment.client = data.client;
      newAppointment.body.clientInfo = data.client;
      newAppointment.body.items[0].clientId = data.client.id;
      return {
        ...state,
        newAppointment,
      };
    case SET_NEW_APPT_EMPLOYEE:
      newAppointment.employee = data.employee;
      newAppointment.body.bookedByEmployeeId = data.employee.id;
      newAppointment.body.items[0].employeeId = data.employee.id;
      newAppointment.body.items[0].bookedByEmployeeId = data.employee.id;
      return {
        ...state,
        newAppointment,
      };
    case SET_NEW_APPT_SERVICE:
      newAppointment.service = data.service;
      newAppointment.body.items[0].serviceId = data.service.id;
      return {
        ...state,
        newAppointment,
      };
    case SET_NEW_APPT_DURATION:
      // newAppointment.body.duration = data.duration;
      return {
        ...state,
        newAppointment,
      };
    case SET_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: data.selectedProvider,
      };
    case SET_PROVIDER_DATES:
      return {
        ...state,
        startDate: moment(data.startDate),
        endDate: moment(data.endDate),
      };
    case SET_DATE_RANGE:
      return {
        ...state,
        dates: data.dates,
      };
    case SET_PICKER_MODE:
      return {
        ...state,
        pickerMode: data.pickerMode,
      };
    case GET_APPOINTMENTS_CALENDAR:
      return {
        ...state,
        isLoading: true,
      };
    case GET_PROVIDER_CALENDAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: data.apptGridSettings,
        providerSchedule: data.dictionary,
      };
    case GET_APPOINTMENTS_CALENDAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: data.apptGridSettings,
        providerAppointments: data.dictionary,
        providers: data.providers,
      };
    default:
      return state;
  }
}
