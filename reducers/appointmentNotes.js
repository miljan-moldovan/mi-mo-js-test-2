import appointmentNotesActions, {
  ADD_NOTE,
} from '../actions/appointmentNotes';

const appointmentNotes = require('../mockData/appointmentNotes.json');

const initialState = {
  notes: appointmentNotes,
};

export default function clientsReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case ADD_NOTE:
      return {
        ...state,
        error: null,
        notes: state.notes.concat(data.note),
      };
    default:
      return state;
  }
}
