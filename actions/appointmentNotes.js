import apiWrapper from '../utilities/apiWrapper';
import apiConstants from '../utilities/apiWrapper/apiConstants';
import { storeForm, purgeForm } from './formCache';

export const SET_NOTES = 'appointmentNotes/SET_NOTES';
export const SET_FILTERED_NOTES = 'appointmentNotes/SET_FILTERED_NOTES';
export const SELECTED_PROVIDER = 'appointmentNotes/SELECTED_PROVIDER';
export const SET_ON_EDITION_NOTE = 'appointmentNotes/SET_ON_EDITION_NOTE';

export const GET_APPOINTMENT_NOTES = 'appointmentNotes/GET_APPOINTMENT_NOTES';
export const GET_APPOINTMENT_NOTES_SUCCESS = 'appointmentNotes/GET_APPOINTMENT_NOTES_SUCCESS';
export const GET_APPOINTMENT_NOTES_FAILED = 'appointmentNotes/GET_APPOINTMENT_NOTES_FAILED';

export const POST_APPOINTMENT_NOTE = 'appointmentNotes/POST_APPOINTMENT_NOTE';
export const POST_APPOINTMENT_NOTE_SUCCESS = 'appointmentNotes/POST_APPOINTMENT_NOTE_SUCCESS';
export const POST_APPOINTMENT_NOTE_FAILED = 'appointmentNotes/POST_APPOINTMENT_NOTE_FAILED';

export const PUT_APPOINTMENT_NOTE = 'appointmentNotes/PUT_APPOINTMENT_NOTE';
export const PUT_APPOINTMENT_NOTE_SUCCESS = 'appointmentNotes/PUT_APPOINTMENT_NOTE_SUCCESS';
export const PUT_APPOINTMENT_NOTE_FAILED = 'appointmentNotes/PUT_APPOINTMENT_NOTE_FAILED';

export const DELETE_APPOINTMENT_NOTE = 'appointmentNotes/DELETE_APPOINTMENT_NOTE';
export const DELETE_APPOINTMENT_NOTE_SUCCESS = 'appointmentNotes/DELETE_APPOINTMENT_NOTE_SUCCESS';
export const DELETE_APPOINTMENT_NOTE_FAILED = 'appointmentNotes/DELETE_APPOINTMENT_NOTE_FAILED';

export const UNDELETE_APPOINTMENT_NOTE = 'appointmentNotes/UNDELETE_APPOINTMENT_NOTE';
export const UNDELETE_APPOINTMENT_NOTE_SUCCESS = 'appointmentNotes/UNDELETE_APPOINTMENT_NOTE_SUCCESS';
export const UNDELETE_APPOINTMENT_NOTE_FAILED = 'appointmentNotes/UNDELETE_APPOINTMENT_NOTE_FAILED';

export const SET_APPOINTMENT_NOTE_FORM = 'appointmentNotes/SET_APPOINTMENT_NOTE_FORM';


const putAppointmentNotesSuccess = notes => ({
  type: PUT_APPOINTMENT_NOTE_SUCCESS,
  data: { notes },
});

const putAppointmentNotesFailed = error => ({
  type: PUT_APPOINTMENT_NOTE_FAILED,
  data: { error },
});

const putAppointmentNotes = (clientId, note) => (dispatch) => {
  dispatch({ type: PUT_APPOINTMENT_NOTE });
  return apiWrapper.doRequest('putClientNote', {
    path: {
      clientId,
      id: note.id,
    },
    body: note,
  })
    .then((response) => {
      dispatch(purgeForm('AppointmentNoteScreenUpdate', note.id.toString()));
      return dispatch(putAppointmentNotesSuccess(response));
    })
    .catch((error) => {
      if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
        dispatch(storeForm('AppointmentNoteScreenUpdate', note.id.toString(), note));
      }
      return dispatch(putAppointmentNotesFailed(error));
    });
};


const setAppointmentNoteUpdateForm = note => dispatch => dispatch(storeForm('AppointmentNoteScreenUpdate', note.id.toString(), note));
const setAppointmentNoteNewForm = (clientId, note) => dispatch => dispatch(storeForm('AppointmentNoteScreenNew', clientId.toString(), note));

