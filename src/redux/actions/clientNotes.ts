import {Note} from '../../utilities/apiWrapper';
import apiConstants from '../../utilities/apiWrapper/apiConstants';
import {storeForm, purgeForm} from './formCache';

export const SET_NOTES = 'clientNotes/SET_NOTES';
export const SET_FILTERED_NOTES = 'clientNotes/SET_FILTERED_NOTES';
export const SELECTED_PROVIDER = 'clientNotes/SELECTED_PROVIDER';
export const SET_ON_EDITION_NOTE = 'clientNotes/SET_ON_EDITION_NOTE';

export const GET_CLIENT_NOTES = 'clientNotes/GET_CLIENT_NOTES';
export const GET_CLIENT_NOTES_SUCCESS = 'clientNotes/GET_CLIENT_NOTES_SUCCESS';
export const GET_CLIENT_NOTES_FAILED = 'clientNotes/GET_CLIENT_NOTES_FAILED';

export const POST_CLIENT_NOTE = 'clientNotes/POST_CLIENT_NOTE';
export const POST_CLIENT_NOTE_SUCCESS = 'clientNotes/POST_CLIENT_NOTE_SUCCESS';
export const POST_CLIENT_NOTE_FAILED = 'clientNotes/POST_CLIENT_NOTE_FAILED';

export const PUT_CLIENT_NOTE = 'clientNotes/PUT_CLIENT_NOTE';
export const PUT_CLIENT_NOTE_SUCCESS = 'clientNotes/PUT_CLIENT_NOTE_SUCCESS';
export const PUT_CLIENT_NOTE_FAILED = 'clientNotes/PUT_CLIENT_NOTE_FAILED';

export const DELETE_CLIENT_NOTE = 'clientNotes/DELETE_CLIENT_NOTE';
export const DELETE_CLIENT_NOTE_SUCCESS =
  'clientNotes/DELETE_CLIENT_NOTE_SUCCESS';
export const DELETE_CLIENT_NOTE_FAILED =
  'clientNotes/DELETE_CLIENT_NOTE_FAILED';

export const UNDELETE_CLIENT_NOTE = 'clientNotes/UNDELETE_CLIENT_NOTE';
export const UNDELETE_CLIENT_NOTE_SUCCESS =
  'clientNotes/UNDELETE_CLIENT_NOTE_SUCCESS';
export const UNDELETE_CLIENT_NOTE_FAILED =
  'clientNotes/UNDELETE_CLIENT_NOTE_FAILED';

export const SET_CLIENT_NOTE_FORM = 'clientNotes/SET_CLIENT_NOTE_FORM';

const putClientNotesSuccess = (notes: any) => ({
  type: PUT_CLIENT_NOTE_SUCCESS,
  data: {notes},
});

const putClientNotesFailed = (error: any) => ({
  type: PUT_CLIENT_NOTE_FAILED,
  data: {error},
});

const putClientNotes = (clientId: number, note: any) => dispatch => {
  dispatch ({type: PUT_CLIENT_NOTE});
  return Note.putClientNote ({clientId, id: note.id}, note)
    .then (response => {
      dispatch (purgeForm ('ClientNoteScreenUpdate', note.id.toString ()));
      return dispatch (putClientNotesSuccess (response));
    })
    .catch (error => {
      if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
        dispatch (
          storeForm ('ClientNoteScreenUpdate', note.id.toString (), note)
        );
      }
      return dispatch (putClientNotesFailed (error));
    });
};

const setClientNoteUpdateForm = (note: any) => dispatch =>
  dispatch (storeForm ('ClientNoteScreenUpdate', note.id.toString (), note));

const setClientNoteNewForm = (clientId: number, note: any) => dispatch =>
  dispatch (storeForm ('ClientNoteScreenNew', clientId.toString (), note));

const purgeClientNoteUpdateForm = (note: any) => dispatch =>
  dispatch (purgeForm ('ClientNoteScreenUpdate', note.id.toString ()/*, note*/));

