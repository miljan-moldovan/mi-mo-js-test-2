import {createSelector} from 'reselect';
import {groupBy, filter} from 'lodash';

import filterOptionsSelector from './filterOptionsSelector';

const providersSelector = state => state.appointmentBookReducer.providers;

export const filteredProviders = createSelector (
  [providersSelector, filterOptionsSelector],
  (providers, filterOptions) => {
    if (filterOptions.showOffEmployees) {
      return providers;
    }
    return filter (providers, provider => !provider.isOff);
  }
);

const groupedAvailableProvidersSelector = createSelector (
  [providersSelector],
  providers => groupBy (providers, 'id')
);

export default groupedAvailableProvidersSelector;
