import moment from 'moment';
import { pick, omit, get, groupBy, orderBy, maxBy, minBy, times } from 'lodash';
import apiWrapper from '../../../utilities/apiWrapper';

import { POST_APPOINTMENT_RESIZE,
  POST_APPOINTMENT_RESIZE_SUCCESS,
  POST_APPOINTMENT_MOVE_SUCCESS,
  POST_APPOINTMENT_MOVE,
  POST_APPOINTMENT_MOVE_FAILED,
  UNDO_MOVE,
} from '../../../actions/appointment';

export const ADD_APPOINTMENT = 'appointmentScreen/ADD_APPOINTMENT';
export const SET_FILTER_OPTION_COMPANY = 'appointmentScreen/SET_FILTER_OPTION_COMPANY';
export const SET_FILTER_OPTION_POSITION = 'appointmentScreen/SET_FILTER_OPTION_POSITION';
export const SET_FILTER_OPTION_OFF_EMPLOYEES = 'appointmentScreen/SET_FILTER_OPTION_OFF_EMPLOYEES';
export const SET_FILTER_OPTION_MULTIBLOCK = 'appointmentScreen/SET_FILTER_OPTION_MULTIBLOCK';
export const SET_FILTER_OPTION_ROOM_ASSIGNMENTS = 'appointmentScreen/SET_FILTER_OPTION_ROOM_ASSIGNMENTS';
export const SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS = 'appointmentScreen/SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS';
export const SET_GRID_VIEW = 'appointmentScreen/SET_GRID_VIEW';
export const SET_GRID_ROOM_VIEW_SUCCESS = 'appointmentScreen/SET_GRID_ROOM_VIEW_SUCCESS';
export const SET_GRID_RESOURCE_VIEW_SUCCESS = 'appointmentScreen/SET_GRID_RESOURCE_VIEW_SUCCESS';
export const SET_GRID_ALL_VIEW_SUCCESS = 'appointmentScreen/SET_GRID_ALL_VIEW_SUCCESS';
export const SET_GRID_DAY_WEEK_VIEW_SUCCESS = 'appointmentScreen/SET_GRID_DAY_WEEK_VIEW_SUCCESS';
export const SET_DATE_RANGE = 'appointmentCalendar/SET_DATE_RANGE';
export const SET_PICKER_MODE = 'appointmentCalendar/SET_PICKER_MODE';
export const SET_SELECTED_PROVIDER = 'appointmentCalendar/SET_SELECTED_PROVIDER';
export const SET_SELECTED_FILTER = 'appointmentCalendar/SET_SELECTED_FILTER';
export const SET_PROVIDER_DATES = 'appointmentCalendar/SET_PROVIDER_DATES';
export const SET_WEEKLY_SCHEDULE = 'appointmentCalendar/SET_WEEKLY_SCHEDULE';
export const SET_WEEKLY_SCHEDULE_SUCCESS = 'appointmentCalendar/SET_WEEKLY_SCHEDULE_SUCCESS';
export const HIDE_TOAST = 'appointmentCalendar/HIDE_TOAST';

// const addAppointment = appointment => ({
//   type: ADD_APPOINTMENT,
//   data: { appointment },
// });
const serializeFilterOptions = (filters) => {
  const serialized = {};
  if (filters.company !== null) {
    serialized.companyId = filters.company.id;
  }
  if (filters.position !== null) {
    serialized.positionId = filters.position.id;
  }
  serialized.showOffEmployees = filters.showOffEmployees;

  return serialized;
};

const setFilterOptionCompany = company => ({
  type: SET_FILTER_OPTION_COMPANY,
  data: { company },
});

const setFilterOptionPosition = position => ({
  type: SET_FILTER_OPTION_POSITION,
  data: { position },
});

const setFilterOptionShowOffEmployees = showOffEmployees => ({
  type: SET_FILTER_OPTION_OFF_EMPLOYEES,
  data: { showOffEmployees },
});

const setFilterOptionRoomAssignments = showRoomAssignments => ({
  type: SET_FILTER_OPTION_ROOM_ASSIGNMENTS,
  data: { showRoomAssignments },
});

const setFilterOptionAssistantAssignments = showAssistantAssignments => ({
  type: SET_FILTER_OPTION_ROOM_ASSIGNMENTS,
  data: { showAssistantAssignments },
});

const setFilterOptionShowMultiBlock = showMultiBlock => ({
  type: SET_FILTER_OPTION_MULTIBLOCK,
  data: { showMultiBlock },
});

const toTimeStamp = time => moment(time, 'HH:mm').unix();

