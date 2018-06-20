import apiWrapper from '../utilities/apiWrapper';

export const SET_CLIENTS = 'clients/SET_CLIENTS';
export const SET_FILTERED_CLIENTS = 'clients/SET_FILTERED_CLIENTS';
export const SET_SUGGESTIONS_LIST = 'clients/SET_SUGGESTIONS_LIST';
export const SET_FILTERED_SUGGESTIONS_LIST = 'clients/SET_FILTERED_SUGGESTIONS_LIST';

export const GET_CLIENTS = 'clients/GET_CLIENTS';
export const GET_CLIENTS_SUCCESS = 'clients/GET_CLIENTS_SUCCESS';
export const GET_CLIENTS_FAILED = 'clients/GET_CLIENTS_FAILED';

export const GET_FORMULAS_AND_NOTES = 'clients/GET_FORMULAS_AND_NOTES';
export const GET_FORMULAS_AND_NOTES_SUCCESS = 'clients/GET_FORMULAS_AND_NOTES_SUCCESS';
export const GET_FORMULAS_AND_NOTES_FAILED = 'clients/GET_FORMULAS_AND_NOTES_FAILED';

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

const getClients = (params = {
  fromAllStores: false,
  'nameFilter.FilterRule': 'none',
}) => (dispatch) => {
  dispatch({ type: GET_CLIENTS });
  return apiWrapper.doRequest('getClients', {
    query: params,
  })
    .then(response => dispatch(getClientsSuccess(response)))
    .catch(error => dispatch(getClientsFailed(error)));
};

const getFormulasAndNotesSuccess = ({ formulas, notes }) => ({
  type: GET_FORMULAS_AND_NOTES_SUCCESS,
  data: { formulas, notes },
});

const getFormulasAndNotesFailed = error => ({
  type: GET_FORMULAS_AND_NOTES_FAILED,
  data: { error },
});

const getFormulasAndNotes = clientId => (dispatch) => {
  dispatch({ type: GET_FORMULAS_AND_NOTES });
  return apiWrapper.doRequest('getClients', {
    path: {
      id: clientId,
    },
  })
    .then(response => dispatch(getFormulasAndNotesSuccess(response)))
    .catch(error => dispatch(getFormulasAndNotesFailed(error)));
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
    dispatch({ type: GET_MERGEABLE_CLIENTS });
    const mergeableClients = await apiWrapper.doRequest('getMergeableClients', {
      path: { id: clientId },
    });
    dispatch({ type: GET_MERGEABLE_CLIENTS_SUCCESS, data: { mergeableClients } });
  } catch (error) {
    dispatch({ type: GET_MERGEABLE_CLIENTS_FAILED, data: { error } });
  }
};

export const mergeClients = (mainClientId: string, mergeClientsId: Array<String>, callback) => async (dispatch: Object => void) => {
  try {
    dispatch({ type: MERGE_CLIENTS });
    // let mergeableClients = await apiWrapper.doRequest('postMergeClients',  {
    //   path: { id: clientId },
    //   body: JSON.stringify(mergeClientsId)
    // });
    //
    // callback(true);
    // dispatch({ type: MERGE_CLIENTS_SUCCESS, data: { mergeableClients } });
  } catch (error) {
    callback(false);
    dispatch({ type: MERGE_CLIENTS_FAILED, data: { error } });
  }
};

const clientsActions = {
  setClients,
  setFilteredClients,
  setSuggestionsList,
  setFilteredSuggestions,
  getClients,
  getFormulasAndNotes,
};

export default clientsActions;
