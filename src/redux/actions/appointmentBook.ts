import moment from 'moment';
import { groupBy, orderBy, map, filter, includes } from 'lodash';
import {
  Settings,
  Store,
  AppointmentBook,
  Appointment,
  Employees,
} from '../../utilities/apiWrapper';
import StoreActions from './store';
import { PureProvider, Maybe, StoreCompany, ProviderPosition } from '@/models';
import { dateTimeConstants } from '@/constants';

export const ADD_APPOINTMENT = 'appointmentScreen/ADD_APPOINTMENT';
export const SET_FILTER_OPTION_COMPANY =
  'appointmentScreen/SET_FILTER_OPTION_COMPANY';
export const SET_FILTER_OPTION_POSITION =
  'appointmentScreen/SET_FILTER_OPTION_POSITION';
export const SET_FILTER_OPTION_OFF_EMPLOYEES =
  'appointmentScreen/SET_FILTER_OPTION_OFF_EMPLOYEES';
export const SET_FILTER_OPTION_MULTIBLOCK =
  'appointmentScreen/SET_FILTER_OPTION_MULTIBLOCK';
export const SET_FILTER_OPTION_ROOM_ASSIGNMENTS =
  'appointmentScreen/SET_FILTER_OPTION_ROOM_ASSIGNMENTS';
export const SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS =
  'appointmentScreen/SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS';
export const SET_GRID_VIEW = 'appointmentScreen/SET_GRID_VIEW';
export const SET_GRID_ROOM_VIEW_SUCCESS =
  'appointmentScreen/SET_GRID_ROOM_VIEW_SUCCESS';
export const SET_GRID_RESOURCE_VIEW_SUCCESS =
  'appointmentScreen/SET_GRID_RESOURCE_VIEW_SUCCESS';
export const SET_GRID_ALL_VIEW_SUCCESS =
  'appointmentScreen/SET_GRID_ALL_VIEW_SUCCESS';
export const SET_GRID_WEEK_VIEW_SUCCESS =
  'appointmentScreen/SET_GRID_DAY_WEEK_VIEW_SUCCESS';
export const SET_DATE_RANGE = 'appointmentCalendar/SET_DATE_RANGE';
export const SET_PICKER_MODE = 'appointmentCalendar/SET_PICKER_MODE';
export const SET_SELECTED_PROVIDER =
  'appointmentCalendar/SET_SELECTED_PROVIDER';
export const SET_SELECTED_PROVIDERS =
  'appointmentCalendar/SET_SELECTED_PROVIDERS';
export const SET_SELECTED_FILTER = 'appointmentCalendar/SET_SELECTED_FILTER';
export const SET_PROVIDER_DATES = 'appointmentCalendar/SET_PROVIDER_DATES';
export const HIDE_TOAST = 'appointmentCalendar/HIDE_TOAST';
export const SET_TOAST = 'appointmentCalendar/SET_TOAST';
export const CHANGE_FIRST_AVAILABLE =
  'appointmentCalendar/CHANGE_FIRST_AVAILABLE';

const setToast = toast => ({
  type: SET_TOAST,
  data: { toast },
});

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
  type: SET_FILTER_OPTION_ASSISTANT_ASSIGNMENTS,
  data: { showAssistantAssignments },
});

const setFilterOptionShowMultiBlock = showMultiBlock => ({
  type: SET_FILTER_OPTION_MULTIBLOCK,
  data: { showMultiBlock },
});

const setGridAllViewSuccess = (
  employees,
  appointments,
  availability,
  blockTimes,
  rooms
) => {
  const step = 15;
  const apptGridSettings = {
    step,
  };

  return {
    type: SET_GRID_ALL_VIEW_SUCCESS,
    data: {
      employees,
      appointments,
      apptGridSettings,
      availability,
      blockTimes,
      rooms,
    },
  };
};

const setGridWeekViewSuccess = (
  appointments,
  providerSchedule,
  blockTimes
) => ({
  type: SET_GRID_WEEK_VIEW_SUCCESS,
  data: {
    providerSchedule,
    appointments,
    blockTimes,
  },
});

const setGridRoomViewSuccess = (
  rooms,
  roomAppointments,
  appointments,
  availability
) => ({
  type: SET_GRID_ROOM_VIEW_SUCCESS,
  data: {
    rooms,
    roomAppointments,
    appointments,
    availability,
  },
});

const setGridResourceViewSuccess = (
  resources,
  resourceAppointments,
  appointments,
  availability
) => ({
  type: SET_GRID_RESOURCE_VIEW_SUCCESS,
  data: {
    resources,
    resourceAppointments,
    appointments,
    availability,
  },
});

