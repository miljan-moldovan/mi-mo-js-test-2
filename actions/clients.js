export const SET_SUBTITLE = 'clients/SET_SUBTITLE';
export const SET_PREPARED_CLIENTS = 'clients/SET_PREPARED_CLIENTS';
export const SET_FILTERED_CLIENTS = 'clients/SET_FILTERED_CLIENTS';
export const SET_CLIENTS = 'clients/SET_CLIENTS';
export const SET_LIST_ITEM = 'clients/SET_LIST_ITEM';
export const SET_HEADER_ITEM = 'clients/SET_HEADER_ITEM';
export const SET_SHOW_LATERAL_LIST = 'clients/SET_SHOW_LATERAL_LIST';
export const SET_SEARCH_TEXT = 'clients/SET_SEARCH_TEXT';
export const SET_SHOW_FILTER_MODAL = 'clients/SET_SHOW_FILTER_MODAL';
export const SET_SORT = 'clients/SET_SORT';
export const SET_FILTER = 'clients/SET_FILTER';
export const SET_SORT_TYPES = 'clients/SET_SORT_TYPES';
export const SET_FILTER_TYPES = 'clients/SET_FILTER_TYPES';

function setSubtitle(subtitle) {
  return {
    type: SET_SUBTITLE,
    data: { subtitle },
  };
}

function setPreparedClients(prepared) {
  return {
    type: SET_PREPARED_CLIENTS,
    data: { prepared },
  };
}

function setFilteredClients(filtered) {
  return {
    type: SET_FILTERED_CLIENTS,
    data: { filtered },
  };
}

function setClients(clients) {
  return {
    type: SET_CLIENTS,
    data: { clients },
  };
}

function setListItem(listItem) {
  return {
    type: SET_LIST_ITEM,
    data: { listItem },
  };
}

function setHeaderItem(headerItem) {
  return {
    type: SET_HEADER_ITEM,
    data: { headerItem },
  };
}


function setShowLateralList(showLateralList) {
  return {
    type: SET_SHOW_LATERAL_LIST,
    data: { showLateralList },
  };
}


function setSearchText(searchText) {
  return {
    type: SET_SEARCH_TEXT,
    data: { searchText },
  };
}


function setShowFilterModal(showFilterModal) {
  return {
    type: SET_SHOW_FILTER_MODAL,
    data: { showFilterModal },
  };
}


function setSort(selectedSort) {
  return {
    type: SET_SORT,
    data: { selectedSort },
  };
}

function setFilter(selectedFilter) {
  return {
    type: SET_FILTER,
    data: { selectedFilter },
  };
}


function setSortTypes(sortTypes) {
  return {
    type: SET_SORT_TYPES,
    data: { sortTypes },
  };
}

function setFilterTypes(filterTypes) {
  return {
    type: SET_FILTER_TYPES,
    data: { filterTypes },
  };
}

const clientsActions = {
  setSubtitle,
  setPreparedClients,
  setFilteredClients,
  setClients,
  setListItem,
  setHeaderItem,
  setShowLateralList,
  setSearchText,
  setShowFilterModal,
  setSort,
  setFilter,
  setSortTypes,
  setFilterTypes,
};

export default clientsActions;
