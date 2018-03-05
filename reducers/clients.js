import clientsActions, {
  SET_CLIENTS,
  SET_FILTERED_CLIENTS,
  SET_SUGGESTIONS_LIST,
  SET_FILTERED_SUGGESTIONS_LIST,
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
