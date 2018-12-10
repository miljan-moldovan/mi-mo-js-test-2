import { AppointmentBook } from '../../utilities/apiWrapper';
import { storeForm, purgeForm } from './formCache';
import { Maybe } from '@/models';

export const POST_REBOOK = 'rebook/POST_REBOOK';
export const POST_REBOOK_SUCCESS = 'rebook/POST_REBOOK_SUCCESS';
export const POST_REBOOK_FAILED = 'rebook/POST_REBOOK_FAILED';
export const SET_REBOOK_FORM = 'rebook/SET_REBOOK_FORM';
export const SET_REBOOK_DATA = 'rebook/SET_REBOOK_DATA';
export const SET_REBOOK_DATA_SUCCESS = 'rebook/SET_REBOOK_DATA_SUCCESS';
export const SET_REBOOK_DATA_FAILED = 'rebook/SET_REBOOK_DATA_FAILED';

const setRebookForm = (appointmentId: number, rebook: any): any => dispatch =>
  dispatch(storeForm('RebookScreen', appointmentId.toString(), rebook));
const purgeRebookForm = (appointmentId: number, rebook: any): any => dispatch =>
  dispatch(purgeForm('RebookScreen', appointmentId.toString()));

const postRebookSuccess = (rebooks: any): any => ({
  type: POST_REBOOK_SUCCESS,
  data: { rebooks },
});

const postRebookFailed = (error: any): any => ({
  type: POST_REBOOK_FAILED,
  data: { error },
});

const postRebook = (data: any, callback: Maybe<Function>): any => dispatch => {
  dispatch({ type: POST_REBOOK });
  return AppointmentBook.postAppointmentBookRebookMulti(data)
    .then(response => {
      callback(true);
      return dispatch(postRebookSuccess(response));
    })
    .catch(error => {
      callback(false);
      return dispatch(postRebookFailed(error));
    });
};

const setRebookData = (rebookData: any): any => dispatch => {
  dispatch({ type: SET_REBOOK_DATA, data: { rebookData } });
};

const rebookActions = {
  postRebook,
  setRebookForm,
  purgeRebookForm,
  setRebookData,
};

export interface RebookActions {
  postRebook: typeof postRebook;
  setRebookForm: typeof setRebookForm;
  purgeRebookForm: typeof purgeRebookForm;
  setRebookData: typeof setRebookData;
}

export default rebookActions;
