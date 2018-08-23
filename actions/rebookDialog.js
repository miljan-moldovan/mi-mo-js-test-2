import { AppointmentBook } from '../utilities/apiWrapper';
import apiConstants from '../utilities/apiWrapper/apiConstants';
import { storeForm, purgeForm } from './formCache';

export const POST_REBOOK = 'rebook/POST_REBOOK';
export const POST_REBOOK_SUCCESS = 'rebook/POST_REBOOK_SUCCESS';
export const POST_REBOOK_FAILED = 'rebook/POST_REBOOK_FAILED';
export const SET_REBOOK_FORM = 'rebook/SET_REBOOK_FORM';

const setRebookForm = (appointmentId, rebook) => dispatch => dispatch(storeForm('RebookScreen', appointmentId.toString(), rebook));
const purgeRebookForm = (appointmentId, rebook) => dispatch => dispatch(purgeForm('RebookScreen', appointmentId.toString(), rebook));

const postRebookSuccess = rebooks => ({
  type: POST_REBOOK_SUCCESS,
  data: { rebooks },
});

const postRebookFailed = error => ({
  type: POST_REBOOK_FAILED,
  data: { error },
});

const postRebook = (data, callback) => (dispatch) => {
  dispatch({ type: POST_REBOOK });
  return AppointmentBook.postAppointmentBookRebookMulti(data)
    .then((response) => {
      callback(true);
      return dispatch(postRebookSuccess(response));
    })
    .catch((error) => {
      callback(false);
      return dispatch(postRebookFailed(error));
    });
};


const rebookActions = {
  postRebook,
  setRebookForm,
  purgeRebookForm,
};

export default rebookActions;
