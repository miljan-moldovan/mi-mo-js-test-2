import apiWrapper from '../utilities/apiWrapper';

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
  return apiWrapper.doRequest('getClients', {
    query: {
      fromAllStores: false,
      'nameFilter.FilterRule': 'none',
    },
  })
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
export const getMergeableClients = (clientId: string) => async (dispatch: Object => void) => {
  try {
    dispatch({type: GET_MERGEABLE_CLIENTS});
    console.log('getMergeableClients', clientId);
    let mergeableClients = await apiWrapper.doRequest('getMergeableClients',  {
      path: { id: clientId }
    });
    console.log('getMergeableClients success', mergeableClients);
    dispatch({ type: GET_MERGEABLE_CLIENTS_SUCCESS, data: { mergeableClients } });
  } catch (error) {
    console.log('getMergeableClients error', JSON.stringify(error, null, 2));
    dispatch({type: GET_MERGEABLE_CLIENTS_FAILED, data: { error }});
  }
}

export const mergeClients = (mainClientId: string, mergeClientsId: Array<String>, callback) => async (dispatch: Object => void) => {
  try {
    console.log('mergeClients', mainClientId, mergeClientsId);
    dispatch({type: MERGE_CLIENTS});
    // let mergeableClients = await apiWrapper.doRequest('postMergeClients',  {
    //   path: { id: clientId },
    //   body: JSON.stringify(mergeClientsId)
    // });
    // console.log('mergeClients success', mergeableClients);
    // callback(true);
    // dispatch({ type: MERGE_CLIENTS_SUCCESS, data: { mergeableClients } });
  } catch (error) {
    console.log('mergeClients error', JSON.stringify(error, null, 2));
    callback(false);
    dispatch({type: MERGE_CLIENTS_FAILED, data: { error }});
  }
}

const clientsActions = {
  setClients,
  setFilteredClients,
  setSuggestionsList,
  setFilteredSuggestions,
  getClients,
};

export default clientsActions;
