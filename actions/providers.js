import { get } from 'lodash';
import { Services, Employees } from '../utilities/apiWrapper';

const alphabeticFilter = (a, b) => {
  if (a.fullName < b.fullName) return -1;
  if (a.fullName > b.fullName) return 1;
  return 0;
};

export const GET_PROVIDERS = 'providers/GET_PROVIDERS';
export const GET_PROVIDERS_SUCCESS = 'providers/GET_PROVIDERS_SUCCESS';
export const GET_PROVIDERS_ERROR = 'providers/GET_PROVIDERS_ERROR';
export const SET_FILTERED_PROVIDERS = 'providers/SET_FILTERED_PROVIDERS';
export const SELECTED_FILTER_TYPES = 'providers/SELECTED_FILTER_TYPES';
export const SET_SELECTED_PROVIDER = 'providers/SET_SELECTED_PROVIDER';

export const GET_PROVIDER_STATUS = 'providers/GET_PROVIDER_STATUS';
export const GET_PROVIDER_STATUS_SUCCESS = 'providers/GET_PROVIDER_STATUS_SUCCESS';
export const GET_PROVIDER_STATUS_FAILED = 'providers/GET_PROVIDER_STATUS_FAILED';


const setSelectedProvider = selectedProvider => ({
  type: SET_SELECTED_PROVIDER,
  data: { selectedProvider },
});

const getProvidersSuccess = (providerList, filterList = false) => {
  let providers = providerList;
  const deskStaff = providers.filter(item => item.isReceptionist);
  if (filterList) {
    const filterProviderIds = filterList.map(item => item.id);
    providers = providers.filter(item => filterProviderIds.includes(item.id));
  }
  return {
    type: GET_PROVIDERS_SUCCESS,
    data: { providers, deskStaff },
  };
};

const getProvidersError = error => ({
  type: GET_PROVIDERS_ERROR,
  data: { error },
});

const getProviders = (params, filterByService = false, filterList = false) =>
  (dispatch, getState) => {
    dispatch({ type: GET_PROVIDERS });
    const { selectedService } = getState().serviceReducer;

    const serviceId = get(selectedService || {}, 'id', false);
    if (serviceId && filterByService) {
      return Services.getEmployeesByService(serviceId, params)
        .then((providers) => {
          dispatch(getProvidersSuccess(providers.sort(alphabeticFilter), filterList));
        })
        .catch((err) => {
          dispatch(getProvidersError(err));
        });
    }

    if (!filterList) {
      return Employees.getEmployees(params)
        .then((providers) => {
          dispatch(getProvidersSuccess(providers.sort(alphabeticFilter), false));
        })
        .catch((err) => {
          dispatch(getProvidersError(err));
        });
    }

    return dispatch(getProvidersSuccess(filterList.slice().sort(alphabeticFilter), filterList));
  };

const setFilteredProviders = (filtered) => {
  const filteredDeskStaff = filtered.filter(item => item.isReceptionist);
  return {
    type: SET_FILTERED_PROVIDERS,
    data: { filtered, filteredDeskStaff },
  };
};


const getProviderStatusSuccess = response => ({
  type: GET_PROVIDER_STATUS_SUCCESS,
  data: { response },
});

const getProviderStatusFailed = error => ({
  type: GET_PROVIDER_STATUS_FAILED,
  data: { error },
});


const getProviderStatus = (employeeId, callback) => (dispatch) => {
  dispatch({ type: GET_PROVIDER_STATUS });

  return Employees.getEmployeeStatus(employeeId)
    .then((response) => { dispatch(getProviderStatusSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getProviderStatusFailed(error)); callback(false); });
};

const providersActions = {
  getProviders,
  getProvidersSuccess,
  getProvidersError,
  setFilteredProviders,
  setSelectedProvider,
  getProviderStatus,
};

export default providersActions;
