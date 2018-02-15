export const SET_CLIENTS = 'clientsSearch/SET_CLIENTS';
export const SET_SEARCH_TEXT = 'clientsSearch/SET_SEARCH_TEXT';
export const SET_FILTERED_CLIENTS = 'clientsSearch/SET_FILTERED_CLIENTS';
export const SET_SELECTED_FILTER = 'clientsSearch/SET_SELECTED_FILTER';
export const SET_SHOW_FILTER = 'clientsSearch/SET_SHOW_FILTER';

function setClients(clients) {
  return {
    type: SET_CLIENTS,
    data: { clients },
  };
}

function setSearchText(searchText) {
  return {
    type: SET_SEARCH_TEXT,
    data: { searchText },
  };
}

function setFilteredClients(filtered) {
  return {
    type: SET_FILTERED_CLIENTS,
    data: { filtered },
  };
}

function setSelectedFilter(selectedFilter) {
  return {
    type: SET_SELECTED_FILTER,
    data: { selectedFilter },
  };
}

function setShowFilter(showFilter) {
  return {
    type: SET_SHOW_FILTER,
    data: { showFilter },
  };
}

const clientsSearchActions = {
  setClients,
  setSearchText,
  setFilteredClients,
  setSelectedFilter,
  setShowFilter,
};

export default clientsSearchActions;
