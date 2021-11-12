import clientFormulasActions, {
  SET_FORMULAS,
  SET_FILTERED_FORMULAS,
  GET_CLIENT_FORMULAS,
  GET_CLIENT_FORMULAS_SUCCESS,
  GET_CLIENT_FORMULAS_FAILED,
  POST_CLIENT_FORMULA,
  POST_CLIENT_FORMULA_SUCCESS,
  POST_CLIENT_FORMULA_FAILED,
  DELETE_CLIENT_FORMULA,
  DELETE_CLIENT_FORMULA_SUCCESS,
  DELETE_CLIENT_FORMULA_FAILED,
  UNDELETE_CLIENT_FORMULA,
  UNDELETE_CLIENT_FORMULA_SUCCESS,
  UNDELETE_CLIENT_FORMULA_FAILED,
  PUT_CLIENT_FORMULA,
  PUT_CLIENT_FORMULA_SUCCESS,
  PUT_CLIENT_FORMULA_FAILED,
} from '../actions/clientFormulas';
import { Formula, Client, Maybe, PureProvider } from '@/models';

const initialState: ClientFormulasReducer = {
  error: null,
  formulas: [],
  filtered: [],
  newFormula: {
    id: 0,
    client: null,
    type: null,
    formula: '',
    associated: null,
    date: null,
    provider: null,
    copyTo: null,
  },
  isLoading: false,
};

export interface ClientFormulasReducer {
  formulas: Formula[];
  filtered: Formula[];
  newFormula: {
    id: number;
    client: Maybe<Client>;
    type: Maybe<any>;
    formula: string;
    associated: Maybe<any>;
    date: Maybe<any>;
    provider: Maybe<PureProvider>;
    copyTo: Maybe<any>;
  };
  error: Maybe<any>;
  isLoading: boolean;
}

export default function clientFormulasReducer(state: ClientFormulasReducer = initialState, action): ClientFormulasReducer {
  const { type, data } = action;
  switch (type) {
    case PUT_CLIENT_FORMULA:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_CLIENT_FORMULA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_CLIENT_FORMULA_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        formulas: [],
      };
    case POST_CLIENT_FORMULA:
      return {
        ...state,
        isLoading: true,
      };
    case POST_CLIENT_FORMULA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case POST_CLIENT_FORMULA_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        formulas: [],
      };
    case DELETE_CLIENT_FORMULA:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_CLIENT_FORMULA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case DELETE_CLIENT_FORMULA_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        formulas: [],
      };
    case UNDELETE_CLIENT_FORMULA:
      return {
        ...state,
        isLoading: true,
      };
    case UNDELETE_CLIENT_FORMULA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case UNDELETE_CLIENT_FORMULA_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        formulas: [],
      };
    case SET_FILTERED_FORMULAS:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case SET_FORMULAS:
      return {
        ...state,
        error: null,
        formulas: data.formulas,
      };
    case GET_CLIENT_FORMULAS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CLIENT_FORMULAS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        formulas: data.formulas,
        filtered: data.formulas,
        error: null,
      };
    case GET_CLIENT_FORMULAS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        formulas: [],
      };
    default:
      return state;
  }
}
