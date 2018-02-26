export const ADD_FORMULA = 'appointmentFormulas/ADD_FORMULA';
export const SET_FORMULAS = 'appointmentFormulas/SET_FORMULAS';
export const SET_FILTERED_FORMULAS = 'appointmentFormulas/SET_FILTERED_FORMULAS';
export const SELECTED_FILTER_TYPES = 'appointmentFormulas/SELECTED_FILTER_TYPES';

const formulas = require('../../../../mockData/appointmentFormulas.json');

const initialState = {
  formulas,
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

export function appointmentFormulasReducer(state = initialState, action) {
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
    default:
      return state;
  }
}

function addFormula(formula) {
  return {
    type: ADD_FORMULA,
    data: { formula },
  };
}

function setFormulas(formulas) {
  return {
    type: SET_FORMULAS,
    data: { formulas },
  };
}

function setFilteredFormulas(filtered) {
  return {
    type: SET_FILTERED_FORMULAS,
    data: { filtered },
  };
}

function selectedFilterTypes(filterTypes) {
  return {
    type: SELECTED_FILTER_TYPES,
    data: { filterTypes },
  };
}

const appointmentFormulasActions = {
  addFormula,
  setFormulas,
  setFilteredFormulas,
  selectedFilterTypes,
};

export default appointmentFormulasActions;