const purgeClientNoteNewForm = (clientId: number, note: any) => dispatch =>
  dispatch (purgeForm ('ClientNoteScreenNew', clientId.toString ()/*, note*/));

const undeleteClientNotesSuccess = (notes: any) => ({
  type: UNDELETE_CLIENT_NOTE_SUCCESS,
  data: {notes},
});

const undeleteClientNotesFailed = (error: any) => ({
  type: UNDELETE_CLIENT_NOTE_FAILED,
  data: {error},
});

const undeleteClientNotes = (clientId: number, id: number) => dispatch => {
  dispatch ({type: UNDELETE_CLIENT_NOTE});
  return Note.postUndeleteClientNote ({clientId, id})
    .then (response => dispatch (undeleteClientNotesSuccess (response)))
    .catch (error => dispatch (undeleteClientNotesFailed (error)));
};

const deleteClientNotesSuccess = (notes: any) => ({
  type: DELETE_CLIENT_NOTE_SUCCESS,
  data: {notes},
});

const deleteClientNotesFailed = (error: any) => ({
  type: DELETE_CLIENT_NOTE_FAILED,
  data: {error},
});

const deleteClientNotes = (clientId: number, noteId: number) => dispatch => {
  dispatch ({type: DELETE_CLIENT_NOTE});
  return Note.deleteClientNote ({clientId, noteId})
    .then (response => dispatch (deleteClientNotesSuccess (response)))
    .catch (error => dispatch (deleteClientNotesFailed (error)));
};

const postClientNotesSuccess = (notes: any) => ({
  type: POST_CLIENT_NOTE_SUCCESS,
  data: {notes},
});

const postClientNotesFailed = (error: any) => ({
  type: POST_CLIENT_NOTE_FAILED,
  data: {error},
});

const postClientNotes = (clientId:number, note: any) => dispatch => {
  dispatch ({type: POST_CLIENT_NOTE});
  return Note.postClientNote (clientId, note)
    .then (response => {
      dispatch (purgeForm ('ClientNoteScreenNew', clientId.toString ()));
      return dispatch (postClientNotesSuccess (response));
    })
    .catch (error => {
      if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
        dispatch (
          storeForm ('ClientNoteScreenNew', clientId.toString (), note)
        );
      }
      return dispatch (postClientNotesFailed (error));
    });
};

function getClientNotesSuccess (notes: any) {
  return {
    type: GET_CLIENT_NOTES_SUCCESS,
    data: {notes},
  };
}

const getClientNotesFailed = (error: any) => ({
  type: GET_CLIENT_NOTES_FAILED,
  data: {error},
});

const getClientNotes = (clientId:number) => dispatch => {
  dispatch ({type: GET_CLIENT_NOTES});
  return Note.getClientNotes (clientId)
    .then (response => dispatch (getClientNotesSuccess (response)))
    .catch (error => dispatch (getClientNotesFailed (error)));
};

function setNotes (notes: any) {
  return {
    type: SET_NOTES,
    data: {notes},
  };
}

function setFilteredNotes (filtered: any) {
  return {
    type: SET_FILTERED_NOTES,
    data: {filtered},
  };
}

function selectProvider (provider: any) {
  return {
    type: SELECTED_PROVIDER,
    data: {provider},
  };
}

function setOnEditionNote (onEditionNote: any) {
  return {
    type: SET_ON_EDITION_NOTE,
    data: {onEditionNote},
  };
}

const clientNotesActions = {
  setNotes,
  setFilteredNotes,
  selectProvider,
  setOnEditionNote,
  getClientNotes,
  postClientNotes,
  deleteClientNotes,
  undeleteClientNotes,
  putClientNotes,
  setClientNoteUpdateForm,
  setClientNoteNewForm,
  purgeClientNoteNewForm,
  purgeClientNoteUpdateForm,
};

export default clientNotesActions;
