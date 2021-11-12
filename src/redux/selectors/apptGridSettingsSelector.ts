import { createSelector } from 'reselect';
import moment from 'moment';
import { get, filter, minBy, maxBy, times } from 'lodash';

import {
  storeInfoSelector,
  storeScheduleExceptionsSelector,
} from './storeSelector';
import {
  PICKER_MODE_WEEK,
  TYPE_FILTER_DESK_STAFF,
  TYPE_FILTER_PROVIDERS,
  TYPE_PROVIDER,
} from '@/constants/filterTypes';


const apptBookSettingsSelector = state => ({
  selectedProvider: state.appointmentBookReducer.selectedProvider,
  pickerMode: state.appointmentBookReducer.pickerMode,
  startDate: state.appointmentBookReducer.startDate,
  endDate: state.appointmentBookReducer.endDate,
  appointments: state.appointmentBookReducer.appointments,
  selectedFilter: state.appointmentBookReducer.selectedFilter,
  blockTimes: state.appointmentBookReducer.blockTimes,
  step: state.appointmentBookReducer.apptGridSettings.step,
});

const filterOptionsSelector = state =>
  state.appointmentBookReducer.filterOptions;

const createSchedule = ({ index, step, minStartTime }) =>
  moment(minStartTime, 'HH:mm').add(index * step, 'm');

export const apptGridSettingsSelector = createSelector(
  [
    storeInfoSelector,
    storeScheduleExceptionsSelector,
    apptBookSettingsSelector,
    filterOptionsSelector,
  ],
  (storeInfo, scheduleExceptions, apptBookSettings, filterOptions) => {
    const {
      selectedFilter,
      startDate,
      blockTimes,
      step,
    } = apptBookSettings;
    const filteredAppts = selectFilteredAppts(apptBookSettings);

    const newEndDate = selectEndTime(apptBookSettings);

    const currentDay = moment(startDate);
    let minStartTimeMoment = null;
    let maxEndTimeMoment = null;

    const isFilterProviderOrDeskStaffAndThereAreBlockTimes
      = checkSelectedFilterAndBlockTimes(selectedFilter, blockTimes);

    while (currentDay.isSameOrBefore(newEndDate)) {
      const storeTodaySchedule = getStoreTodaySchedule(currentDay, storeInfo, scheduleExceptions);

      const dataForMinStartAndMaxEndTimeMoment = {
        storeTodaySchedule,
        filteredAppts,
        blockTimes,
        isFilterProviderOrDeskStaffAndThereAreBlockTimes,
      };
      // min startTime
      minStartTimeMoment = getMinStartTimeMoment(dataForMinStartAndMaxEndTimeMoment, minStartTimeMoment);
      // max endTime
      maxEndTimeMoment = getMaxEndTimeMoment(dataForMinStartAndMaxEndTimeMoment, maxEndTimeMoment);

      currentDay.add(1, 'd');
    }

    const minStartTime = minStartTimeMoment.format('HH:mm');
    const maxEndTime = maxEndTimeMoment.format('HH:mm');

    const numOfRow = Math.round(
      maxEndTimeMoment.diff(minStartTimeMoment, 'minutes') / step,
    );

    const schedule = times(numOfRow, index =>
      createSchedule({
        index,
        step,
        minStartTime,
      }),
    );

    return {
      numOfRow,
      minStartTime,
      maxEndTime,
      schedule,
      weeklySchedule: storeInfo ? storeInfo.weeklySchedules : [],
      step,
      filterOptions,
    };
  },
);

const checkSelectedFilterAndBlockTimes = (selectedFilter, blockTimes) => {
  return (selectedFilter === TYPE_FILTER_PROVIDERS ||
    selectedFilter === TYPE_FILTER_DESK_STAFF) && blockTimes.length > 0;
};

