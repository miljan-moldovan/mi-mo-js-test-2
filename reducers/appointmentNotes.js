import appointmentNotesActions, {
  ADD_NOTE,
  SET_NOTES,
  SET_FILTERED_NOTES,
} from '../actions/appointmentNotes';

const appointmentNotes = require('../mockData/appointmentNotes.json');

const initialState = {
  notes: appointmentNotes,
  filtered: [],
  note: {
    id: 0,
    date: '',
    author: 'TEST USER',
    note: '',
    tags: [],
  },
};

export default function clientsReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case ADD_NOTE:
      return {
        ...state,
        error: null,
        note: data.note,
      };
    case SET_FILTERED_NOTES:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case SET_NOTES:
      return {
        ...state,
        error: null,
        notes: data.notes,
      };
    default:
      return state;
  }
}
