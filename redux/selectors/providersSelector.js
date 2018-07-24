import { createSelector } from 'reselect';
import { groupBy, filter } from 'lodash';

import filterOptionsSelector from './filterOptionsSelector';

const providersSelector = state => state.appointmentScreenReducer.providers;

const groupedAvailableProvidersSelector = createSelector(
  [providersSelector],
  providers => groupBy(providers, 'id'),
);

export default groupedAvailableProvidersSelector;
