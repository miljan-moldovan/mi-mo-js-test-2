import { Client } from '../utilities/apiWrapper';

export const SET_CLIENTS = 'clients/SET_CLIENTS';
export const SET_FILTERED_CLIENTS = 'clients/SET_FILTERED_CLIENTS';
export const SET_SUGGESTIONS_LIST = 'clients/SET_SUGGESTIONS_LIST';
export const SET_FILTERED_SUGGESTIONS_LIST = 'clients/SET_FILTERED_SUGGESTIONS_LIST';

export const GET_CLIENTS = 'clients/GET_CLIENTS';
export const GET_CLIENTS_SUCCESS = 'clients/GET_CLIENTS_SUCCESS';
export const GET_CLIENTS_FAILED = 'clients/GET_CLIENTS_FAILED';

export const GET_MERGEABLE_CLIENTS = 'clients/GET_MERGEABLE_CLIENTS';
export const GET_MERGEABLE_CLIENTS_SUCCESS = 'clients/GET_MERGEABLE_CLIENTS_SUCCESS';
export const GET_MERGEABLE_CLIENTS_FAILED = 'clients/GET_MERGEABLE_CLIENTS_FAILED';
export const MERGE_CLIENTS = 'clients/MERGE_CLIENTS';
export const MERGE_CLIENTS_SUCCESS = 'clients/MERGE_CLIENTS_SUCCESS';
export const MERGE_CLIENTS_FAILED = 'clients/MERGE_CLIENTS_FAILED';
export const GET_MORE_APPOINTMETNS_SUCCESS = 'clients/GET_MORE_APPOINTMETNS_SUCCESS';
export const GET_MORE_CLIENTS = 'clients/GET_MORE_CLIENTS';

const getClientsSuccess = ({ response, total }) => ({
  type: GET_CLIENTS_SUCCESS,
  data: { clients: response, total },
});

const getMoreCliensSuccess = ({ response, total }) => ({
  type: GET_MORE_APPOINTMETNS_SUCCESS,
  data: { clients: response, total },
});

const getClientsFailed = error => ({
  type: GET_CLIENTS_FAILED,
  data: { error },
});

const getClients = (params = {
  fromAllStores: false,
  'nameFilter.FilterRule': 3,
  'NameFilter.SortOrder': 1,
  'NameFilter.SortField': 'FirstName,LastName',
}) => (dispatch) => {
  dispatch({ type: GET_MORE_CLIENTS });
  const newParams = {
    ...params,
    'NameFilter.SortOrder': 1,
    'NameFilter.SortField': 'FirstName,LastName',
  };
  return Client.getClients(newParams)
    .then(response => dispatch(getClientsSuccess(response)))
    .catch(error => dispatch(getClientsFailed(error)));
};

const getMoreClients = (params = {
  fromAllStores: false,
  'nameFilter.FilterRule': 3,
  'NameFilter.SortOrder': 1,
  'NameFilter.SortField': 'FirstName,LastName',
}) => (dispatch) => {
  dispatch({ type: GET_CLIENTS });
  const newParams = {
    ...params,
    'NameFilter.SortOrder': 1,
    'NameFilter.SortField': 'FirstName,LastName',
  };
  return Client.getClients(newParams)
    .then(response => dispatch(getMoreCliensSuccess(response)))
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

const getEmployeeScheduleExceptionSuccess = response => ({
  type: GET_MERGEABLE_CLIENTS_SUCCESS,
  data: { response },
});

const getEmployeeScheduleExceptionFailed = error => ({
  type: GET_MERGEABLE_CLIENTS_FAILED,
  data: { error },
});

const getMergeableClients = (clientId, callback) => (dispatch) => {
  dispatch({ type: GET_MERGEABLE_CLIENTS });

  return Client.getMergeableClients(clientId)
    .then((response) => {
      dispatch(getEmployeeScheduleExceptionSuccess(response));

      callback(true);
    })
    .catch((error) => {
      dispatch(getEmployeeScheduleExceptionFailed(error));

      callback(false);
    });
};


const mergeClientsSuccess = response => ({
  type: MERGE_CLIENTS_SUCCESS,
  data: { response },
});

const mergeClientsFailed = error => ({
  type: MERGE_CLIENTS_FAILED,
  data: { error },
});

const mergeClients = (mainClientId: string, mergeClientsId: Array<String>, callback) => (dispatch) => {
  dispatch({ type: MERGE_CLIENTS });

  return Client.postMergeClients(mainClientId, mergeClientsId)
    .then((response) => { dispatch(mergeClientsSuccess(response)); callback(true); })
    .catch((error) => { dispatch(mergeClientsFailed(error)); callback(false); });
};


const clientsActions = {
  mergeClients,
  setClients,
  setFilteredClients,
  setSuggestionsList,
  setFilteredSuggestions,
  getClients,
  getMergeableClients,
  getMoreClients,
};

export default clientsActions;
