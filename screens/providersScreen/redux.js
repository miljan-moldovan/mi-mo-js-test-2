import { get } from 'lodash';
import { Services, Employees } from '../../utilities/apiWrapper';

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

const initialState = {
  error: null,
  filtered: [],
  providers: [],
  currentData: [],
  deskStaff: [],
  filteredDeskStaff: [],
  currentDeskStaffData: [],
  selectedProvider: null,
  isLoading: false,
};

export function providersReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: data.selectedProvider,
      };
    case GET_PROVIDERS:
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    case GET_PROVIDERS_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        providers: data.providers,
        currentData: data.providers,
        deskStaff: data.deskStaff,
        currentDeskStaffData: data.deskStaff,
      };
    case GET_PROVIDERS_ERROR:
      return {
        ...state,
        error: data.error,
        isLoading: true,
        providers: [],
        deskStaff: [],
      };
    case SET_FILTERED_PROVIDERS:
      return {
        ...state,
        isLoading: false,
        filtered: data.filtered,
        currentData: data.filtered,
        filteredDeskStaff: data.filteredDeskStaff,
        currentDeskStaffData: data.filteredDeskStaff,
      };
    default:
      return state;
  }
}

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

const getProviders = (params, filterByService = false, filterList = false) => (dispatch, getState) => {
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

  return Employees.getEmployees(params)
    .then((providers) => {
      dispatch(getProvidersSuccess(providers.sort(alphabeticFilter), filterList));
    })
    .catch((err) => {
      dispatch(getProvidersError(err));
    });
};

const setFilteredProviders = (filtered) => {
  const filteredDeskStaff = filtered.filter(item => item.isReceptionist);
  return {
    type: SET_FILTERED_PROVIDERS,
    data: { filtered, filteredDeskStaff },
  };
};

const providersActions = {
  getProviders,
  getProvidersSuccess,
  getProvidersError,
  setFilteredProviders,
  setSelectedProvider,
};

export default providersActions;
