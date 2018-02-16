export const ADD_NOTE = 'appointmentNotes/ADD_NOTE';

function addNote(note) {
  return {
    type: ADD_NOTE,
    data: { note },
  };
}

const appointmentNotesActions = {
  addNote,
};

export default appointmentNotesActions;
