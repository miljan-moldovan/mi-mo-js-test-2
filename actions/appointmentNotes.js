export const ADD_NOTE = 'appointmentNotes/ADD_NOTE';
export const SET_NOTES = 'appointmentNotes/SET_NOTES';
export const SET_FILTERED_NOTES = 'appointmentNotes/SET_FILTERED_NOTES';


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

const appointmentNotesActions = {
  addNote,
  setNotes,
  setFilteredNotes,
};

export default appointmentNotesActions;
