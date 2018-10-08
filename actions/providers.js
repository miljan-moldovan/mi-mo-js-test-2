import { get, isFunction } from 'lodash';
import { Services, Employees, Queue } from '../utilities/apiWrapper';
import { showErrorAlert } from './utils';

const alphabeticFilter = (a, b) => {
  if (a.fullName < b.fullName) return -1;
  if (a.fullName > b.fullName) return 1;
  return 0;
};

export const GET_PROVIDERS = 'providers/GET_PROVIDERS';
export const GET_PROVIDERS_SUCCESS = 'providers/GET_PROVIDERS_SUCCESS';
export const GET_PROVIDERS_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const GET_QUEUE_EMPLOYEES = 'providers/GET_QUEUE_EMPLOYEES';
export const GET_QUEUE_EMPLOYEES_SUCCESS = 'providers/GET_QUEUE_EMPLOYEES_SUCCESS';
export const GET_QUEUE_EMPLOYEES_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const GET_QUICK_QUEUE_EMPLOYEES = 'providers/GET_QUICK_QUEUE_EMPLOYEES';
export const GET_QUICK_QUEUE_EMPLOYEES_SUCCESS = 'providers/GET_QUICK_QUEUE_EMPLOYEES_SUCCESS';
export const GET_QUICK_QUEUE_EMPLOYEES_ERROR = 'providers/GET_QUICK_QUEUE_EMPLOYEES_ERROR';

export const GET_RECEPTIONISTS = 'providers/GET_RECEPTIONISTS';
export const GET_RECEPTIONISTS_SUCCESS = 'providers/GET_RECEPTIONISTS_SUCCESS';
export const GET_RECEPTIONISTS_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const GET_EMPLOYEES_BY_SERVICE = 'providers/GET_EMPLOYEES_BY_SERVICE';
export const GET_EMPLOYEES_BY_SERVICE_SUCCESS = 'providers/GET_EMPLOYEES_BY_SERVICE_SUCCESS';
export const GET_EMPLOYEES_BY_SERVICE_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const SET_FILTERED_PROVIDERS = 'providers/SET_FILTERED_PROVIDERS';
export const SELECTED_FILTER_TYPES = 'providers/SELECTED_FILTER_TYPES';
export const SET_SELECTED_PROVIDER = 'providers/SET_SELECTED_PROVIDER';
export const SET_SELECTED_SERVICE = 'providers/SET_SELECTED_SERVICE';

export const GET_PROVIDER_STATUS = 'providers/GET_PROVIDER_STATUS';
export const GET_PROVIDER_STATUS_SUCCESS = 'providers/GET_PROVIDER_STATUS_SUCCESS';
export const GET_PROVIDER_STATUS_FAILED = 'providers/GET_PROVIDER_STATUS_FAILED';


const setSelectedProvider = selectedProvider => ({
  type: SET_SELECTED_PROVIDER,
  data: { selectedProvider },
});

const setSelectedService = selectedService => ({
  type: SET_SELECTED_SERVICE,
  data: { selectedService },
});

const getQuickQueueEmployees = req => (dispatch, getState) => {
  dispatch({ type: GET_QUICK_QUEUE_EMPLOYEES });
  if (getState().providersReducer.selectedService) {
    const serviceId = get(getState().providersReducer.selectedService, 'id', null);
    return Promise.all([
      Queue.getQueueServiceEmployees({ id: req.queueItemId, idService: serviceId }),
    ])
      .then(([employees]) => {
        dispatch({
          type: GET_QUICK_QUEUE_EMPLOYEES_SUCCESS,
          data: { employees },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_QUICK_QUEUE_EMPLOYEES_ERROR,
          data: { error },
        });
        showErrorAlert(error);
      });
  }
  return Employees.getQueueEmployees(req)
    .then(({ employees = [] }) => dispatch({
      type: GET_QUICK_QUEUE_EMPLOYEES_SUCCESS,
      data: { employees },
    }))
    .catch((error) => {
      dispatch({
        type: GET_QUICK_QUEUE_EMPLOYEES_ERROR,
        data: { error },
      });
      showErrorAlert(error);
    });
};


const getQueueEmployees = req => (dispatch, getState) => {
  dispatch({ type: GET_QUEUE_EMPLOYEES });
  if (getState().providersReducer.selectedService) {
    const serviceId = get(getState().providersReducer.selectedService, 'id', null);
    return Promise.all([
      Employees.getQueueEmployees(),
      Services.getEmployeesByService(serviceId, req),
    ])
      .then(([{ employees = [] }, employeesByService]) => {
        dispatch({
          type: GET_QUEUE_EMPLOYEES_SUCCESS,
          data: { employees, employeesByService },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_QUEUE_EMPLOYEES_ERROR,
          data: { error },
        });
        showErrorAlert(error);
      });
  }
  return Employees.getQueueEmployees(req)
    .then(({ employees = [] }) => dispatch({
      type: GET_QUEUE_EMPLOYEES_SUCCESS,
      data: { employees },
    }))
    .catch((error) => {
      dispatch({
        type: GET_QUEUE_EMPLOYEES_ERROR,
        data: { error },
      });
      showErrorAlert(error);
    });
};

const getReceptionists = req => (dispatch) => {
  dispatch({ type: GET_RECEPTIONISTS });
  return Employees.getReceptionists(req)
    .then(employees => dispatch({
      type: GET_RECEPTIONISTS_SUCCESS,
      data: { employees },
    }))
    .catch((error) => {
      showErrorAlert(error);
      dispatch({ type: GET_RECEPTIONISTS_ERROR });
    });
};

const getProvidersSuccess = (providerList, filterList = false) => {
  let providers = providerList;
  const deskStaff = providers.filter(item => item.isReceptionist);
  if (filterList) {
    if (isFunction(filterList)) {
      providers = filterList(providers);
    } else {
      const filterProviderIds = filterList.slice().sort(alphabeticFilter).map(item => item.id);
      providers = providers.filter(item => filterProviderIds.includes(item.id));
    }
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

const getProviders = (params, selectedService = null, filterList = false) =>
  (dispatch) => {
    dispatch({ type: GET_PROVIDERS });
    const serviceId = get(selectedService, 'id', false);
    if (serviceId) {
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
    return dispatch(getProvidersSuccess(filterList, filterList));
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
    .then((response) => {
      dispatch(getProviderStatusSuccess(response)); callback(response);
    })
    .catch((error) => {
      dispatch(getProviderStatusFailed(error)); callback(false);
    });
};

const providersActions = {
  getProviders,
  getProvidersSuccess,
  getProvidersError,
  setFilteredProviders,
  setSelectedProvider,
  getProviderStatus,
  setSelectedService,
  getQueueEmployees,
  getReceptionists,
  getQuickQueueEmployees,
};

export default providersActions;
