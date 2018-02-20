import AppointmentNotes from '../constants/AppointmentNotes';
import appointmentNotesActions, {
  ADD_NOTE,
  SET_NOTES,
  SET_FILTERED_NOTES,
  SELECTED_PROVIDER,
  SELECTED_FILTER_TYPES,
  SET_ON_EDITION_NOTE,
} from '../actions/appointmentNotes';

const appointmentNotes = require('../mockData/appointmentNotes.json');

const initialState = {
  notes: appointmentNotes,
  filtered: [],
  selectedProvider: null,
  filterTypes: JSON.parse(JSON.stringify(AppointmentNotes.filterTypes)),
  note: {
    id: Math.random().toString(),
    date: null,
    author: null,
    note: '',
    tags: [],
    active: 1,
  },
  onEditionNote: null,
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
    case SELECTED_FILTER_TYPES:
      return {
        ...state,
        error: null,
        notes: data.filterTypes,
      };
    case SELECTED_PROVIDER:
      return {
        ...state,
        error: null,
        selectedProvider: data.provider,
      };
    case SET_ON_EDITION_NOTE:
      return {
        ...state,
        error: null,
        onEditionNote: data.onEditionNote,
      };
    default:
      return state;
  }
}
