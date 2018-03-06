import clientsActions, {
  SET_CLIENTS,
  SET_FILTERED_CLIENTS,
  SET_SUGGESTIONS_LIST,
  SET_FILTERED_SUGGESTIONS_LIST,
  GET_CLIENTS,
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_FAILED,
} from '../actions/clients';

const initialState = {
  filtered: [],
  clients: [],
  suggestionsList: [],
  filteredSuggestions: [],
};

export default function clientsReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case GET_CLIENTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CLIENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        clients: data.clients,
        error: null,
      };
    case GET_CLIENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        clients: [],
      };
    case SET_CLIENTS:
      return {
        ...state,
        error: null,
        clients: data.clients,
      };
    case SET_FILTERED_CLIENTS:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case SET_SUGGESTIONS_LIST:
      return {
        ...state,
        error: null,
        suggestionsList: data.suggestionsList,
      };
    case SET_FILTERED_SUGGESTIONS_LIST:
      return {
        ...state,
        error: null,
        filteredSuggestions: data.filteredSuggestions,
      };
    default:
      return state;
  }
}
