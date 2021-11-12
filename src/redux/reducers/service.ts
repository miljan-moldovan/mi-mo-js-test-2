import {
  SET_SERVICES,
  SET_FILTERED_SERVICES,
  SET_SHOW_CATEGORY_SERVICES,
  GET_SERVICES,
  GET_SERVICES_SUCCESS,
  GET_SERVICES_FAILED,
  GET_QUEUE_SERVICE_EMPLOYEE_SERVICES,
  GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_SUCCESS,
  GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_FAILED,
  SET_CATEGORY_SERVICES,
  GET_CATEGORY_SERVICES,
  SET_SELECTED_SERVICE,
  IS_SELECTING_EXTRAS,
} from '@/redux/actions/service';
import { Maybe, Service, ServiceCategories } from '@/models';

export interface ServicesReducer {
  isLoading: boolean;
  isSelectingExtras: boolean;
  showCategoryServices: boolean;
  filtered: Maybe<ServiceCategories>[];
  services: Maybe<ServiceCategories>[];
  selectedService: Maybe<ServiceCategories>;
  quickQueueServices: Maybe<Service>[];
  categoryServices: Maybe<ServiceCategories>[];
}

const initialState: ServicesReducer = {
  isLoading: false,
  filtered: [],
  services: [],
  quickQueueServices: [],
  showCategoryServices: false,
  categoryServices: [],
  selectedService: null,
  isSelectingExtras: false,
};

export default function serviceReducer(state: ServicesReducer = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case IS_SELECTING_EXTRAS:
      return {
        ...state,
        isSelectingExtras: data.isSelectingExtras,
      };
    case GET_CATEGORY_SERVICES:
      return {
        ...state,
        isLoading: true,
      };
    case SET_CATEGORY_SERVICES:
      return {
        ...state,
        error: null,
        categoryServices: data.categoryServices,
      };
    case SET_SHOW_CATEGORY_SERVICES:
      return {
        ...state,
        error: null,
        showCategoryServices: data.showCategoryServices,
      };

    case GET_SERVICES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SERVICES_SUCCESS:
      return {
        ...state,
        error: null,
        filtered: data.services,
        services: data.services,
        isLoading: false,
      };
    case GET_SERVICES_FAILED:
      return {
        ...state,
        isLoading: false,
        services: [],
        error: data.error,
      };
    case GET_QUEUE_SERVICE_EMPLOYEE_SERVICES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        filtered: data.services,
        quickQueueServices: data.services,
      };
    case GET_QUEUE_SERVICE_EMPLOYEE_SERVICES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        quickQueueServices: [],
      };
    case SET_SERVICES:
      return {
        ...state,
        error: null,
        services: data.services,
      };
    case SET_SELECTED_SERVICE:
      return {
        ...state,
        error: null,
        selectedService: data.selectedService,
      };
    case SET_FILTERED_SERVICES:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    default:
      return state;
  }
}
