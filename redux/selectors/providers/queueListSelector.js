import { get } from 'lodash';
import { createSelector } from 'reselect';

import { Settings } from '../../../utilities/apiWrapper';

const providersSelector = state => state.providersReducer.providers;

const queueListSelector = createSelector(
  providersSelector,
  async (providers) => {
    const showOnlyAvailable = await Settings.getSettingsByName('ShowOnlyClockedInEmployeesInClientQueue');
    if (get(showOnlyAvailable, 'settingValue', false)) {
      return providers;
    }
    return providers;
  },
);
export default queueListSelector;