const setStoreWeeklyScheduleSuccess = (weeklySchedule) => {
  const minStartTime = minBy(weeklySchedule, schedule => toTimeStamp(schedule.start1)).start1;
  const maxEndTime = maxBy(weeklySchedule, schedule => toTimeStamp(schedule.end1)).end1;
  const apptGridSettings = {
    minStartTime,
    maxEndTime,
    weeklySchedule,
  };
  return {
    type: SET_WEEKLY_SCHEDULE_SUCCESS,
    data: { apptGridSettings },
  };
};

const setStoreWeeklySchedule = () => (dispatch) => {
  dispatch({
    type: SET_WEEKLY_SCHEDULE,
  });
  apiWrapper.doRequest('getStoreWeeklySchedule', {}).then((weeklySchedule) => {
    dispatch(setStoreWeeklyScheduleSuccess(weeklySchedule));
  }).catch((ex) => {
    // TODO
    console.log(ex);
  });
};

const setGridAllViewSuccess = (employees, appointments, availability) => {
  const apptGridSettings = {
    step: 15,
  };
  return {
    type: SET_GRID_ALL_VIEW_SUCCESS,
    data: {
      employees, appointments, apptGridSettings, availability,
    },
  };
};

const setGridDayWeekViewSuccess = (appointments, providerSchedule, apptGridSettings, startDate, pickerMode) => {
  const {
    minStartTime, maxEndTime, weeklySchedule, step,
  } = apptGridSettings;
  let numOfRow = 0;
  const schedule = weeklySchedule[startDate.format('E') - 1];
  switch (pickerMode) {
    case 'week':
      numOfRow = times(moment(maxEndTime, 'HH:mm').diff(moment(minStartTime, 'HH:mm'), 'minutes')).length / step;
      break;
    default:
      numOfRow = times(moment(schedule.end1, 'HH:mm').diff(moment(schedule.start1, 'HH:mm'), 'minutes')).length / step;
      break;
  }
  const newApptGridSettings = {
    numOfRow,
    step: 15,
  };
  return {
    type: SET_GRID_DAY_WEEK_VIEW_SUCCESS,
    data: { providerSchedule, appointments, apptGridSettings: newApptGridSettings },
  };
};

const setGridRoomViewSuccess = (rooms, schedule, roomAppointments, appointments, availability) => {
  const apptGridSettings = {
    numOfRow: availability.length,
    step: 15,
  };
  return {
    type: SET_GRID_ROOM_VIEW_SUCCESS,
    data: {
      rooms, schedule, roomAppointments, appointments, apptGridSettings,
    },
  };
};

const setGridResourceViewSuccess = (resources, schedule, resourceAppointments, appointments, availability) => {
  const apptGridSettings = {
    numOfRow: availability.length,
    step: 15,
  };
  return {
    type: SET_GRID_RESOURCE_VIEW_SUCCESS,
    data: {
      resources, schedule, resourceAppointments, appointments, apptGridSettings,
    },
  };
};

const reloadGridRelatedStuff = () => (dispatch, getState) => {
  const {
    selectedFilter,
    selectedProvider,
    startDate,
    pickerMode,
    apptGridSettings,
    filterOptions,
  } = getState().appointmentScreenReducer;
  const date = startDate.format('YYYY-MM-DD');

  switch (selectedFilter) {
    case 'providers': {
      if (selectedProvider === 'all') {
        Promise.all([
          apiWrapper.doRequest('getAppointmentBookEmployees', {
            path: {
              date,
            },
            query: serializeFilterOptions(filterOptions),
          }),
          apiWrapper.doRequest('getAppointmentsByDate', {
            path: {
              date,
            },
          }),
          apiWrapper.doRequest('getAppointmentBookAvailability', {
            path: {
              date,
            },
          }),
        ])
          .then(([employees, appointments, availabilityItem]) => {
            const employeesAppointment = orderBy(employees, 'appointmentOrder');
            const orderedAppointments = orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
            dispatch(setGridAllViewSuccess(
              employeesAppointment,
              orderedAppointments, availabilityItem.timeSlots,
            ));
          })
          .catch((ex) => {
            // TODO
          });
      } else {
        switch (pickerMode) {
          case 'day':
          case 'week': {
            const dateTo = moment(startDate).add(6, 'days').format('YYYY-MM-DD');
            Promise.all([
              apiWrapper.doRequest('getEmployeeScheduleRange', {
                path: { id: selectedProvider.id, startDate: startDate.format('YYYY-MM-DD'), endDate: dateTo },
              }),
              apiWrapper.doRequest('getEmployeeAppointments', {
                path: { id: selectedProvider.id, dateFrom: startDate.format('YYYY-MM-DD'), dateTo },
              }),
            ])
              .then(([providerSchedule, appointments]) => {
                const groupedProviderSchedule = groupBy(providerSchedule, schedule => moment(schedule.date).format('YYYY-MM-DD'));
                const orderedAppointments = orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
                dispatch(setGridDayWeekViewSuccess(
                  orderedAppointments,
                  groupedProviderSchedule,
                  apptGridSettings,
                  startDate,
                  pickerMode,
                ));
              })
              .catch((ex) => {
                // TODO
              });
            break;
          }
          default:
            break;
        }
      }
      break;
    }
    case 'rooms': {
      Promise.all([
        apiWrapper.doRequest('getRooms', {}),
        apiWrapper.doRequest('getStoreSchedule', {
          path: { date },
        }),
        apiWrapper.doRequest('getRoomAppointments', {
          path: { date },
        }),
        apiWrapper.doRequest('getAppointmentsByDate', {
          path: {
            date,
          },
        }),
        apiWrapper.doRequest('getAppointmentBookAvailability', {
          path: {
            date,
          },
        }),
      ])
        .then(([rooms, schedule, roomAppointments, appointments, availability]) => {
          const orderedAppointments = orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
          dispatch(setGridRoomViewSuccess(
            rooms,
            schedule,
            roomAppointments,
            appointments,
            availability.timeSlots,
          ));
        })
        .catch((ex) => {
          // TODO
        });
      break;
    }
    case 'resources': {
      Promise.all([
        apiWrapper.doRequest('getResources', {}),
        apiWrapper.doRequest('getStoreSchedule', {
          path: { date },
        }),
        apiWrapper.doRequest('getResourceAppointments', {
          path: { date },
        }),
        apiWrapper.doRequest('getAppointmentsByDate', {
          path: {
            date,
          },
        }),
        apiWrapper.doRequest('getAppointmentBookAvailability', {
          path: {
            date,
          },
        }),
      ])
        .then(([resources, schedule, resourceAppointments, appointments, availability]) => {
          const orderedAppointments = orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
          dispatch(setGridResourceViewSuccess(
            resources,
            schedule,
            resourceAppointments,
            appointments,
            availability.timeSlots,
          ));
        })
        .catch((ex) => {
          // TODO
        });
      break;
    }
    default:
      break;
  }
};

