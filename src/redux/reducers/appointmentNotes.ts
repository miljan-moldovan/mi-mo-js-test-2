import AppointmentNotes from '../../constants/AppointmentNotes';
import appointmentNotesActions, {
  SET_NOTES,
  SET_FILTERED_NOTES,
  SELECTED_PROVIDER,
  SET_ON_EDITION_NOTE,
  GET_APPOINTMENT_NOTES,
  GET_APPOINTMENT_NOTES_SUCCESS,
  GET_APPOINTMENT_NOTES_FAILED,
  POST_APPOINTMENT_NOTE,
  POST_APPOINTMENT_NOTE_SUCCESS,
  POST_APPOINTMENT_NOTE_FAILED,
  DELETE_APPOINTMENT_NOTE,
  DELETE_APPOINTMENT_NOTE_SUCCESS,
  DELETE_APPOINTMENT_NOTE_FAILED,
  UNDELETE_APPOINTMENT_NOTE,
  UNDELETE_APPOINTMENT_NOTE_SUCCESS,
  UNDELETE_APPOINTMENT_NOTE_FAILED,
  PUT_APPOINTMENT_NOTE,
  PUT_APPOINTMENT_NOTE_SUCCESS,
  PUT_APPOINTMENT_NOTE_FAILED,
} from '../actions/appointmentNotes';
import { Note, PureProvider, Maybe } from '@/models';

const initialState = {
  notes: [],
  filtered: [],
  selectedProvider: null,
  note: {
    id: Math.random().toString(),
    notes: '',
    expiration: '',
    forAppointment: false,
    forQueue: false,
    forSales: false,
    isDeleted: false,
  },
  onEditionNote: null,
  isLoading: false,
  error: null,
};

export interface ApptNotesReducer {
  notes: Note[],
  filtered: Note[],
  selectedProvider: Maybe<PureProvider>,
  note: {
    id: Maybe<number>,
    notes: string,
    expiration: string,
    forAppointment: boolean,
    forQueue: boolean,
    forSales: boolean,
    isDeleted: boolean,
  },
  onEditionNote: Maybe<any>,
  isLoading: boolean,
  error: Maybe<any>,
}

export default function appointmentNotesReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case PUT_APPOINTMENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_APPOINTMENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_APPOINTMENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case POST_APPOINTMENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case POST_APPOINTMENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case POST_APPOINTMENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case DELETE_APPOINTMENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_APPOINTMENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case DELETE_APPOINTMENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case UNDELETE_APPOINTMENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case UNDELETE_APPOINTMENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case UNDELETE_APPOINTMENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case GET_APPOINTMENT_NOTES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_APPOINTMENT_NOTES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notes: data.notes,
        filtered: data.notes,
        error: null,
      };
    case GET_APPOINTMENT_NOTES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
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
