import clientsSearchActions, {
  SET_CLIENTS,
  SET_SEARCH_TEXT,
  SET_SHOW_WALKIN,
  SET_FILTERED_CLIENTS,
  SET_PREPARED_CLIENTS,
} from '../actions/clientsSearch';

const initialState = {
  prepared: [],
  filtered: [],
  clients: [],
  searchText: '',
  showWalkIn: false,
};

export default function clientsSearchReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_PREPARED_CLIENTS:
      return {
        ...state,
        error: null,
        prepared: data.prepared,
      };
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
    case SET_SHOW_WALKIN:
      return {
        ...state,
        error: null,
        showWalkIn: data.showWalkIn,
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
