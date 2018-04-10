import apiWrapper from '../../utilities/apiWrapper';

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

const initialState = {
  error: null,
  filtered: [],
  providers: [],
  currentData: [],
  isLoading: false,
};

export function providersReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
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
      };
    case GET_PROVIDERS_ERROR:
      return {
        ...state,
        error: data.error,
        isLoading: true,
        providers: [],
      };
    case SET_FILTERED_PROVIDERS:
      return {
        ...state,
        isLoading: false,
        filtered: data.filtered,
        currentData: data.filtered,
      };
    default:
      return state;
  }
}

const getProvidersSuccess = providers => ({
  type: GET_PROVIDERS_SUCCESS,
  data: { providers },
});

const getProvidersError = error => ({
  type: GET_PROVIDERS_ERROR,
  data: { error },
});

const getProviders = params => (dispatch) => {
  dispatch({ type: GET_PROVIDERS });

  return apiWrapper.doRequest('getEmployees', {
    query: {
      ...params,
    },
  })
    .then((providers) => {
      dispatch(getProvidersSuccess(providers.sort(alphabeticFilter)));
    })
    .catch((err) => {
      dispatch(getProvidersError(err));
    });
};

const setFilteredProviders = filtered => ({
  type: SET_FILTERED_PROVIDERS,
  data: { filtered },
});

const providersActions = {
  getProviders,
  getProvidersSuccess,
  getProvidersError,
  setFilteredProviders,
};

export default providersActions;
