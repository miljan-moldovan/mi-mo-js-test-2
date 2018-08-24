// @flow
import clientsActions, {
  SET_CLIENTS,
  SET_FILTERED_CLIENTS,
  SET_SUGGESTIONS_LIST,
  SET_FILTERED_SUGGESTIONS_LIST,
  GET_CLIENTS,
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_FAILED,
  GET_MERGEABLE_CLIENTS,
  GET_MERGEABLE_CLIENTS_SUCCESS,
  GET_MERGEABLE_CLIENTS_FAILED,
  MERGE_CLIENTS,
  MERGE_CLIENTS_SUCCESS,
  MERGE_CLIENTS_FAILED,
} from '../actions/clients';

const initialState = {
  filtered: [],
  clients: [],
  mergeableClients: [],
  suggestionsList: [],
  filteredSuggestions: [],
  isLoading: false,
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
    case GET_MERGEABLE_CLIENTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_MERGEABLE_CLIENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        mergeableClients: data.response,
        error: null,
      };
    case GET_MERGEABLE_CLIENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        mergeableClients: [],
      };
    case MERGE_CLIENTS:
      return {
        ...state,
        waitingMerge: true,
        isLoading: true,
      };
    case MERGE_CLIENTS_SUCCESS:
      return {
        ...state,
        waitingMerge: false,
        error: null,
        isLoading: false,
      };
    case MERGE_CLIENTS_FAILED:
      return {
        ...state,
        waitingMerge: false,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
