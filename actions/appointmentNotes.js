export const ADD_NOTE = 'appointmentNotes/ADD_NOTE';
export const CONCAT_NOTE = 'appointmentNotes/CONCAT_NOTE';
export const SET_FILTERED_NOTES = 'appointmentNotes/SET_FILTERED_NOTES';


function addNote(note) {
  return {
    type: ADD_NOTE,
    data: { note },
  };
}

function concatNote(note) {
  return {
    type: CONCAT_NOTE,
    data: { note },
  };
}

function setFilteredNotes(filtered) {
  return {
    type: SET_FILTERED_NOTES,
    data: { filtered },
  };
}

const appointmentNotesActions = {
  addNote,
  concatNote,
  setFilteredNotes,
};

export default appointmentNotesActions;
