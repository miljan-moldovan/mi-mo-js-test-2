import {
  SET_FILTERED_PROVIDERS,
  SET_SELECTED_PROVIDER,
  GET_PROVIDERS,
  GET_PROVIDERS_ERROR,
  GET_PROVIDERS_SUCCESS,
  GET_PROVIDER_STATUS,
  GET_PROVIDER_STATUS_SUCCESS,
  GET_PROVIDER_STATUS_FAILED,
  GET_QUEUE_EMPLOYEES,
  GET_QUEUE_EMPLOYEES_ERROR,
  GET_QUEUE_EMPLOYEES_SUCCESS,
  GET_QUICK_QUEUE_EMPLOYEES,
  GET_QUICK_QUEUE_EMPLOYEES_ERROR,
  GET_QUICK_QUEUE_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_BY_SERVICE,
  GET_EMPLOYEES_BY_SERVICE_ERROR,
  GET_EMPLOYEES_BY_SERVICE_SUCCESS,
  GET_RECEPTIONISTS,
  GET_RECEPTIONISTS_ERROR,
  GET_RECEPTIONISTS_SUCCESS,
  SET_SELECTED_SERVICE,
} from '../actions/providers';

const initialState = {
  error: null,
  filtered: [],
  currentData: [],
  deskStaff: [],
  filteredDeskStaff: [],
  currentDeskStaffData: [],
  isLoading: false,
  selectedProvider: null,
  selectedServivce: null,
  employees: [],
  providers: [],
  receptionists: [],
  queueEmployees: [],
  quickQueueEmployees: [],
  employeesByService: [],
};

const providersReducer = (state = initialState, action) => {
  const {type, data} = action;
  switch (type) {
    case SET_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: data.selectedProvider,
      };
    case SET_SELECTED_SERVICE:
      return {
        ...state,
        selectedService: data.selectedService,
      };
    case GET_EMPLOYEES_BY_SERVICE:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EMPLOYEES_BY_SERVICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        employeesByService: data.employees,
      };
    case GET_EMPLOYEES_BY_SERVICE_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case GET_RECEPTIONISTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_RECEPTIONISTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        receptionists: data.employees,
      };
    case GET_RECEPTIONISTS_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case GET_QUEUE_EMPLOYEES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_QUEUE_EMPLOYEES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        queueEmployees: data.employees,
        employeesByService: data.employeesByService || state.employeesByService,
      };
    case GET_QUEUE_EMPLOYEES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case GET_QUICK_QUEUE_EMPLOYEES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_QUICK_QUEUE_EMPLOYEES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        quickQueueEmployees: data.employees,
      };
    case GET_QUICK_QUEUE_EMPLOYEES_ERROR:
      return {
        ...state,
        isLoading: false,
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
        isLoading: false,
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
    case GET_PROVIDER_STATUS:
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    case GET_PROVIDER_STATUS_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
      };
    case GET_PROVIDER_STATUS_FAILED:
      return {
        ...state,
        error: data.error,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default providersReducer;
