import clientsActions, {
  SET_SUBTITLE,
  SET_PREPARED_CLIENTS,
  SET_FILTERED_CLIENTS,
  SET_CLIENTS,
  SET_LIST_ITEM,
  SET_HEADER_ITEM,
  SET_SHOW_LATERAL_LIST,
  SET_SEARCH_TEXT,
  SET_SHOW_FILTER_MODAL,
  SET_SORT,
  SET_FILTER,
  SET_SORT_TYPES,
  SET_FILTER_TYPES,
} from '../actions/clients';

const initialState = {
  subtitle: 'clients',
  prepared: [],
  filtered: [],
  clients: [],
  listItem: {},
  headerItem: {},
  showLateralList: {},
  searchText: '',
  showFilterModal: false,
  selectedSort: {},
  selectedFilter: {},
  sortTypes: [],
  filterTypes: [],
};

export default function clientsReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_SUBTITLE:
      return {
        ...state,
        error: null,
        subtitle: data.subtitle,
      };
    case SET_PREPARED_CLIENTS:
      return {
        ...state,
        error: null,
        prepared: data.prepared,
      };
    case SET_FILTERED_CLIENTS:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case SET_CLIENTS:
      return {
        ...state,
        error: null,
        clients: data.clients,
      };
    case SET_LIST_ITEM:
      return {
        ...state,
        error: null,
        listItem: data.listItem,
      };
    case SET_HEADER_ITEM:
      return {
        ...state,
        error: null,
        headerItem: data.headerItem,
      };
    case SET_SHOW_LATERAL_LIST:
      return {
        ...state,
        error: null,
        showLateralList: data.showLateralList,
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        error: null,
        searchText: data.searchText,
      };
    case SET_SHOW_FILTER_MODAL:
      return {
        ...state,
        error: null,
        showFilterModal: data.showFilterModal,
      };
    case SET_SORT:
      return {
        ...state,
        error: null,
        selectedSort: data.selectedSort,
      };
    case SET_FILTER:
      return {
        ...state,
        error: null,
        selectedFilter: data.selectedFilter,
      };
    case SET_SORT_TYPES:
      return {
        ...state,
        error: null,
        sortTypes: data.sortTypes,
      };
    case SET_FILTER_TYPES:
      return {
        ...state,
        error: null,
        filterTypes: data.filterTypes,
      };

    default:
      return state;
  }
}
