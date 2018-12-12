import { createSelector } from 'reselect';
import { apptGridSettingsSelector } from './apptGridSettingsSelector';
import moment from 'moment';

const storeScheduledIntervalsSelector = state =>
  state.storeReducer.selectedDateScheduledIntervals;

const rangeTimeSelector = createSelector(
  [apptGridSettingsSelector, storeScheduledIntervalsSelector],
  (settings, intervals = []) => {
    const { step = 15 } = settings;
    const firstInterval = intervals[0];
    const initMinDate = moment(firstInterval.start, 'hh:mm:ss');
    const initMaxDate = moment(firstInterval.end, 'hh:mm:ss');

    return intervals.reduce((agg, schedule) => {
      const minimumDate = moment(schedule.start, 'hh:mm:ss');
      const maximumDate = moment(schedule.end, 'hh:mm:ss');
      const expectedRanges = [...agg.expectedRanges, { minimumDate, maximumDate }];
      const newMinimumDate = agg.minimumDate > minimumDate ? minimumDate : agg.minimumDate;
      const newMaximumDate = agg.maximumDate < maximumDate ? maximumDate : agg.maximumDate;
      return {
        ...agg, ...{
          minimumDate: newMinimumDate,
          maximumDate: newMaximumDate,
          expectedRanges,
        },
      };
    }, {
      step,
      expectedRanges: [],
      minimumDate: initMinDate,
      maximumDate: initMaxDate,
    });
  },
);
export default rangeTimeSelector;
