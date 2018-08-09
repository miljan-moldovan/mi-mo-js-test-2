import clientFormulasActions, {
  ADD_FORMULA,
  SET_FORMULAS,
  SET_FILTERED_FORMULAS,
  SELECTED_FILTER_TYPES,
  GET_CLIENT_FORMULAS,
  GET_CLIENT_FORMULAS_SUCCESS,
  GET_CLIENT_FORMULAS_FAILED,
} from '../actions/clientFormulas';

const initialState = {
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
};

export default function clientFormulasReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case ADD_FORMULA:
      return {
        ...state,
        error: null,
        newFormula: data.formula,
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