const selectFilteredAppts = (apptBookSettings) => {
  const { selectedFilter, appointments } = apptBookSettings;

  switch (selectedFilter) {
    case 'rooms': {
      return filter(appointments, appt => !!appt.room);
    }
    case 'resources': {
      return filter(appointments, appt => !!appt.resournce);
    }
    default:
      return appointments;
  }
};

const selectEndTime = (apptBookSettings) => {
  const { selectedProvider, endDate, startDate, pickerMode } = apptBookSettings;
  return selectedProvider !== TYPE_PROVIDER && pickerMode === PICKER_MODE_WEEK
    ? endDate
    : startDate;
};

const getStoreTodaySchedule = (currentDay, storeInfo, scheduleExceptions) => {
  const storeTodaySchedule = storeInfo
    ? storeInfo.weeklySchedules[currentDay.isoWeekday() - 1]
    : null;

  const exception = get(scheduleExceptions, 'length', 0) > 0
    ? filter(scheduleExceptions, item =>
      moment(item.startDate, 'YYYY-MM-DD').isSame(currentDay, 'month'),
    )[0]
    : null;

  return exception || storeTodaySchedule;
};

const getMinStartTimeMoment = (args: any, minStartTimeMomentArgs) => {
  const {
    storeTodaySchedule,
    filteredAppts,
    blockTimes,
    isFilterProviderOrDeskStaffAndThereAreBlockTimes,
  } = args;

  let minStartTimeMoment = minStartTimeMomentArgs;

  const minScheduleTime = storeTodaySchedule && storeTodaySchedule.start1
    ? moment(storeTodaySchedule.start1, 'HH:mm')
    : moment('05:00', 'HH:mm');

  if (!minStartTimeMoment) {
    minStartTimeMoment = minScheduleTime;
  }

  const minAppointmentTime = filteredAppts.length > 0
    ? moment(
      minBy(filteredAppts, item =>
        moment(get(item, 'fromTime', ''), 'HH:mm').unix(),
      ).fromTime,
      'HH:mm',
    )
    : minStartTimeMoment;

  const minBlokTimeTime = isFilterProviderOrDeskStaffAndThereAreBlockTimes
    ? moment(
      minBy(blockTimes, item => moment(item.fromTime, 'HH:mm').unix())
        .fromTime,
      'HH:mm',
    )
    : minStartTimeMoment;

  return moment.min(
    minStartTimeMoment,
    minScheduleTime,
    minAppointmentTime,
    minBlokTimeTime,
  );
};

const getMaxEndTimeMoment = (args: any, maxEndTimeMomentArgs) => {

  const {
    storeTodaySchedule,
    filteredAppts,
    blockTimes,
    isFilterProviderOrDeskStaffAndThereAreBlockTimes,
  } = args;

  let maxEndTimeMoment = maxEndTimeMomentArgs;

  const morningEndTime = storeTodaySchedule && storeTodaySchedule.end1
    ? moment(storeTodaySchedule.end1, 'HH:mm')
    : moment('23:00', 'HH:mm');

  const maxScheduleTime = storeTodaySchedule && storeTodaySchedule.end2
    ? moment(storeTodaySchedule.end2, 'HH:mm')
    : morningEndTime;

  if (!maxEndTimeMoment) {
    maxEndTimeMoment = maxScheduleTime;
  }

  const maxAppointmentTime = filteredAppts.length > 0
    ? moment(
      maxBy(filteredAppts, item =>
        moment(get(item, 'toTime', ''), 'HH:mm').unix(),
      ).toTime,
      'HH:mm',
    )
    : maxEndTimeMoment;

  const maxBlockTimeTime = isFilterProviderOrDeskStaffAndThereAreBlockTimes
    ? moment(
      maxBy(blockTimes, item => moment(item.toTime, 'HH:mm').unix())
        .toTime,
      'HH:mm',
    )
    : maxEndTimeMoment;

  return moment.max(
    maxEndTimeMoment,
    maxScheduleTime,
    maxAppointmentTime,
    maxBlockTimeTime,
  );
};


export default apptGridSettingsSelector;
