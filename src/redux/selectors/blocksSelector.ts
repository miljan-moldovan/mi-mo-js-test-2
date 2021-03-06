import {createSelector} from 'reselect';
import {groupBy, filter, flatten} from 'lodash';

import groupedAvailableProvidersSelector from './providersSelector';

const blocksSelector = state => state.appointmentBookReducer.blockTimes;

const blocksGroupedByProvider = createSelector (blocksSelector, blocks =>
  groupBy (blocks, 'employeeId')
);

const getVisibleBlocksDataSource = createSelector (
  [blocksGroupedByProvider, groupedAvailableProvidersSelector],
  (groupedBlocks, groupedAvailableProviders) =>
    flatten (
      filter (
        groupedBlocks,
        blocks =>
          groupedAvailableProviders[blocks[0].employee.id] ? blocks : null
      )
    )
);

export default getVisibleBlocksDataSource;
