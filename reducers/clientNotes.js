import clientNotesActions, {
  SET_NOTES,
  SET_FILTERED_NOTES,
  SELECTED_PROVIDER,
  SET_ON_EDITION_NOTE,
  GET_CLIENT_NOTES,
  GET_CLIENT_NOTES_SUCCESS,
  GET_CLIENT_NOTES_FAILED,
  POST_CLIENT_NOTE,
  POST_CLIENT_NOTE_SUCCESS,
  POST_CLIENT_NOTE_FAILED,
  DELETE_CLIENT_NOTE,
  DELETE_CLIENT_NOTE_SUCCESS,
  DELETE_CLIENT_NOTE_FAILED,
  UNDELETE_CLIENT_NOTE,
  UNDELETE_CLIENT_NOTE_SUCCESS,
  UNDELETE_CLIENT_NOTE_FAILED,
  PUT_CLIENT_NOTE,
  PUT_CLIENT_NOTE_SUCCESS,
  PUT_CLIENT_NOTE_FAILED,
} from '../actions/clientNotes';

const initialState = {
  notes: [],
  filtered: [],
  selectedProvider: {},
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
  isLoading: true,
  error: null,
};

export default function clientNotesReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case PUT_CLIENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_CLIENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_CLIENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case POST_CLIENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case POST_CLIENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case POST_CLIENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case DELETE_CLIENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_CLIENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case DELETE_CLIENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case UNDELETE_CLIENT_NOTE:
      return {
        ...state,
        isLoading: true,
      };
    case UNDELETE_CLIENT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case UNDELETE_CLIENT_NOTE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case GET_CLIENT_NOTES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CLIENT_NOTES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notes: data.notes,
        filtered: data.notes,
        error: null,
      };
    case GET_CLIENT_NOTES_FAILED:
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
