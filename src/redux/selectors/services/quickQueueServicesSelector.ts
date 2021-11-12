import {createSelector} from 'reselect';

const servicesSelector = state => state.serviceReducer.quickQueueServices;

const quickQueueServicesSelector = createSelector (
  servicesSelector,
  quickQueueServices => {
    const list = quickQueueServices.map (elm => ({
      ...elm,
      name: elm.description,
    }));

    return list;
  }
);

export default quickQueueServicesSelector;