const purgeAppointmentNoteUpdateForm = note => dispatch => dispatch(purgeForm('AppointmentNoteScreenUpdate', note.id.toString(), note));
const purgeAppointmentNoteNewForm = (clientId, note) => dispatch => dispatch(purgeForm('AppointmentNoteScreenNew', clientId.toString(), note));


const undeleteAppointmentNotesSuccess = notes => ({
  type: UNDELETE_APPOINTMENT_NOTE_SUCCESS,
  data: { notes },
});

const undeleteAppointmentNotesFailed = error => ({
  type: UNDELETE_APPOINTMENT_NOTE_FAILED,
  data: { error },
});

const undeleteAppointmentNotes = (clientId, id) => (dispatch) => {
  dispatch({ type: UNDELETE_APPOINTMENT_NOTE });
  return apiWrapper.doRequest(
    'postUndeleteClientNote',
    {
      path: { clientId, id },
    },
  )
    .then(response => dispatch(undeleteAppointmentNotesSuccess(response)))
    .catch(error => dispatch(undeleteAppointmentNotesFailed(error)));
};

const deleteAppointmentNotesSuccess = notes => ({
  type: DELETE_APPOINTMENT_NOTE_SUCCESS,
  data: { notes },
});

const deleteAppointmentNotesFailed = error => ({
  type: DELETE_APPOINTMENT_NOTE_FAILED,
  data: { error },
});

const deleteAppointmentNotes = (clientId, id) => (dispatch) => {
  dispatch({ type: DELETE_APPOINTMENT_NOTE });
  return apiWrapper.doRequest(
    'deleteClientNote',
    {
      path: { clientId, id },
    },
  )
    .then(response => dispatch(deleteAppointmentNotesSuccess(response)))
    .catch(error => dispatch(deleteAppointmentNotesFailed(error)));
};

const postAppointmentNotesSuccess = notes => ({
  type: POST_APPOINTMENT_NOTE_SUCCESS,
  data: { notes },
});

const postAppointmentNotesFailed = error => ({
  type: POST_APPOINTMENT_NOTE_FAILED,
  data: { error },
});

const postAppointmentNotes = (clientId, note) => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_NOTE });
  return apiWrapper.doRequest('postClientNote', {
    path: {
      clientId,
    },
    body: note,
  })
    .then((response) => {
      dispatch(purgeForm('AppointmentNoteScreenNew', clientId.toString()));
      return dispatch(postAppointmentNotesSuccess(response));
    })
    .catch((error) => {
      if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
        dispatch(storeForm('AppointmentNoteScreenNew', clientId.toString(), note));
      }
      return dispatch(postAppointmentNotesFailed(error));
    });
};


function getAppointmentNotesSuccess(notes) {
  return {
    type: GET_APPOINTMENT_NOTES_SUCCESS,
    data: { notes },
  };
}

const getAppointmentNotesFailed = error => ({
  type: GET_APPOINTMENT_NOTES_FAILED,
  data: { error },
});

const getAppointmentNotes = clientId => (dispatch) => {
  dispatch({ type: GET_APPOINTMENT_NOTES });
  return apiWrapper.doRequest(
    'getClientNotes',
    {
      path: { clientId },
      //query: { filterRule: 'none' },
    },
  )
    .then(response => dispatch(getAppointmentNotesSuccess(response)))
    .catch(error => dispatch(getAppointmentNotesFailed(error)));
};

function setNotes(notes) {
  return {
    type: SET_NOTES,
    data: { notes },
  };
}

function setFilteredNotes(filtered) {
  return {
    type: SET_FILTERED_NOTES,
    data: { filtered },
  };
}

function selectProvider(provider) {
  return {
    type: SELECTED_PROVIDER,
    data: { provider },
  };
}

function setOnEditionNote(onEditionNote) {
  return {
    type: SET_ON_EDITION_NOTE,
    data: { onEditionNote },
  };
}

const appointmentNotesActions = {
  setNotes,
  setFilteredNotes,
  selectProvider,
  setOnEditionNote,
  getAppointmentNotes,
  postAppointmentNotes,
  deleteAppointmentNotes,
  undeleteAppointmentNotes,
  putAppointmentNotes,
  setAppointmentNoteUpdateForm,
  setAppointmentNoteNewForm,
  purgeAppointmentNoteNewForm,
  purgeAppointmentNoteUpdateForm,
};

export default appointmentNotesActions;
