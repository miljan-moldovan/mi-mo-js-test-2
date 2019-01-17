import { createSelector } from 'reselect';

const categoriesSelector = state => state.serviceReducer.services

const isResourcesAvailable = createSelector(
  categoriesSelector,
  categories =>
    categories.some(category =>
      category.services.some(service =>
        service.supportedResource)),
);

export default isResourcesAvailable;
