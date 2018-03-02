import apiWrapper from '../utilities/apiWrapper';

export const GET_REMOVAL_REASON_TYPES = 'walkOut/GET_REMOVAL_REASON_TYPES';
export const GET_REMOVAL_REASON_TYPES_SUCCESS = 'walkOut/GET_REMOVAL_REASON_TYPES_SUCCESS';
export const GET_REMOVAL_REASON_TYPES_FAILED = 'walkOut/GET_REMOVAL_REASON_TYPES_FAILED';
export const PUT_WALKOUT = 'walkOut/PUT_WALKOUT';
export const PUT_WALKOUT_SUCCESS = 'walkOut/PUT_WALKOUT_SUCCESS';
export const PUT_WALKOUT_FAILED = 'walkOut/PUT_WALKOUT_FAILED';

const getRemovalReasonTypesSuccess = reasonTypes => ({
  type: GET_REMOVAL_REASON_TYPES_SUCCESS,
  data: { reasonTypes },
});

const getRemovalReasonTypesFailed = error => ({
  type: GET_REMOVAL_REASON_TYPES_FAILED,
  data: { error },
});

const putWalkoutSuccess = walkoutResponse => ({
  type: PUT_WALKOUT_SUCCESS,
  data: { walkoutResponse },
});

const putWalkoutFailed = error => ({
  type: PUT_WALKOUT_FAILED,
  data: { error },
});

const putWalkout = (clientQueueItemId, params) => dispatch => apiWrapper.doRequest('putWalkOut', {
  path: {
    clientQueueItemId,
  },
  body: {
    ...params,
  },
})
  .then((response) => { console.log('WALKOUT TEST', response); return dispatch(putWalkoutSuccess(response)); })
  .catch(error => dispatch(putWalkoutFailed(error)));

const getRemovalReasonTypes = () => dispatch => apiWrapper.doRequest('getReasonTypes', {})
  .then(response => dispatch(getRemovalReasonTypesSuccess(response)))
  .catch(error => dispatch(getRemovalReasonTypesFailed(error)));

const walkoutActions = {
  getRemovalReasonTypes,
  putWalkout,
};

export default walkoutActions;
