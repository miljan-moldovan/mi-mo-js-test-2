import apiWrapper from '../utilities/apiWrapper';

export const PUT_CHECK_IN = 'checkIn/PUT_CHECK_IN';
export const PUT_CHECK_IN_SUCCESS = 'checkIn/PUT_CHECK_IN_SUCCESS';
export const PUT_CHECK_IN_FAILED = 'checkIn/PUT_CHECK_IN_FAILED';

const putCheckinSuccess = chekinResponse => ({
  type: PUT_CHECK_IN_SUCCESS,
  data: { chekinResponse },
});

const putCheckinFailed = error => ({
  type: PUT_CHECK_IN_FAILED,
  data: { error },
});

const putCheckin = clientQueueItemId => (dispatch) => {
  dispatch({ type: PUT_CHECK_IN });
  return apiWrapper.doRequest('putCheckIn', {
    path: {
      clientQueueItemId,
    },
  })
    .then(response => dispatch(putCheckinSuccess(response)))
    .catch(error => dispatch(putCheckinFailed(error)));
};

const checkinActions = {
  putCheckin,
};

export default checkinActions;
