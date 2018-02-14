import clientsSearchActions, {
  SET_CLIENTS,
  SET_SEARCH_TEXT,
  SET_FILTERED_CLIENTS,
  SET_SELECTED_FILTER,
} from '../actions/clientsSearch';

const initialState = {
  prepared: [],
  filtered: [],
  clients: [],
  searchText: '',
  selectedFilter: 0,
};

export default function clientsSearchReducer(state = initialState, action) {
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
    case SET_SELECTED_FILTER:
      return {
        ...state,
        error: null,
        selectedFilter: data.selectedFilter,
      };
    case SET_FILTERED_CLIENTS:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    default:
      return state;
  }
}
