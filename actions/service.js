import apiWrapper from '../utilities/apiWrapper';

export const PUT_START_SERVICE = 'service/PUT_START_SERVICE';
export const PUT_START_SERVICE_SUCCESS = 'service/PUT_START_SERVICE_SUCCESS';
export const PUT_START_SERVICE_FAILED = 'service/PUT_START_SERVICE_FAILED';

const putStartServiceSuccess = chekinResponse => ({
  type: PUT_START_SERVICE_SUCCESS,
  data: { chekinResponse },
});

const putStartServiceFailed = error => ({
  type: PUT_START_SERVICE_FAILED,
  data: { error },
});

const putStartService = clientQueueItemId => (dispatch) => {
  dispatch({ type: PUT_START_SERVICE });
  return apiWrapper.doRequest('putStartService', {
    path: {
      clientQueueItemId,
    },
  })
    .then(response => dispatch(putStartServiceSuccess(response)))
    .catch(error => dispatch(putStartServiceFailed(error)));
};

const serviceActions = {
  putStartService,
};

export default serviceActions;
