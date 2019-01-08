import moment from 'moment';
import {
  POST_APPOINTMENT_RESIZE,
  POST_APPOINTMENT_RESIZE_SUCCESS,
  POST_APPOINTMENT_MOVE_SUCCESS,
  POST_APPOINTMENT_MOVE,
  POST_APPOINTMENT_MOVE_FAILED,
  POST_APPOINTMENT_RESIZE_FAILED,
  POST_APPOINTMENT_CANCEL_SUCCESS,
  POST_APPOINTMENT_CHECKIN_FAILED,
  POST_APPOINTMENT_CHECKOUT_FAILED,
  UNDO_MOVE,
  CHECK_APPT_CONFLICTS,
  CHECK_APPT_CONFLICTS_SUCCESS,
  CHECK_APPT_CONFLICTS_FAILED,
} from '../actions/appointment';
import {
  PUT_BLOCKTIME_MOVE,
  PUT_BLOCKTIME_MOVE_SUCCESS,
  PUT_BLOCKTIME_MOVE_FAILED,
  UNDO_MOVE_BLOCK,
  PUT_BLOCKTIME_RESIZE_SUCCESS,
  PUT_BLOCKTIME_RESIZE,
  PUT_BLOCKTIME_RESIZE_FAILED,
} from '../actions/blockTime';
import {
  SET_FILTER_OPTION_COMPANY,
  SET_FILTER_OPTION_POSITION,
  SET_FILTER_OPTION_OFF_EMPLOYEES,
  SET_FILTER_OPTION_MULTIBLOCK,
  SET_FILTER_OPTION_ROOM_ASSIGNMENTS,
  SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS,
  SET_GRID_VIEW,
  SET_GRID_ROOM_VIEW_SUCCESS,
  SET_GRID_RESOURCE_VIEW_SUCCESS,
  SET_GRID_ALL_VIEW_SUCCESS,
  SET_GRID_WEEK_VIEW_SUCCESS,
  SET_DATE_RANGE,
  SET_PICKER_MODE,
  SET_SELECTED_PROVIDER,
  SET_SELECTED_FILTER,
  SET_SELECTED_PROVIDERS,
  SET_PROVIDER_DATES,
  HIDE_TOAST,
  SET_TOAST,
  CHANGE_FIRST_AVAILABLE,
  HIDE_ALERT_ERROR,
} from '../actions/appointmentBook';

import DateTime from '../../constants/DateTime';
import { getFullName } from '../../utilities/helpers';
import {
  Conflict,
  Maybe,
  PureProvider,
  PureAppointment,
  BlockTimeCard,
  RoomAppointment,
  ResourceAppointment,
  StoreCompany,
  ProviderPosition,
  AppointmentEmployee,
  StoreRoom,
  StoreResource,
  EmployeeSchedule,
} from '@/models';

const processBlockTime = item => {
  const fromTime = moment(item.fromTime, DateTime.time);
  const toTime = moment(item.toTime, DateTime.time);

  return {
    ...item,
    isBlockTime: true,
    fromTime: fromTime.format(DateTime.timeOld),
    toTime: toTime.format(DateTime.timeOld),
    duration: toTime.diff(fromTime, 'minutes'),
  };
};

const processAppointmentFromApi = item => {
  const fromTime = moment(item.fromTime, DateTime.time);
  const toTime = moment(item.toTime, DateTime.time);
  return {
    ...item,
    clientName: getFullName(
      item.client.name,
      item.client.middleName,
      item.client.lastName,
    ),
    clientId: item.client.id,
    provider: { ...item.employee },
    fromTime: fromTime.format(DateTime.timeOld),
    toTime: toTime.format(DateTime.timeOld),
    duration: toTime.diff(fromTime, 'minutes'),
    isBlockTime: false,
    serviceName: item.service.description,
  };
};

const initialState: ApptBookReducer = {
  conflicts: [],
  isLoading: false,
  error: null,
  selectedFilter: 'providers',
  selectedProvider: 'all',
  selectedProviders: [],
  pickerMode: 'day',
  startDate: moment(),
  endDate: moment(),
  dates: [moment()],
  roomAppointments: [],
  resourceAppointments: [],
  apptGridSettings: {
    minStartTime: moment('05:00', 'HH:mm'),
    maxEndTime: moment('23:00', 'HH:mm'),
    numOfRow: 0,
    step: 15,
  },
  filterOptions: {
    company: null,
    position: null,
    showOffEmployees: false,
    showRoomAssignments: false,
    showAssistantAssignments: false,
    showFirstAvailable: false,
    showMultiBlock: false,
  },
  providers: [],
  rooms: [],
  resources: [],
  deskStaff: [],
  providerSchedule: [],
  toast: null,
  blockTimes: [],
  appointments: [],
  alertError: {
    show: false,
    description: '',
    title: 'Something went wrong',
  },
};

export interface ApptBookReducer {
  conflicts: Conflict[];
  isLoading: boolean;
  error: Maybe<any>;
  selectedFilter: string;
  selectedProvider: string | PureProvider;
  selectedProviders: PureProvider[];
  pickerMode: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  dates: [moment.Moment];
  roomAppointments: RoomAppointment[];
  resourceAppointments: ResourceAppointment[];
  apptGridSettings: {
    minStartTime: moment.Moment;
    maxEndTime: moment.Moment;
    numOfRow: number;
    step: number;
  };
  filterOptions: {
    company: Maybe<StoreCompany>;
    position: Maybe<ProviderPosition>;
    serviceProxy: Maybe<any>;
    showOffEmployees: boolean;
    showRoomAssignments: boolean;
    showAssistantAssignments: boolean;
    showFirstAvailable: boolean;
    showMultiBlock: boolean;
  };
  providers: AppointmentEmployee[];
  rooms: StoreRoom[];
  resources: StoreResource[];
  deskStaff: AppointmentEmployee[];
  providerSchedule: EmployeeSchedule[];
  toast: null | Object;
  blockTimes: BlockTimeCard[];
  appointments: PureAppointment[];
}

