import { Client } from '../utilities/apiWrapper';

export const GET_CLIENT = 'clientInfo/GET_CLIENT';
export const GET_CLIENT_SUCCESS = 'clientInfo/GET_CLIENT_SUCCESS';
export const GET_CLIENT_FAILED = 'clientInfo/GET_CLIENT_FAILED';

export const PUT_CLIENT_NOTE = 'clientInfo/PUT_CLIENT_NOTE';
export const PUT_CLIENT_NOTE_SUCCESS = 'clientInfo/PUT_CLIENT_NOTE_SUCCESS';
export const PUT_CLIENT_NOTE_FAILED = 'clientInfo/PUT_CLIENT_NOTE_FAILED';

export const DELETE_CLIENT_NOTE = 'clientInfo/DELETE_CLIENT_NOTE';
export const DELETE_CLIENT_NOTE_SUCCESS = 'clientInfo/DELETE_CLIENT_NOTE_SUCCESS';
export const DELETE_CLIENT_NOTE_FAILED = 'clientInfo/DELETE_CLIENT_NOTE_FAILED';

const putClientInfoSuccess = client => ({
  type: PUT_CLIENT_NOTE_SUCCESS,
  data: { client },
});

const putClientInfoFailed = error => ({
  type: PUT_CLIENT_NOTE_FAILED,
  data: { error },
});

const putClientInfo = (clientId, client, callback) => (dispatch) => {
  dispatch({ type: PUT_CLIENT_NOTE });
  return Client.putClient(clientId, client)
    .then((response) => { dispatch(putClientInfoSuccess(response)); callback(true); })
    .catch((error) => { dispatch(putClientInfoFailed(error)); callback(false, error.message); });
};

const deleteClientInfoSuccess = client => ({
  type: DELETE_CLIENT_NOTE_SUCCESS,
  data: { client },
});

const deleteClientInfoFailed = error => ({
  type: DELETE_CLIENT_NOTE_FAILED,
  data: { error },
});

const deleteClientInfo = (clientId, callback) => (dispatch) => {
  dispatch({ type: DELETE_CLIENT_NOTE });
  return Client.deleteClient({ clientId })
    .then((response) => { dispatch(deleteClientInfoSuccess(response)); callback(true); })
    .catch((error) => { dispatch(deleteClientInfoFailed(error)); callback(false, error.message); });
};

function getClientInfoSuccess(client) {
  return {
    type: GET_CLIENT_SUCCESS,
    data: { client },
  };
}

const getClientInfoFailed = error => ({
  type: GET_CLIENT_FAILED,
  data: { error },
});

const getClientInfo = (clientId, callback) => (dispatch) => {
  dispatch({ type: GET_CLIENT });
  return Client.getClient(clientId)
    .then((response) => { dispatch(getClientInfoSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getClientInfoFailed(error)); callback(false, error.message); });
};

const clientInfoActions = {
  getClientInfo,
  deleteClientInfo,
  putClientInfo,
};

export default clientInfoActions;