const reloadGridCallback = ({
  employees, selectedFilter, selectedProviders,
  appointments, storeInfo, scheduleExceptions, availabilityItem,
  blockTimes, storeRooms, dispatch
}) => {
  let filteredEmployees = employees;

  if (selectedFilter === 'deskStaff') {
    filteredEmployees = filteredEmployees.filter(
      employee => employee.isReceptionist
    );
  } else if (selectedFilter === 'rebookAppointment') {
    filteredEmployees = selectedProviders;
  }

  const employeesAppointment = orderBy(
    filteredEmployees,
    'appointmentOrder'
  );
  const orderedAppointments = orderBy(appointments, appt =>
    moment(appt.fromTime, dateTimeConstants.timeOld).unix()
  );
  dispatch(StoreActions.loadStoreInfoSuccess(storeInfo));
  dispatch(
    StoreActions.loadScheduleExceptionsSuccess(scheduleExceptions)
  );
  return dispatch(
    setGridAllViewSuccess(
      employeesAppointment,
      orderedAppointments,
      availabilityItem.timeSlots,
      blockTimes,
      storeRooms
    )
  );
}

const reloadGridRelatedStuff = () => (dispatch, getState) => {
  const {
    selectedFilter,
    selectedProvider,
    selectedProviders,
    startDate,
    pickerMode,
    filterOptions,
    rooms,
  } = getState().appointmentBookReducer;
  const date = startDate.format('YYYY-MM-DD');
  switch (selectedFilter) {
    case 'deskStaff':
    case 'rebookAppointment':
    case 'providers': {
      if (selectedProvider === 'all' || pickerMode === 'day') {
        return Promise.all([
          AppointmentBook.getAppointmentBookEmployees(date, filterOptions),
          Appointment.getAppointmentsByDate(date),
          Settings.getSettings(),
          AppointmentBook.getBlockTimes(date),
          Store.getScheduleExceptions({ fromDate: date, toDate: date }),
          Store.getStoreInfo(),
          filterOptions.showRoomAssignments ? Store.getRooms() : rooms,
        ])
          .then(
            (
              [
                employees,
                appointments,
                settings,
                blockTimes,
                scheduleExceptions,
                storeInfo,
                storeRooms,
              ]
            ) => {
              const useFirstAvailable = settings.find((itm) => itm.settingName === 'UseFirstAvailable');
              if (useFirstAvailable && useFirstAvailable.settingValue) {
                return AppointmentBook.getAppointmentBookAvailability(date).then(availabilityItem => reloadGridCallback({
                  employees, selectedFilter, selectedProviders,
                  appointments, storeInfo, scheduleExceptions, availabilityItem,
                  blockTimes, storeRooms, dispatch
                }));
              } else {
                const availabilityItem = { timeSlots: null };
                return reloadGridCallback({
                  employees, selectedFilter, selectedProviders,
                  appointments, storeInfo, scheduleExceptions, availabilityItem,
                  blockTimes, storeRooms, dispatch
                });
              }
            }
          )
          .catch(ex => {
            // TODO
            console.log(ex);
          });
      }
      const dateTo = moment(startDate).add(6, 'days').format('YYYY-MM-DD');
      return Promise.all([
        Employees.getEmployeeScheduleRange({
          id: selectedProvider.id,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: dateTo,
        }),
        Employees.getEmployeeAppointments({
          id: selectedProvider.id,
          dateFrom: startDate.format('YYYY-MM-DD'),
          dateTo,
        }),
        AppointmentBook.getBlockTimesBetweenDates({
          fromDate: startDate.format('YYYY-MM-DD'),
          toDate: dateTo,
        }),
        Store.getScheduleExceptions({ fromDate: date, toDate: dateTo }),
        Store.getStoreInfo(),
      ])
        .then(
          (
            [
              providerSchedule,
              appointments,
              blockTimes,
              scheduleExceptions,
              storeInfo,
            ]
          ) => {
            const groupedProviderSchedule = groupBy(
              providerSchedule,
              schedule => moment(schedule.date).format('YYYY-MM-DD')
            );
            const orderedAppointments = orderBy(appointments, appt =>
              moment(appt.fromTime, 'HH:mm').unix()
            );
            dispatch(StoreActions.loadStoreInfoSuccess(storeInfo));
            dispatch(
              StoreActions.loadScheduleExceptionsSuccess(scheduleExceptions)
            );
            dispatch(
              setGridWeekViewSuccess(
                orderedAppointments,
                groupedProviderSchedule,
                blockTimes
              )
            );
          }
        )
        .catch(() => {
          // TODO
        });
    }
    case 'rooms': {
      return Promise.all([
        Store.getRooms(),
        Store.getScheduleExceptions({ fromDate: date, toDate: date }),
        AppointmentBook.getRoomAppointments(date),
        Appointment.getAppointmentsByDate(date),
        AppointmentBook.getAppointmentBookAvailability(date),
        Store.getStoreInfo(),
      ])
        .then(
          (
            [
              rooms,
              scheduleExceptions,
              roomAppointments,
              appointments,
              availability,
              storeInfo,
            ]
          ) => {
            orderBy(appointments, appt =>
              moment(appt.fromTime, 'HH:mm').unix()
            );
            dispatch(StoreActions.loadStoreInfoSuccess(storeInfo));
            dispatch(
              StoreActions.loadScheduleExceptionsSuccess(scheduleExceptions)
            );
            dispatch(
              setGridRoomViewSuccess(
                rooms,
                roomAppointments,
                appointments,
                availability.timeSlots
              )
            );
          }
        )
        .catch(() => {
          // TODO
        });
    }
    case 'resources': {
      return Promise.all([
        Store.getResources(),
        Store.getScheduleExceptions({ fromDate: date, toDate: date }),
        AppointmentBook.getResourceAppointments(date),
        Appointment.getAppointmentsByDate(date),
        AppointmentBook.getAppointmentBookAvailability(date),
        Store.getStoreInfo(),
      ])
        .then(
          (
            [
              resources,
              scheduleExceptions,
              resourceAppointments,
              appointments,
              availability,
              storeInfo,
            ]
          ) => {
            orderBy(appointments, appt =>
              moment(appt.fromTime, 'HH:mm').unix()
            );
            dispatch(StoreActions.loadStoreInfoSuccess(storeInfo));
            dispatch(
              StoreActions.loadScheduleExceptionsSuccess(scheduleExceptions)
            );
            dispatch(
              setGridResourceViewSuccess(
                resources,
                resourceAppointments,
                appointments,
                availability.timeSlots
              )
            );
          }
        )
        .catch(() => {
          // TODO
        });
    }
    default:
      break;
  }
};

