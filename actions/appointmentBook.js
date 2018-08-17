import moment from 'moment';
import { groupBy, orderBy, maxBy, minBy, times } from 'lodash';
import { Store, AppointmentBook, Appointment, Employees } from '../utilities/apiWrapper';

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
export const SET_TOAST = 'appointmentCalendar/SET_TOAST';
export const CHANGE_FIRST_AVAILABLE = 'appointmentCalendar/CHANGE_FIRST_AVAILABLE';

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
  Store.getStoreWeeklySchedule().then((weeklySchedule) => {
    dispatch(setStoreWeeklyScheduleSuccess(weeklySchedule));
  }).catch(() => {
    // TODO

  });
};

const setGridAllViewSuccess =
  (employees, appointments, availabilityParam, blockTimes, schedule) => {
    const { scheduledIntervals } = schedule;
    const step = 15;
    // min start time calulation
    const minScheduleTime = scheduledIntervals.length > 0 ? moment(scheduledIntervals[0].start, 'HH:mm') : moment('07:00', 'HH:mm');
    const minAppointmentStartTime = appointments.length > 0 ? moment(minBy(appointments, item => moment(item.fromTime, 'HH:mm').unix()).fromTime, 'HH:mm') : minScheduleTime;
    const minBlokTimeStartTime = blockTimes.length > 0 ? moment(minBy(blockTimes, item => moment(item.fromTime, 'HH:mm').unix()).fromTime, 'HH:mm') : minScheduleTime;
    const minStartTimeMoment =
      moment.min(minAppointmentStartTime, minScheduleTime, minBlokTimeStartTime);
    const minStartTime = minStartTimeMoment.format('HH:mm');
    // max end time calculation
    const maxScheduleEndTime = scheduledIntervals.length > 0 ?
      moment(scheduledIntervals[scheduledIntervals.length - 1].end, 'HH:mm') : moment('19:00', 'HH:mm');
    const maxAppointmentEndTime = appointments.length > 0 ? moment(maxBy(appointments, item => moment(item.toTime, 'HH:mm').unix()).toTime, 'HH:mm') : maxScheduleEndTime;
    const maxBlockTimeEndTime = blockTimes.length > 0 ? moment(maxBy(blockTimes, item => moment(item.toTime, 'HH:mm').unix()).toTime, 'HH:mm') : maxScheduleEndTime;
    const maxEndTimeMoment =
      moment.max(maxAppointmentEndTime, maxScheduleEndTime, maxBlockTimeEndTime);
    const maxEndTime = maxEndTimeMoment.format('HH:mm');
    // end
    const numOfRow = Math.round(maxEndTimeMoment.diff(minStartTimeMoment, 'minutes') / step);
    const availability = availabilityParam.length > 0 ? availabilityParam : times(numOfRow, 'All');

    const apptGridSettings = {
      minStartTime,
      maxEndTime,
      numOfRow,
      step,
    };

    return {
      type: SET_GRID_ALL_VIEW_SUCCESS,
      data: {
        employees, appointments, apptGridSettings, availability, blockTimes, schedule,
      },
    };
  };

const setGridDayWeekViewSuccess = (
  appointments, providerSchedule, apptGridSettings,
  startDate, pickerMode, blockTimes,
) => {
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
    data: {
      providerSchedule, appointments, apptGridSettings: newApptGridSettings, blockTimes,
    },
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

const setGridResourceViewSuccess = (
  resources, schedule, resourceAppointments,
  appointments, availability,
) => {
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
  } = getState().appointmentBookReducer;
  const date = startDate.format('YYYY-MM-DD');

  switch (selectedFilter) {
    case 'deskStaff':
    case 'providers': {
      if (selectedProvider === 'all') {
        Promise.all([
          AppointmentBook.getAppointmentBookEmployees(date, filterOptions),
          Appointment.getAppointmentsByDate(date),
          AppointmentBook.getAppointmentBookAvailability(date),
          AppointmentBook.getBlockTimes(date),
          Store.getSchedule(date),
        ])
          .then(([employees, appointments, availabilityItem, blockTimes, schedule]) => {
            let filteredEmployees = employees;

            if (selectedFilter === 'deskStaff') {
              filteredEmployees = filteredEmployees.filter(employee => employee.isReceptionist);
            }
            const employeesAppointment = orderBy(filteredEmployees, 'appointmentOrder');
            const orderedAppointments = orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
            dispatch(setGridAllViewSuccess(
              employeesAppointment,
              orderedAppointments, availabilityItem.timeSlots, blockTimes, schedule,
            ));
          })
          .catch((ex) => {
            // TODO
            console.log(ex);
          });
      } else {
        switch (pickerMode) {
          case 'day':
          case 'week': {
            const dateTo = moment(startDate).add(6, 'days').format('YYYY-MM-DD');
            Promise.all([
              Employees.getEmployeeScheduleRange({
                id: selectedProvider.id,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: dateTo,
              }),
              Employees.getEmployeeAppointments({ id: selectedProvider.id, dateFrom: startDate.format('YYYY-MM-DD'), dateTo }),
              AppointmentBook.getBlockTimesBetweenDates({ fromDate: startDate.format('YYYY-MM-DD'), toDate: dateTo }),
            ])
              .then(([providerSchedule, appointments, blockTimes]) => {
                const groupedProviderSchedule = groupBy(providerSchedule, schedule => moment(schedule.date).format('YYYY-MM-DD'));
                const orderedAppointments = orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
                dispatch(setGridDayWeekViewSuccess(
                  orderedAppointments,
                  groupedProviderSchedule,
                  apptGridSettings,
                  startDate,
                  pickerMode,
                  blockTimes,
                ));
              })
              .catch(() => {
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
        Store.getRooms(),
        Store.getSchedule(date),
        AppointmentBook.getRoomAppointments(date),
        Appointment.getAppointmentsByDate(date),
        AppointmentBook.getAppointmentBookAvailability(date),
      ])
        .then(([rooms, schedule, roomAppointments, appointments, availability]) => {
          orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
          dispatch(setGridRoomViewSuccess(
            rooms,
            schedule,
            roomAppointments,
            appointments,
            availability.timeSlots,
          ));
        })
        .catch(() => {
          // TODO
        });
      break;
    }
    case 'resources': {
      Promise.all([
        Store.getResources(),
        Store.getSchedule(date),
        AppointmentBook.getResourceAppointments(date),
        Appointment.getAppointmentsByDate(date),
        AppointmentBook.getAppointmentBookAvailability(date),
      ])
        .then(([resources, schedule, resourceAppointments, appointments, availability]) => {
          orderBy(appointments, appt => moment(appt.fromTime, 'HH:mm').unix());
          dispatch(setGridResourceViewSuccess(
            resources,
            schedule,
            resourceAppointments,
            appointments,
            availability.timeSlots,
          ));
        })
        .catch(() => {
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
  const { startDate, pickerMode } = getState().appointmentBookReducer;
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

const changeFirstAvailable = () => ({
  type: CHANGE_FIRST_AVAILABLE,
});

export const appointmentCalendarActions = {
  changeFirstAvailable,
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
  setToast,
};
