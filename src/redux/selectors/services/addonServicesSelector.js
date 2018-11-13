import {createSelector} from 'reselect';
import {filter} from 'lodash';

import flatServicesSelector from './flatServicesSelector';

const selectedServiceSelector = state => state.serviceReducer.selectedService;

const addonServicesSelector = createSelector (
  [flatServicesSelector, selectedServiceSelector],
  (services, selectedService) => {
    const results = [];
    const check = (service, index) =>
      service.id === selectedService.addons[index].id;
    for (let i = 0; i < selectedService.addons.length; i += 1) {
      const service = services.find (ser => check (ser, i));
      if (service) {
        results.push (service);
      }
    }
    return results;
  }
);

export default addonServicesSelector;
