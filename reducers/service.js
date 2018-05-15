import servicesActions, {
  SET_SERVICES,
  SET_FILTERED_SERVICES,
  SET_SHOW_CATEGORY_SERVICES,
  GET_SERVICES,
  GET_SERVICES_SUCCESS,
  GET_SERVICES_FAILED,
  GET_SHOW_CATEGORY_SERVICES,
  SET_CATEGORY_SERVICES,
  GET_CATEGORY_SERVICES,
  SET_SELECTED_SERVICE,
} from '../actions/service';

const initialState = {
  filtered: [],
  services: [],
  showCategoryServices: false,
  categoryServices: [],
  selectedService: null,
};

export default function serviceReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
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
    case GET_SHOW_CATEGORY_SERVICES:
      return {
        ...state,
        isLoading: true,
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
        isLoading: false,
        services: data.services,
        error: null,
      };
    case GET_SERVICES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        services: [],
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