const setGridView = () => (dispatch) => {
  dispatch({
    type: SET_GRID_VIEW,
  });

  dispatch(reloadGridRelatedStuff());
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

const setSelectedProvider = selectedProvider => ({
  type: SET_SELECTED_PROVIDER,
  data: { selectedProvider },
});

const setSelectedFilter = selectedFilter => ({
  type: SET_SELECTED_FILTER,
  data: { selectedFilter },
});

const hideToast = () => ({
  type: HIDE_TOAST,
});

export const appointmentCalendarActions = {
  setGridView,
  setProviderScheduleDates,
  setPickerMode,
  setSelectedProvider,
  setSelectedFilter,
  setStoreWeeklySchedule,
  setFilterOptionCompany,
  setFilterOptionPosition,
  setFilterOptionShowMultiBlock,
  setFilterOptionRoomAssignments,
  setFilterOptionAssistantAssignments,
  setFilterOptionShowOffEmployees,
  hideToast,
};

const initialState = {
  isLoading: false,
  isLoadingSchedule: false,
  error: null,
  selectedFilter: 'providers',
  selectedProvider: 'all',
  pickerMode: 'day',
  startDate: moment(),
  endDate: moment(),
  dates: [moment()],
  providerAppointments: [],
  roomAppointments: [],
  resourceAppointments: [],
  apptGridSettings: {
    minStartTime: moment('07:00', 'HH:mm'),
    maxEndTime: moment('21:00', 'HH:mm'),
    numOfRow: 0,
    step: 15,
    weeklySchedule: [],
  },
  filterOptions: {
    company: null,
    position: null,
    serviceProxy: null,
    showOffEmployees: false,
    showRoomAssignments: false,
    showAssistantAssignments: false,
  },
  providers: [],
  rooms: [],
  resources: [],
  storeSchedule: [],
  providerSchedule: [],
  showToast: false,
};

export default function appointmentScreenReducer(state = initialState, action) {
  const { type, data } = action;
  const { appointments, filterOptions } = state;
  switch (type) {
    case SET_FILTER_OPTION_COMPANY:
      filterOptions.company = data.company;
      return {
        ...state,
        filterOptions,
      };
    case SET_FILTER_OPTION_POSITION:
      filterOptions.position = data.position;
      return {
        ...state,
        filterOptions,
      };
    case SET_FILTER_OPTION_OFF_EMPLOYEES:
      filterOptions.showOffEmployees = data.showOffEmployees;
      return {
        ...state,
        filterOptions,
      };
    case SET_FILTER_OPTION_ROOM_ASSIGNMENTS:
      filterOptions.showRoomAssignments = data.showRoomAssignments;
      return {
        ...state,
        filterOptions,
      };
    case SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS:
      filterOptions.showAssistantAssignments = data.showAssistantAssignments;
      return {
        ...state,
        filterOptions,
      };
    case SET_FILTER_OPTION_MULTIBLOCK:
      filterOptions.showMultiBlock = data.showMultiBlock;
      return {
        ...state,
        filterOptions,
      };
    case ADD_APPOINTMENT:
      if (Array.isArray(data.appointment)) {
        for (let i = 0; i < data.appointment.length; i += 1) {
          appointments.push(data.appointment[i]);
        }
      } else {
        appointments.push(data.appointment);
      }
      return {
        ...state,
        appointments,
      };
    case SET_WEEKLY_SCHEDULE_SUCCESS:
      return {
        ...state,
        apptGridSettings: { ...state.apptGridSettings, ...data.apptGridSettings },
        isLoadingSchedule: false,
      };
    case SET_WEEKLY_SCHEDULE:
      return {
        ...state,
        isLoadingSchedule: true,
      };
    case SET_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: data.selectedProvider,
        // isLoading: true,
      };
    case SET_SELECTED_FILTER:
      return {
        ...state,
        selectedFilter: data.selectedFilter,
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
    case SET_GRID_VIEW:
      return {
        ...state,
        isLoading: true,
      };
    case SET_GRID_ROOM_VIEW_SUCCESS: {
      const minStartTime = state.apptGridSettings.weeklySchedule[state.startDate.format('E') - 1].start1;
      const maxEndTime = state.apptGridSettings.weeklySchedule[state.startDate.format('E') - 1].end1;
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: {
          ...state.apptGridSettings, ...data.apptGridSettings, maxEndTime, minStartTime,
        },
        rooms: data.rooms,
        providerSchedule: data.schedule,
        appointments: data.appointments,
        roomAppointments: data.roomAppointments,
      };
    }
    case SET_GRID_RESOURCE_VIEW_SUCCESS: {
      const minStartTime = state.apptGridSettings.weeklySchedule[state.startDate.format('E') - 1].start1;
      const maxEndTime = state.apptGridSettings.weeklySchedule[state.startDate.format('E') - 1].end1;
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: {
          ...state.apptGridSettings, ...data.apptGridSettings, maxEndTime, minStartTime,
        },
        resources: data.resources,
        providerSchedule: data.schedule,
        appointments: data.appointments,
        resourceAppointments: data.resourceAppointments,
      };
    }
    case SET_GRID_ALL_VIEW_SUCCESS: {
      const minStartTime = state.apptGridSettings.weeklySchedule[state.startDate.format('E') - 1].start1;
      const maxEndTime = state.apptGridSettings.weeklySchedule[state.startDate.format('E') - 1].end1;
      const numOfRow = moment(maxEndTime, 'HH:mm').diff(moment(minStartTime, 'HH:mm'), 'minutes') / state.apptGridSettings.step;
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: {
          ...state.apptGridSettings, ...data.apptGridSettings, maxEndTime, minStartTime, numOfRow
        },
        providers: data.employees,
        appointments: data.appointments,
        availability: data.availability,
      };
    }
    case SET_GRID_DAY_WEEK_VIEW_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: { ...state.apptGridSettings, ...data.apptGridSettings },
        appointments: data.appointments,
        providerSchedule: data.providerSchedule,
      };
    case POST_APPOINTMENT_MOVE:
    case POST_APPOINTMENT_RESIZE:
      return {
        ...state,
        isLoading: true,
      };
    case POST_APPOINTMENT_MOVE_SUCCESS:
    case POST_APPOINTMENT_RESIZE_SUCCESS: {
      const index = appointments.findIndex(appt => appt.id === data.appointment.id);
      if (index > -1) {
        appointments[index] = data.appointment;
      } else {
        appointments.push(data.appointment);
      }
      const newTime = moment(data.appointment.fromTime, 'HH:mm').format('h:mm a');
      const newToTime = moment(data.appointment.toTime, 'HH:mm').format('h:mm a');
      const newDate = moment(data.appointment.date, 'YYYY-MM-DD').format('MMM DD, YYYY');
      const toastText = type === POST_APPOINTMENT_MOVE_SUCCESS ?
        `Moved to - ${newTime} ${newDate}` : `Moved to - ${newTime} to ${newToTime}`;
      const showToast = data.oldAppointment ? toastText : null;
      const undoType = type === POST_APPOINTMENT_MOVE_SUCCESS ? 'move' : 'resize';
      return {
        ...state,
        appointments,
        isLoading: false,
        showToast,
        oldAppointment: data.oldAppointment,
        undoType
      };
    }
    case POST_APPOINTMENT_MOVE_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    case HIDE_TOAST:
    case UNDO_MOVE:
      return {
        ...state,
        showToast: false,
        oldAppointment: null,
        undoType: null,
      };
    default:
      return state;
  }
}
