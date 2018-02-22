export const SET_CLIENTS = 'clients/SET_CLIENTS';
export const SET_SEARCH_TEXT = 'clients/SET_SEARCH_TEXT';
export const SET_FILTERED_CLIENTS = 'clients/SET_FILTERED_CLIENTS';
export const SET_SELECTED_FILTER = 'clients/SET_SELECTED_FILTER';
export const SET_SHOW_FILTER = 'clients/SET_SHOW_FILTER';
export const SET_SUGGESTIONS_LIST = 'clients/SET_SUGGESTIONS_LIST';
export const SET_FILTERED_SUGGESTIONS_LIST = 'clients/SET_FILTERED_SUGGESTIONS_LIST';

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

function setFilteredSuggestions(filteredSuggestions) {
  return {
    type: SET_FILTERED_SUGGESTIONS_LIST,
    data: { filteredSuggestions },
  };
}

function setSuggestionsList(suggestionsList) {
  return {
    type: SET_SUGGESTIONS_LIST,
    data: { suggestionsList },
  };
}

const clientsActions = {
  setClients,
  setSearchText,
  setFilteredClients,
  setSelectedFilter,
  setShowFilter,
  setSuggestionsList,
  setFilteredSuggestions,
};

export default clientsActions;
