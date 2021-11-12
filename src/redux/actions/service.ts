import { Services, Queue } from '@/utilities/apiWrapper';
import { ServiceCategories, Maybe, Service } from '@/models';

export const SET_SERVICES = 'services/SET_SERVICES';
export const SET_FILTERED_SERVICES = 'services/SET_FILTERED_SERVICES';
export const SET_SHOW_CATEGORY_SERVICES = 'services/SET_SHOW_CATEGORY_SERVICES';
export const SET_CATEGORY_SERVICES = 'services/SET_CATEGORY_SERVICES';
export const IS_SELECTING_EXTRAS = 'services/IS_SELECTING_EXTRAS';
export const GET_SERVICES = 'services/GET_SERVICES';
export const GET_SERVICES_SUCCESS = 'services/GET_SERVICES_SUCCESS';
export const GET_SERVICES_FAILED = 'services/GET_SERVICES_FAILED';
export const GET_CATEGORY_SERVICES = 'services/GET_CATEGORY_SERVICES';
export const SET_SELECTED_SERVICE = 'services/SET_SELECTED_SERVICE';

export const GET_QUEUE_SERVICE_EMPLOYEE_SERVICES =
  'services/GET_QUEUE_SERVICE_EMPLOYEE_SERVICES';
export const GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_SUCCESS =
  'services/GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_SUCCESS';
export const GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_FAILED =
  'services/GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_FAILED';

const getServicesSuccess = (services: ServiceCategories[]): any => ({
  type: GET_SERVICES_SUCCESS,
  data: { services },
});

const getServicesFailed = (error: Maybe<any>): any => ({
  type: GET_SERVICES_FAILED,
  data: { error },
});

const setSelectingExtras = (isSelectingExtras: boolean): any => ({
  type: IS_SELECTING_EXTRAS,
  data: { isSelectingExtras },
});

const getServices = (params: any): any => (dispatch, getState) => {
  const { isSelectingExtras } = getState().serviceReducer;
  if (isSelectingExtras) {
    return false;
  }

  dispatch({ type: GET_SERVICES });
  // if (filterByProvider) {
  //   const { selectedProvider } = getState().providersReducer;
  //   // params.employeeId = filterProvider === null ? selectedProvider.id : filterProvider.id;
  // }

  return Services.getServiceTree(params)
    .then(response => dispatch(getServicesSuccess(response)))
    .catch(error => dispatch(getServicesFailed(error)));
};

const getQueueServiceEmployeeServicesSuccess = (services: any): any => ({
  type: GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_SUCCESS,
  data: { services },
});

const getQueueServiceEmployeeServicesFailed = (error: any): any => ({
  type: GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_FAILED,
  data: { error },
});

const getQueueServiceEmployeeServices = (params: any): any => (dispatch, getState) => {
  const { isSelectingExtras } = getState().serviceReducer;
  if (isSelectingExtras) {
    return false;
  }

  dispatch({ type: GET_QUEUE_SERVICE_EMPLOYEE_SERVICES });
  return Queue.getQueueServiceEmployeeServices(params)
    .then(response =>
      dispatch(getQueueServiceEmployeeServicesSuccess(response))
    )
    .catch(error => dispatch(getQueueServiceEmployeeServicesFailed(error)));
};

function setServices(services: any): any {
  return {
    type: SET_SERVICES,
    data: { services },
  };
}

function setSelectedService(selectedService: Maybe<Service>): any {
  return {
    type: SET_SELECTED_SERVICE,
    data: { selectedService },
  };
}

function setShowCategoryServices(showCategoryServices: boolean): any {
  return {
    type: SET_SHOW_CATEGORY_SERVICES,
    data: { showCategoryServices },
  };
}

function setCategoryServices(categoryServices: any): any {
  return {
    type: SET_CATEGORY_SERVICES,
    data: { categoryServices },
  };
}

function setFilteredServices(filtered: ServiceCategories[]): any {
  return {
    type: SET_FILTERED_SERVICES,
    data: { filtered },
  };
}

const servicesActions = {
  setSelectingExtras,
  setServices,
  setFilteredServices,
  getServices,
  setShowCategoryServices,
  setCategoryServices,
  setSelectedService,
  getQueueServiceEmployeeServices,
};
export default servicesActions;

export interface ServicesActions {
  setSelectingExtras: (flag: boolean) => any;
  setServices: (services: any) => any;
  setFilteredServices: (filtered: any) => any;
  getServices: (params: any) => any;
  setShowCategoryServices: (show: boolean) => any;
  setCategoryServices: (categories: any) => any;
  setSelectedService: (service: any) => any;
  getQueueServiceEmployeeServices: (params: any) => any;
}