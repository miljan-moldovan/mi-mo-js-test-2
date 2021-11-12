import moment, { Duration, Moment } from 'moment';

/**
 * Converts Duration to Moment
 */
export const durationToMoment = (duration: Duration): Moment => {
  return moment().startOf('day').add(duration, 'minutes');
};
