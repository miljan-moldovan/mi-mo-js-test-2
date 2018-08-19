import moment from 'moment';
import { maxBy, minBy } from 'lodash';

export const getMinMaxTimes = ({ storeSchedule = [], appointments = [], blockTimes = [], step = 15 }) => {
  // min start time calulation
  const minScheduleTime = storeSchedule.length > 0 ? moment(storeSchedule[0].start, 'HH:mm') : moment('07:00', 'HH:mm');
  const minAppointmentStartTime = appointments.length > 0 ? moment(minBy(appointments, item => moment(item.fromTime, 'HH:mm').unix()).fromTime, 'HH:mm') : minScheduleTime;
  const minBlokTimeStartTime = blockTimes.length > 0 ? moment(minBy(blockTimes, item => moment(item.fromTime, 'HH:mm').unix()).fromTime, 'HH:mm') : minScheduleTime;
  const minStartTimeMoment =
    moment.min(minAppointmentStartTime, minScheduleTime, minBlokTimeStartTime);
  const minStartTime = minStartTimeMoment.format('HH:mm');
  // max end time calculation
  const maxScheduleEndTime = storeSchedule.length > 0 ?
    moment(storeSchedule[storeSchedule.length - 1].end, 'HH:mm') : moment('19:00', 'HH:mm');
  const maxAppointmentEndTime = appointments.length > 0 ? moment(maxBy(appointments, item => moment(item.toTime, 'HH:mm').unix()).toTime, 'HH:mm') : maxScheduleEndTime;
  const maxBlockTimeEndTime = blockTimes.length > 0 ? moment(maxBy(blockTimes, item => moment(item.toTime, 'HH:mm').unix()).toTime, 'HH:mm') : maxScheduleEndTime;
  const maxEndTimeMoment =
    moment.max(maxAppointmentEndTime, maxScheduleEndTime, maxBlockTimeEndTime);
  const maxEndTime = maxEndTimeMoment.format('HH:mm');
  // end
  const numOfRow = Math.round(maxEndTimeMoment.diff(minStartTimeMoment, 'minutes') / step);
  return {
    minStartTime,
    maxEndTime,
    numOfRow,
  };
};

export default { getMinMaxTimes };
