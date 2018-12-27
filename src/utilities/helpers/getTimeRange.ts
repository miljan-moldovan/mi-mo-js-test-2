import moment from 'moment';
import { times } from 'lodash';

export const generateTimeRangeItems = (
  fromTime: moment.Moment, toTime: moment.Moment, step: number): moment.Moment[] => {
  const numOfRow = toTime.diff(fromTime, 'minutes') / step + 1;
  return times(numOfRow, index => fromTime.clone().add(index * step, 'minutes'));
};
