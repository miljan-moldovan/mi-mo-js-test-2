import apiWrapper from '../utilities/apiWrapper';

export const GET_REMOVAL_REASON_TYPES = 'walkOut/GET_REMOVAL_REASON_TYPES';
export const GET_REMOVAL_REASON_TYPES_SUCCESS = 'walkOut/GET_REMOVAL_REASON_TYPES_SUCCESS';
export const GET_REMOVAL_REASON_TYPES_FAILED = 'walkOut/GET_REMOVAL_REASON_TYPES_FAILED';

const getRemovalReasonTypesSuccess = reasonTypes => ({
  type: GET_REMOVAL_REASON_TYPES_SUCCESS,
  data: { reasonTypes },
});

const getRemovalReasonTypesFailed = error => ({
  type: GET_REMOVAL_REASON_TYPES_FAILED,
  data: { error },
});

const getRemovalReasonTypes = () => dispatch => apiWrapper.doRequest('getReasonTypes', {})
  .then(response => dispatch(getRemovalReasonTypesSuccess(response.response)))
  .catch(error => dispatch(getRemovalReasonTypesFailed(error)));

const walkoutActions = {
  getRemovalReasonTypes,
};

export default walkoutActions;
