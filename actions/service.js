import apiWrapper from '../utilities/apiWrapper';

export const SET_SERVICES = 'services/SET_SERVICES';
export const SET_FILTERED_SERVICES = 'services/SET_FILTERED_SERVICES';
export const SET_SHOW_CATEGORY_SERVICES = 'services/SET_SHOW_CATEGORY_SERVICES';
export const SET_CATEGORY_SERVICES = 'services/SET_CATEGORY_SERVICES';

export const GET_SERVICES = 'services/GET_SERVICES';
export const GET_SERVICES_SUCCESS = 'services/GET_SERVICES_SUCCESS';
export const GET_SERVICES_FAILED = 'services/GET_SERVICES_FAILED';
export const GET_CATEGORY_SERVICES = 'services/GET_CATEGORY_SERVICES';
export const SET_SELECTED_SERVICE = 'services/SET_SELECTED_SERVICE';

const getServicesSuccess = services => ({
  type: GET_SERVICES_SUCCESS,
  data: { services },
});

const getServicesFailed = error => ({
  type: GET_SERVICES_FAILED,
  data: { error },
});

const getServices = (params, filterByProvider = false, filterProvider = null) => (dispatch, getState) => {
  dispatch({ type: GET_SERVICES });
  if (filterByProvider) {
    const { selectedProvider } = getState().providersReducer;
    // params.employeeId = filterProvider === null ? selectedProvider.id : filterProvider.id;
  }

  return apiWrapper.doRequest('getServiceTree', params)
    .then(response => dispatch(getServicesSuccess(response)))
    .catch(error => dispatch(getServicesFailed(error)));
};

function setServices(services) {
  return {
    type: SET_SERVICES,
    data: { services },
  };
}


function setSelectedService(selectedService) {
  return {
    type: SET_SELECTED_SERVICE,
    data: { selectedService },
  };
}

function setShowCategoryServices(showCategoryServices) {
  return {
    type: SET_SHOW_CATEGORY_SERVICES,
    data: { showCategoryServices },
  };
}

function setCategoryServices(categoryServices) {
  return {
    type: SET_CATEGORY_SERVICES,
    data: { categoryServices },
  };
}

function setFilteredServices(filtered) {
  return {
    type: SET_FILTERED_SERVICES,
    data: { filtered },
  };
}

const servicesActions = {
  setServices,
  setFilteredServices,
  getServices,
  setShowCategoryServices,
  setCategoryServices,
  setSelectedService,
};

export default servicesActions;
