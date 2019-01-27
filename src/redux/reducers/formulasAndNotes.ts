// @flow
import {
  GET_FORMULAS_AND_NOTES,
  GET_FORMULAS_AND_NOTES_SUCCESS,
  GET_FORMULAS_AND_NOTES_FAILED,
} from '../actions/formulasAndNotes';
import { Note, Formula, Maybe } from '@/models';

const initialState: FormulasAndNotesReducer = {
  error: null,
  notes: [],
  formulas: [],
  isLoading: false,
};

export interface FormulasAndNotesReducer {
  isLoading: boolean;
  notes: Note[];
  error: Maybe<any>;
  formulas: Formula[];
}

export default (state: FormulasAndNotesReducer = initialState, action): FormulasAndNotesReducer => {
  const { type, data } = action;
  switch (type) {
    case GET_FORMULAS_AND_NOTES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_FORMULAS_AND_NOTES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        notes: data.notes,
        formulas: data.formulas,
      };
    }
    case GET_FORMULAS_AND_NOTES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
        formulas: [],
      };
    default:
      return state;
  }
};
