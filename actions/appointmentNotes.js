import apiWrapper from '../utilities/apiWrapper';

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


const postAppointmentNotesSuccess = notes => ({
  type: POST_APPOINTMENT_NOTE_SUCCESS,
  data: { notes },
});

const postAppointmentNotesFailed = error => ({
  type: POST_APPOINTMENT_NOTE_FAILED,
  data: { error },
});

const postAppointmentNotes = note => dispatch => apiWrapper.doRequest('postClientNote', {
  path: {
    clientId: 93,
  },
  body: note,
})
  .then(response => postAppointmentNotesSuccess(response.response))
  .catch(error => postAppointmentNotesFailed(error));


const getAppointmentNotesSuccess = notes => ({
  type: GET_APPOINTMENT_NOTES_SUCCESS,
  data: { notes },
});

const getAppointmentNotesFailed = error => ({
  type: GET_APPOINTMENT_NOTES_FAILED,
  data: { error },
});

const getAppointmentNotes = () => dispatch => apiWrapper.doRequest(
  'getClientNotes',
  {
    path: { clientId: 93 },
    query: { filterRule: 'none' },
  },
)
  .then(response => getAppointmentNotesSuccess(response))
  .catch(error => getAppointmentNotesFailed(error));

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
};

export default appointmentNotesActions;
