import { get, find, filter } from 'lodash';
import { createSelector } from 'reselect';

const providersSelector = state => state.queue.providers;
const settings = state => state.settingsReducer.settings;


const queueListSelector = createSelector(
  providersSelector,
  (providers) => {
    const showOnlyAvailable = find(settings, { settingName: 'ShowOnlyClockedInEmployeesInClientQueue' });
    if (get(showOnlyAvailable, 'settingValue', false)) {
      return filter(providers, item => (
        item.isClockedIn === true
      ));
    }
    return providers;
  },
);
export default queueListSelector;
