import clientsActions, {
  SET_CLIENTS,
  SET_SEARCH_TEXT,
  SET_FILTERED_CLIENTS,
  SET_SELECTED_FILTER,
  SET_SHOW_FILTER,
  SET_SUGGESTIONS_LIST,
  SET_FILTERED_SUGGESTIONS_LIST,
} from '../actions/clients';

const initialState = {
  filtered: [],
  clients: [],
  searchText: '',
  selectedFilter: {},
  showFilter: false,
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
    case SET_SEARCH_TEXT:
      return {
        ...state,
        error: null,
        searchText: data.searchText,
      };
    case SET_FILTERED_CLIENTS:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case SET_SELECTED_FILTER:
      return {
        ...state,
        error: null,
        selectedFilter: data.selectedFilter,
      };
    case SET_SHOW_FILTER:
      return {
        ...state,
        error: null,
        showFilter: data.showFilter,
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
