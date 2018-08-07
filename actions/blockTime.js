import { AppointmentBook } from '../utilities/apiWrapper';

export const POST_BLOCKTIME = 'appointmentBook/POST_BLOCKTIME';
export const POST_BLOCKTIME_SUCCESS = 'appointmentBook/POST_BLOCKTIME_SUCCESS';
export const POST_BLOCKTIME_FAILED = 'appointmentBook/POST_BLOCKTIME_FAILED';

const postBlockTimeSuccess = blockTime => ({
  type: POST_BLOCKTIME_SUCCESS,
  data: { blockTime },
});

const postBlockTimeFailed = error => ({
  type: POST_BLOCKTIME_FAILED,
  data: { error },
});

const postBlockTime = (data, callback) => (dispatch) => {
  dispatch({ type: POST_BLOCKTIME });

  return AppointmentBook.postAppointmentBookBlockTime(data)
    .then((resp) => { dispatch(postBlockTimeSuccess(resp)); callback(true); })
    .catch((error) => { dispatch(postBlockTimeFailed(error)); callback(false, error); });
};

const blockTimeActions = {
  postBlockTime,
};

export default blockTimeActions;
