import {createSelector} from 'reselect';

const servicesSelector = state => state.serviceReducer.services;

const flatServicesSelector = createSelector (servicesSelector, services =>
  services.reduce ((flat, category) => [...flat, ...category.services], [])
);

export default flatServicesSelector;
