import {
  SET_FILTERED_PROVIDERS,
  SET_SELECTED_PROVIDER,
  GET_PROVIDERS,
  GET_PROVIDERS_ERROR,
  GET_PROVIDERS_SUCCESS,
} from '../actions/providers';
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

const providersReducer = (state = initialState, action) => {
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
    default:
      return state;
  }
};
export default providersReducer;
