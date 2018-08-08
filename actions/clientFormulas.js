import { Client } from '../utilities/apiWrapper';


export const ADD_FORMULA = 'clientFormulas/ADD_FORMULA';
export const SET_FORMULAS = 'clientFormulas/SET_FORMULAS';
export const SET_FILTERED_FORMULAS = 'clientFormulas/SET_FILTERED_FORMULAS';
export const SELECTED_FILTER_TYPES = 'clientFormulas/SELECTED_FILTER_TYPES';

export const GET_CLIENT_FORMULAS = 'clientFormulas/GET_CLIENT_FORMULAS';
export const GET_CLIENT_FORMULAS_SUCCESS = 'clientFormulas/GET_CLIENT_FORMULAS_SUCCESS';
export const GET_CLIENT_FORMULAS_FAILED = 'clientFormulas/GET_CLIENT_FORMULAS_FAILED';


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


function getClientFormulasSuccess(formulas) {
  return {
    type: GET_CLIENT_FORMULAS_SUCCESS,
    data: { formulas },
  };
}

const getClientFormulasFailed = error => ({
  type: GET_CLIENT_FORMULAS_FAILED,
  data: { error },
});

const getClientFormulas = clientId => (dispatch) => {
  dispatch({ type: GET_CLIENT_FORMULAS });
  return Client.getFormulas(clientId)
    .then(response => dispatch(getClientFormulasSuccess(response)))
    .catch(error => dispatch(getClientFormulasFailed(error)));
};

const clientFormulasActions = {
  addFormula,
  setFormulas,
  setFilteredFormulas,
  selectedFilterTypes,
  getClientFormulas,
};

export default clientFormulasActions;
