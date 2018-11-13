import {Client, Store} from '../../utilities/apiWrapper';
import {showErrorAlert} from './utils';

export const GET_CLIENT = 'clientInfo/GET_CLIENT';
export const GET_CLIENT_SUCCESS = 'clientInfo/GET_CLIENT_SUCCESS';
export const GET_CLIENT_FAILED = 'clientInfo/GET_CLIENT_FAILED';

export const GET_CLIENT_REFERRAL_TYPES = 'clientInfo/GET_CLIENT_REFERRAL_TYPES';
export const GET_CLIENT_REFERRAL_TYPES_SUCCESS =
  'clientInfo/GET_CLIENT_REFERRAL_TYPES_SUCCESS';
export const GET_CLIENT_REFERRAL_TYPES_FAILED =
  'clientInfo/GET_CLIENT_REFERRAL_TYPES_FAILED';

export const PUT_CLIENT = 'clientInfo/PUT_CLIENT';
export const PUT_CLIENT_SUCCESS = 'clientInfo/PUT_CLIENT_SUCCESS';
export const PUT_CLIENT_FAILED = 'clientInfo/PUT_CLIENT_FAILED';

export const POST_CLIENT = 'clientInfo/POST_CLIENT';
export const POST_CLIENT_SUCCESS = 'clientInfo/POST_CLIENT_SUCCESS';
export const POST_CLIENT_FAILED = 'clientInfo/POST_CLIENT_FAILED';

export const DELETE_CLIENT = 'clientInfo/DELETE_CLIENT';
export const DELETE_CLIENT_SUCCESS = 'clientInfo/DELETE_CLIENT_SUCCESS';
export const DELETE_CLIENT_FAILED = 'clientInfo/DELETE_CLIENT_FAILED';

export const GET_ZIP_CODE = 'clientInfo/GET_ZIP_CODE';
export const GET_ZIP_CODE_SUCCESS = 'clientInfo/GET_ZIP_CODE_SUCCESS';
export const GET_ZIP_CODE_FAILED = 'clientInfo/GET_ZIP_CODE_FAILED';

const postClientInfoSuccess = client => ({
  type: POST_CLIENT_SUCCESS,
  data: {client},
});

const postClientInfoFailed = error => ({
  type: POST_CLIENT_FAILED,
  data: {error},
});

const postClientInfo = (client, callback) => dispatch => {
  dispatch ({type: POST_CLIENT});
  return Client.postClient (client)
    .then (response => {
      dispatch (postClientInfoSuccess (response));
      const clientResult = {...client, ...response};
      callback (true, clientResult);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (postClientInfoFailed (error));
      callback (false, null, error.message);
    });
};

const putClientInfoSuccess = client => ({
  type: PUT_CLIENT_SUCCESS,
  data: {client},
});

const putClientInfoFailed = error => ({
  type: PUT_CLIENT_FAILED,
  data: {error},
});

const putClientInfo = (clientId, client, callback) => dispatch => {
  dispatch ({type: PUT_CLIENT});
  return Client.putClient (clientId, client)
    .then (response => {
      dispatch (putClientInfoSuccess (response));
      const clientResult = {...client, ...response};
      callback (true, clientResult);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (putClientInfoFailed (error));
      callback (false, null, error.message);
    });
};

const deleteClientInfoSuccess = client => ({
  type: DELETE_CLIENT_SUCCESS,
  data: {client},
});

const deleteClientInfoFailed = error => ({
  type: DELETE_CLIENT_FAILED,
  data: {error},
});

const deleteClientInfo = (clientId, callback) => dispatch => {
  dispatch ({type: DELETE_CLIENT});
  return Client.deleteClient ({clientId})
    .then (response => {
      dispatch (deleteClientInfoSuccess (response));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (deleteClientInfoFailed (error));
      callback (false, error.message);
    });
};

function getClientInfoSuccess (client) {
  return {
    type: GET_CLIENT_SUCCESS,
    data: {client},
  };
}

const getClientInfoFailed = error => ({
  type: GET_CLIENT_FAILED,
  data: {error},
});

const getClientInfo = (clientId, callback) => dispatch => {
  dispatch ({type: GET_CLIENT});
  return Client.getClient (clientId)
    .then (response => {
      dispatch (getClientInfoSuccess (response));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (getClientInfoFailed (error));
      callback (false, error.message);
    });
};

function getClientReferralTypesSuccess (clientReferralTypes) {
  return {
    type: GET_CLIENT_REFERRAL_TYPES_SUCCESS,
    data: {clientReferralTypes},
  };
}

const getClientReferralTypesFailed = error => ({
  type: GET_CLIENT_REFERRAL_TYPES_FAILED,
  data: {error},
});

const getClientReferralTypes = callback => dispatch => {
  dispatch ({type: GET_CLIENT_REFERRAL_TYPES});
  return Store.getClientReferralTypes ()
    .then (response => {
      dispatch (getClientReferralTypesSuccess (response));
      callback (true);
    })
    .catch (error => {
      showErrorAlert (error);
      dispatch (getClientReferralTypesFailed (error));
      callback (false, error.message);
    });
};

function getZipCodeSuccess (zipCode) {
  return {
    type: GET_ZIP_CODE_SUCCESS,
    data: {zipCode},
  };
}

const getZipCodeFailed = error => ({
  type: GET_ZIP_CODE_FAILED,
  data: {error},
});

const getZipCode = (zipCode, callback) => dispatch => {
  dispatch ({type: GET_ZIP_CODE});
  return Client.getZipCode (zipCode)
    .then (response => {
      dispatch (getZipCodeSuccess (response));
      callback (true);
    })
    .catch (error => {
      dispatch (getZipCodeFailed (error));
      callback (false, error.message);
    });
};

const clientInfoActions = {
  getClientInfo,
  deleteClientInfo,
  putClientInfo,
  postClientInfo,
  getClientReferralTypes,
  getZipCode,
};

export default clientInfoActions;
