import { createSelector } from 'reselect';
import { groupBy, filter } from 'lodash';

import filterOptionsSelector from './filterOptionsSelector';

const providersSelector = state => state.appointmentScreenReducer.providers;

const groupedAvailableProvidersSelector = createSelector(
  [providersSelector, filterOptionsSelector],
  (providers, filterOptions) =>
    (filterOptions.showOffEmployees ? groupBy(providers, 'id') : groupBy(filter(providers, provider => !provider.isOff), 'id')),
);

export default groupedAvailableProvidersSelector;
