import apiWrapper from '../utilities/apiWrapper';

export const SET_CLIENTS = 'clients/SET_CLIENTS';
export const SET_FILTERED_CLIENTS = 'clients/SET_FILTERED_CLIENTS';
export const SET_SUGGESTIONS_LIST = 'clients/SET_SUGGESTIONS_LIST';
export const SET_FILTERED_SUGGESTIONS_LIST = 'clients/SET_FILTERED_SUGGESTIONS_LIST';

export const GET_CLIENTS = 'clients/GET_CLIENTS';
export const GET_CLIENTS_SUCCESS = 'clients/GET_CLIENTS_SUCCESS';
export const GET_CLIENTS_FAILED = 'clients/GET_CLIENTS_FAILED';

const getClientsSuccess = clients => ({
  type: GET_CLIENTS_SUCCESS,
  data: { clients },
});

const getClientsFailed = error => ({
  type: GET_CLIENTS_FAILED,
  data: { error },
});

const getClients = () => (dispatch) => {
  dispatch({ type: GET_CLIENTS });
  return apiWrapper.doRequest('getClients', {})
    .then(response => dispatch(getClientsSuccess(response)))
    .catch(error => dispatch(getClientsFailed(error)));
};

function setClients(clients) {
  return {
    type: SET_CLIENTS,
    data: { clients },
  };
}

function setFilteredClients(filtered) {
  return {
    type: SET_FILTERED_CLIENTS,
    data: { filtered },
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
  setFilteredClients,
  setSuggestionsList,
  setFilteredSuggestions,
  getClients,
};

export default clientsActions;
