export const ADD_NOTE = 'appointmentNotes/ADD_NOTE';
export const SET_NOTES = 'appointmentNotes/SET_NOTES';
export const SET_FILTERED_NOTES = 'appointmentNotes/SET_FILTERED_NOTES';
export const SELECTED_PROVIDER = 'appointmentNotes/SELECTED_PROVIDER';
export const SELECTED_FILTER_TYPES = 'appointmentNotes/SELECTED_FILTER_TYPES';
export const SET_ON_EDITION_NOTE = 'appointmentNotes/SET_ON_EDITION_NOTE';

function addNote(note) {
  return {
    type: ADD_NOTE,
    data: { note },
  };
}

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

function selectedFilterTypes(filterTypes) {
  return {
    type: SELECTED_FILTER_TYPES,
    data: { filterTypes },
  };
}

function setOnEditionNote(onEditionNote) {
  return {
    type: SET_ON_EDITION_NOTE,
    data: { onEditionNote },
  };
}

const appointmentNotesActions = {
  addNote,
  setNotes,
  setFilteredNotes,
  selectProvider,
  selectedFilterTypes,
  setOnEditionNote,
};

export default appointmentNotesActions;
