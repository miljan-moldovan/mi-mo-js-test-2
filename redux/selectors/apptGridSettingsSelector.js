import { createSelector } from 'reselect';
import moment from 'moment';
import { get, filter, minBy, maxBy, times } from 'lodash';

import { storeInfoSelector, storeScheduleExceptionsSelector } from './storeSelector';

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

const createSchedule = ({
  index, step, minStartTime,
}) => moment(minStartTime, 'HH:mm').add(index * step, 'm');

export const apptGridSettingsSelector = createSelector(
  [storeInfoSelector, storeScheduleExceptionsSelector, apptBookSettingsSelector],
  (storeInfo, scheduleExceptions, apptBookSettings) => {
    const {
      selectedFilter, selectedProvider, startDate,
      endDate, pickerMode, appointments, blockTimes,
      step,
    } = apptBookSettings;
    let filteredAppts = null;
    switch (selectedFilter) {
      case 'rooms': {
        filteredAppts = filter(appointments, appt => !!appt.room);
        break;
      }
      case 'resources': {
        filteredAppts = filter(appointments, appt => !!appt.resournce);
        break;
      }
      default:
        filteredAppts = appointments;
        break;
    }

    const newEndDate = selectedProvider !== 'all' && pickerMode === 'week' ? endDate : startDate;
    const currentDay = moment(startDate);
    let storeTodaySchedule;
    let exception;
    let minScheduleTime;
    let minAppointmentTime;
    let minBlokTimeTime;
    let minStartTimeMoment;
    let morningEndTime;
    let maxScheduleTime;
    let maxAppointmentTime;
    let maxBlockTimeTime;
    let maxEndTimeMoment;
    while (currentDay.isSameOrBefore(newEndDate)) {
      storeTodaySchedule = storeInfo ?
        storeInfo.weeklySchedules[currentDay.isoWeekday() - 1] : null;
      exception = get(scheduleExceptions, 'length', 0) > 0 ?
        filter(scheduleExceptions, item => moment(item.startDate, 'YYYY-MM-DD').isSame(currentDay, 'day'))[0] : null;
      storeTodaySchedule = exception || storeTodaySchedule;
      // min startTime
      minStartTimeMoment = storeTodaySchedule && storeTodaySchedule.start1 ? moment(storeTodaySchedule.start1, 'HH:mm') : moment('05:00', 'HH:mm');
      minAppointmentTime = filteredAppts.length > 0 ? moment(minBy(filteredAppts, item => moment(get(item, 'fromTime', ''), 'HH:mm').unix()).fromTime, 'HH:mm') : minStartTimeMoment;
      minBlokTimeTime = (selectedFilter === 'providers' || selectedFilter === 'deskStaff') && blockTimes.length > 0 ? moment(minBy(blockTimes, item => moment(item.fromTime, 'HH:mm').unix()).fromTime, 'HH:mm') : minStartTimeMoment;
      minStartTimeMoment =
        moment.min(minStartTimeMoment, minAppointmentTime, minBlokTimeTime);
      // max endTime
      morningEndTime = storeTodaySchedule && storeTodaySchedule.end1 ? moment(storeTodaySchedule.end1, 'HH:mm') : moment('23:00', 'HH:mm');
      maxEndTimeMoment = storeTodaySchedule && storeTodaySchedule.end2 ? moment(storeTodaySchedule.end2, 'HH:mm') : morningEndTime;
      maxAppointmentTime = filteredAppts.length > 0 ? moment(maxBy(filteredAppts, item => moment(get(item, 'toTime', ''), 'HH:mm').unix()).toTime, 'HH:mm') : maxEndTimeMoment;
      maxBlockTimeTime = (selectedFilter === 'providers' || selectedFilter === 'deskStaff') && blockTimes.length > 0 ? moment(maxBy(blockTimes, item => moment(item.toTime, 'HH:mm').unix()).toTime, 'HH:mm') : maxEndTimeMoment;
      maxEndTimeMoment =
        moment.max(maxEndTimeMoment, maxAppointmentTime, maxBlockTimeTime);
      currentDay.add(1, 'd');
    }
    const minStartTime = minStartTimeMoment.format('HH:mm');
    const maxEndTime = maxEndTimeMoment.format('HH:mm');
    storeTodaySchedule = exception || storeTodaySchedule;
    const numOfRow = Math.round(maxEndTimeMoment.diff(minStartTimeMoment, 'minutes') / step);
    const schedule = times(numOfRow, index => createSchedule({
      index, step, minStartTime,
    }));
    return {
      numOfRow,
      minStartTime,
      maxEndTime,
      schedule,
      weeklySchedule: storeInfo ? storeInfo.weeklySchedules : [],
      step,
    };
  },
);

export default apptGridSettingsSelector;
