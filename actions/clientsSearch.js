export const SET_CLIENTS = 'clientsSearch/SET_CLIENTS';
export const SET_PREPARED_CLIENTS = 'clientsSearch/SET_PREPARED_CLIENTS';
export const SET_SEARCH_TEXT = 'clientsSearch/SET_SEARCH_TEXT';
export const SET_SHOW_WALKIN = 'clientsSearch/SET_SHOW_WALKIN';
export const SET_FILTERED_CLIENTS = 'clientsSearch/SET_FILTERED_CLIENTS';


function setPreparedClients(prepared) {
  return {
    type: SET_PREPARED_CLIENTS,
    data: { prepared },
  };
}


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

function setShowWalkIn(showWalkIn) {
  return {
    type: SET_SHOW_WALKIN,
    data: { showWalkIn },
  };
}

function setFilteredClients(filtered) {
  return {
    type: SET_FILTERED_CLIENTS,
    data: { filtered },
  };
}

const clientsSearchActions = {
  setClients,
  setSearchText,
  setShowWalkIn,
  setFilteredClients,
  setPreparedClients,
};

export default clientsSearchActions;
