import moment from 'moment';
import { POST_APPOINTMENT_RESIZE,
  POST_APPOINTMENT_RESIZE_SUCCESS,
  POST_APPOINTMENT_MOVE_SUCCESS,
  POST_APPOINTMENT_MOVE,
  POST_APPOINTMENT_MOVE_FAILED,
  POST_APPOINTMENT_RESIZE_FAILED,
  POST_APPOINTMENT_CANCEL_SUCCESS,
  POST_APPOINTMENT_CHECKIN_FAILED,
  POST_APPOINTMENT_CHECKOUT_FAILED,
  UNDO_MOVE,
} from '../actions/appointment';
import { ADD_APPOINTMENT, SET_FILTER_OPTION_COMPANY,
  SET_FILTER_OPTION_POSITION, SET_FILTER_OPTION_OFF_EMPLOYEES,
  SET_FILTER_OPTION_MULTIBLOCK, SET_FILTER_OPTION_ROOM_ASSIGNMENTS,
  SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS, SET_GRID_VIEW,
  SET_GRID_ROOM_VIEW_SUCCESS, SET_GRID_RESOURCE_VIEW_SUCCESS,
  SET_GRID_ALL_VIEW_SUCCESS, SET_GRID_DAY_WEEK_VIEW_SUCCESS,
  SET_DATE_RANGE, SET_PICKER_MODE,
  SET_SELECTED_PROVIDER, SET_SELECTED_FILTER,
  SET_PROVIDER_DATES, SET_WEEKLY_SCHEDULE,
  SET_WEEKLY_SCHEDULE_SUCCESS, HIDE_TOAST,
  SET_TOAST } from '../actions/appointmentBook';

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
  deskStaff: [],
  storeSchedule: [],
  providerSchedule: [],
  toast: null,
  blockTimes: [],
  appointments: [],
};

export default function appointmentBookReducer(state = initialState, action) {
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
      const { scheduledIntervals } = data.schedule;
      const minStartTime = scheduledIntervals[0].start;
      const maxEndTime = scheduledIntervals[scheduledIntervals.length - 1].end;
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
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: {
          ...state.apptGridSettings, ...data.apptGridSettings,
        },
        providers: data.employees,
        appointments: data.appointments,
        availability: data.availability,
        blockTimes: data.blockTimes,
        storeSchedule: data.schedule,
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
        blockTimes: data.blockTimes,
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
      const description = data.oldAppointment ? toastText : null;
      const undoType = type === POST_APPOINTMENT_MOVE_SUCCESS ? 'move' : 'resize';
      const toast = description ? {
        description,
        type: 'success',
        btnRightText: 'OK',
        btnLeftText: 'UNDO',
      } : null;
      return {
        ...state,
        appointments: appointments.slice(),
        isLoading: false,
        toast,
        oldAppointment: data.oldAppointment,
        undoType,
      };
    }
    case POST_APPOINTMENT_MOVE_FAILED:
    case POST_APPOINTMENT_RESIZE_FAILED:
    case POST_APPOINTMENT_CHECKIN_FAILED:
    case POST_APPOINTMENT_CHECKOUT_FAILED:
      return {
        ...state,
        isLoading: false,
        toast: {
          description: data.error.response.data.userMessage,
          type: 'error',
          btnRightText: 'OK',
        },
      };
    case HIDE_TOAST:
    case UNDO_MOVE:
      return {
        ...state,
        toast: null,
        oldAppointment: null,
        undoType: null,
        error: null,
      };
    case SET_TOAST:
      return {
        ...state,
        toast: data.toast,
      };
    case POST_APPOINTMENT_CANCEL_SUCCESS: {
      const indexToRemove = appointments.findIndex(item => item.id === data.appointmentId);
      if (indexToRemove > -1) {
        const newAppointments = appointments.slice();
        newAppointments.splice(indexToRemove, 1);
        return {
          ...state,
          appointments: newAppointments,
        };
      }
      return state;
    }
    default:
      return state;
  }
}
