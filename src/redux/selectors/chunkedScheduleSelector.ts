import moment from 'moment';
import { extendMoment } from 'moment-range';
import { createSelector } from 'reselect';
import { apptGridSettingsSelector } from './apptGridSettingsSelector';
import { getRangeExtendedMoment } from '@/utilities/helpers';

const extendedMoment = getRangeExtendedMoment();

const storeScheduledIntervalsSelector = state =>
  state.storeReducer.selectedDateScheduledIntervals;

const chunkedScheduleSelector = createSelector(
  [apptGridSettingsSelector, storeScheduledIntervalsSelector],
  (settings, intervals = []) => {
    const reduced = intervals.reduce((agg, schedule) => {
      const { step = 15 } = settings;
      const start = moment(schedule.start, 'hh:mm:ss');
      const end = moment(schedule.end, 'hh:mm:ss');
      const range = extendedMoment.range(start, end);
      const chunked = Array.from(range.by('minutes', { step }));
      return [...agg, ...chunked];
    }, []);
    return reduced;
  },
);
export default chunkedScheduleSelector;