export default function appointmentBookReducer(state: ApptBookReducer = initialState, action) {
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
    case SET_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: data.selectedProvider,
        // isLoading: true,
      };
    case SET_SELECTED_PROVIDERS:
      return {
        ...state,
        selectedProviders: data.selectedProviders,
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
    case CHECK_APPT_CONFLICTS:
      return {
        ...state,
        isLoading: true,
      };
    case SET_GRID_ROOM_VIEW_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: {
          ...state.apptGridSettings,
          ...data.apptGridSettings,
        },
        rooms: data.rooms,
        appointments: data.appointments.map(processAppointmentFromApi),
        blockTimes: [],
        roomAppointments: data.roomAppointments,
      };
    }
    case SET_GRID_RESOURCE_VIEW_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: {
          ...state.apptGridSettings,
          ...data.apptGridSettings,
        },
        resources: data.resources,
        appointments: data.appointments.map(processAppointmentFromApi),
        blockTimes: [],
        resourceAppointments: data.resourceAppointments,
      };
    }
    case SET_GRID_ALL_VIEW_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: {
          ...state.apptGridSettings,
          ...data.apptGridSettings,
        },
        providers: data.employees,
        appointments: data.appointments.map(processAppointmentFromApi),
        availability: data.availability,
        blockTimes: data.blockTimes.map(processBlockTime),
        storeSchedule: data.schedule,
        rooms: data.rooms,
      };
    }
    case SET_GRID_WEEK_VIEW_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        apptGridSettings: { ...state.apptGridSettings, ...data.apptGridSettings },
        appointments: data.appointments.map(processAppointmentFromApi),
        providerSchedule: data.providerSchedule,
        blockTimes: data.blockTimes.map(processBlockTime),
      };
    case PUT_BLOCKTIME_MOVE:
    case PUT_BLOCKTIME_RESIZE:
    case POST_APPOINTMENT_MOVE:
    case POST_APPOINTMENT_RESIZE:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_BLOCKTIME_MOVE_SUCCESS:
    case PUT_BLOCKTIME_RESIZE_SUCCESS: {
      const { undoType, toast, oldBlockTime } = data;
      return {
        ...state,
        toast,
        oldBlockTime,
        undoType,
      };
    }
    case POST_APPOINTMENT_MOVE_SUCCESS:
    case POST_APPOINTMENT_RESIZE_SUCCESS: {
      const newTime = moment(data.appointment.fromTime, 'HH:mm').format(
        'h:mm a',
      );
      const newToTime = moment(data.appointment.toTime, 'HH:mm').format(
        'h:mm a',
      );
      const newDate = moment(data.appointment.date, 'YYYY-MM-DD').format(
        'MMM DD, YYYY',
      );
      const toastText = type === POST_APPOINTMENT_MOVE_SUCCESS
        ? `Moved to - ${newTime} ${newDate}`
        : `Moved to - ${newTime} to ${newToTime}`;
      const description = data.oldAppointment ? toastText : null;
      const undoType = type === POST_APPOINTMENT_MOVE_SUCCESS
        ? 'move'
        : 'resize';
      const toast = description
        ? {
          description,
          type: 'success',
          btnRightText: 'OK',
          btnLeftText: 'UNDO',
        }
        : null;
      return {
        ...state,
        toast,
        oldAppointment: data.oldAppointment,
        undoType,
      };
    }
    case PUT_BLOCKTIME_MOVE_FAILED:
    case PUT_BLOCKTIME_RESIZE_FAILED:
    case POST_APPOINTMENT_MOVE_FAILED:
    case POST_APPOINTMENT_RESIZE_FAILED:
    case POST_APPOINTMENT_CHECKOUT_FAILED:
    case POST_APPOINTMENT_CHECKIN_FAILED:
    case CHECK_APPT_CONFLICTS_FAILED:
      return {
        ...state,
        isLoading: false,
        conflicts: [],
        alertError: {
          show: true,
          description: data.error.response.data.userMessage,
        },
      };
    case HIDE_TOAST:
    case UNDO_MOVE:
    case UNDO_MOVE_BLOCK:
      return {
        ...state,
        toast: null,
        oldAppointment: null,
        oldBlockTime: null,
        undoType: null,
        error: null,
      };
    case SET_TOAST:
      return {
        ...state,
        toast: data.toast,
      };
    case POST_APPOINTMENT_CANCEL_SUCCESS: {
      const indexToRemove = appointments.findIndex(
        item => item.id === data.appointmentId,
      );
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
    case CHANGE_FIRST_AVAILABLE: {
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          showFirstAvailable: !state.filterOptions.showFirstAvailable,
        },
      };
    }
    case CHECK_APPT_CONFLICTS_SUCCESS: {
      return {
        ...state,
        isLoading: data.conflicts.length === 0,
        conflicts: data.conflicts,
      };
    }
    case HIDE_ALERT_ERROR: {
      return {
        ...state,
        alertError: {
          show: false,
          description: '',
        },
      };
    }
    default:
      return state;
  }
}