const setGridView = () => dispatch => {
  dispatch({
    type: SET_GRID_VIEW,
  });
  return dispatch(reloadGridRelatedStuff());
};

const setScheduleDateRange = () => (dispatch, getState) => {
  const { startDate, pickerMode } = getState().appointmentBookReducer;
  const dates = [];
  let diff = 0;

  if (pickerMode === 'week') {
    diff = 6;
    dispatch({
      type: SET_PROVIDER_DATES,
      data: { startDate, endDate: moment(moment(startDate).add(6, 'day')) },
    });
  }
  for (let i = 0; i <= diff; i += 1) {
    dates.push(moment(moment(startDate).add(i, 'day')));
  }
  dispatch({ type: SET_DATE_RANGE, data: { dates } });
};

const setProviderScheduleDates = (startDate, endDate) => dispatch => {
  dispatch({ type: SET_PROVIDER_DATES, data: { startDate, endDate } });
  return dispatch(setScheduleDateRange());
};

const setPickerMode = pickerMode => dispatch => {
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

const setSelectedProviders = selectedProviders => ({
  type: SET_SELECTED_PROVIDERS,
  data: { selectedProviders },
});

const setSelectedFilter = selectedFilter => dispatch => {
  if (selectedFilter !== 'providers') {
    dispatch(setPickerMode('day'));
  }
  return dispatch({
    type: SET_SELECTED_FILTER,
    data: { selectedFilter },
  });
};

const hideToast = () => ({
  type: HIDE_TOAST,
});

const changeFirstAvailable = () => ({
  type: CHANGE_FIRST_AVAILABLE,
});

export const appointmentCalendarActions = {
  changeFirstAvailable,
  setGridView,
  setProviderScheduleDates,
  setPickerMode,
  setSelectedProvider,
  setSelectedProviders,
  setSelectedFilter,
  setFilterOptionCompany,
  setFilterOptionPosition,
  setFilterOptionShowMultiBlock,
  setFilterOptionRoomAssignments,
  setFilterOptionAssistantAssignments,
  setFilterOptionShowOffEmployees,
  hideToast,
  setToast,
};

export interface ApptBookActions {
  changeFirstAvailable: () => any;
  setGridView: () => any;
  setProviderScheduleDates: (start: string, end: string) => any;
  setPickerMode: (mode: any) => any;
  setSelectedProvider: (provider: Maybe<PureProvider>) => any;
  setSelectedProviders: (providers: any[]) => any;
  setSelectedFilter: (filter: any) => any;
  setFilterOptionCompany: (company: Maybe<StoreCompany>) => any;
  setFilterOptionPosition: (position: Maybe<ProviderPosition>) => any;
  setFilterOptionShowMultiBlock: (show: boolean) => any;
  setFilterOptionRoomAssignments: (show: boolean) => any;
  setFilterOptionAssistantAssignments: (show: boolean) => any;
  setFilterOptionShowOffEmployees: (show: boolean) => any;
  hideToast: () => any;
  setToast: (toast: Maybe<Object>) => any;
};
