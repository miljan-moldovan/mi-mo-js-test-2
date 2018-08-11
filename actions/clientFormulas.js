import { Formula } from '../utilities/apiWrapper';
import apiConstants from '../utilities/apiWrapper/apiConstants';
import { storeForm, purgeForm } from './formCache';

export const SET_FORMULAS = 'clientFormulas/SET_FORMULAS';
export const SET_FILTERED_FORMULAS = 'clientFormulas/SET_FILTERED_FORMULAS';
export const SELECTED_PROVIDER = 'clientFormulas/SELECTED_PROVIDER';
export const SET_ON_EDITION_FORMULA = 'clientFormulas/SET_ON_EDITION_FORMULA';

export const GET_CLIENT_FORMULAS = 'clientFormulas/GET_CLIENT_FORMULAS';
export const GET_CLIENT_FORMULAS_SUCCESS = 'clientFormulas/GET_CLIENT_FORMULAS_SUCCESS';
export const GET_CLIENT_FORMULAS_FAILED = 'clientFormulas/GET_CLIENT_FORMULAS_FAILED';

export const POST_CLIENT_FORMULA = 'clientFormulas/POST_CLIENT_FORMULA';
export const POST_CLIENT_FORMULA_SUCCESS = 'clientFormulas/POST_CLIENT_FORMULA_SUCCESS';
export const POST_CLIENT_FORMULA_FAILED = 'clientFormulas/POST_CLIENT_FORMULA_FAILED';

export const PUT_CLIENT_FORMULA = 'clientFormulas/PUT_CLIENT_FORMULA';
export const PUT_CLIENT_FORMULA_SUCCESS = 'clientFormulas/PUT_CLIENT_FORMULA_SUCCESS';
export const PUT_CLIENT_FORMULA_FAILED = 'clientFormulas/PUT_CLIENT_FORMULA_FAILED';

export const DELETE_CLIENT_FORMULA = 'clientFormulas/DELETE_CLIENT_FORMULA';
export const DELETE_CLIENT_FORMULA_SUCCESS = 'clientFormulas/DELETE_CLIENT_FORMULA_SUCCESS';
export const DELETE_CLIENT_FORMULA_FAILED = 'clientFormulas/DELETE_CLIENT_FORMULA_FAILED';

export const UNDELETE_CLIENT_FORMULA = 'clientFormulas/UNDELETE_CLIENT_FORMULA';
export const UNDELETE_CLIENT_FORMULA_SUCCESS = 'clientFormulas/UNDELETE_CLIENT_FORMULA_SUCCESS';
export const UNDELETE_CLIENT_FORMULA_FAILED = 'clientFormulas/UNDELETE_CLIENT_FORMULA_FAILED';

export const SET_CLIENT_FORMULA_FORM = 'clientFormulas/SET_CLIENT_FORMULA_FORM';

const putClientFormulasSuccess = formulas => ({
  type: PUT_CLIENT_FORMULA_SUCCESS,
  data: { formulas },
});

const putClientFormulasFailed = error => ({
  type: PUT_CLIENT_FORMULA_FAILED,
  data: { error },
});

const putClientFormulas = (clientId, formula) => (dispatch) => {
  dispatch({ type: PUT_CLIENT_FORMULA });
  return Formula.putClientFormula({ clientId, id: formula.id }, formula)
    .then((response) => {
      dispatch(purgeForm('ClientFormulaScreenUpdate', formula.id.toString()));
      return dispatch(putClientFormulasSuccess(response));
    })
    .catch((error) => {
      if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
        dispatch(storeForm('ClientFormulaScreenUpdate', formula.id.toString(), formula));
      }
      return dispatch(putClientFormulasFailed(error));
    });
};


const setClientFormulaUpdateForm = formula => dispatch => dispatch(storeForm('ClientFormulaScreenUpdate', formula.id.toString(), formula));
const setClientFormulaNewForm = (clientId, formula) => dispatch => dispatch(storeForm('ClientFormulaScreenNew', clientId.toString(), formula));

const purgeClientFormulaUpdateForm = formula => dispatch => dispatch(purgeForm('ClientFormulaScreenUpdate', formula.id.toString(), formula));
const purgeClientFormulaNewForm = (clientId, formula) => dispatch => dispatch(purgeForm('ClientFormulaScreenNew', clientId.toString(), formula));


const undeleteClientFormulasSuccess = formulas => ({
  type: UNDELETE_CLIENT_FORMULA_SUCCESS,
  data: { formulas },
});

const undeleteClientFormulasFailed = error => ({
  type: UNDELETE_CLIENT_FORMULA_FAILED,
  data: { error },
});

const undeleteClientFormulas = (clientId, id) => (dispatch) => {
  dispatch({ type: UNDELETE_CLIENT_FORMULA });
  return Formula.postUndeleteClientFormula({ clientId, id })
    .then(response => dispatch(undeleteClientFormulasSuccess(response)))
    .catch(error => dispatch(undeleteClientFormulasFailed(error)));
};

const deleteClientFormulasSuccess = formulas => ({
  type: DELETE_CLIENT_FORMULA_SUCCESS,
  data: { formulas },
});

const deleteClientFormulasFailed = error => ({
  type: DELETE_CLIENT_FORMULA_FAILED,
  data: { error },
});

const deleteClientFormulas = (clientId, formulaId) => (dispatch) => {
  dispatch({ type: DELETE_CLIENT_FORMULA });
  return Formula.deleteClientFormula({ clientId, formulaId })
    .then(response => dispatch(deleteClientFormulasSuccess(response)))
    .catch(error => dispatch(deleteClientFormulasFailed(error)));
};

const postClientFormulasSuccess = formulas => ({
  type: POST_CLIENT_FORMULA_SUCCESS,
  data: { formulas },
});

const postClientFormulasFailed = error => ({
  type: POST_CLIENT_FORMULA_FAILED,
  data: { error },
});

const postClientFormulas = (clientId, formula) => (dispatch) => {
  dispatch({ type: POST_CLIENT_FORMULA });
  return Formula.postClientFormula(clientId, formula)
    .then((response) => {
      dispatch(purgeForm('ClientFormulaScreenNew', clientId.toString()));
      return dispatch(postClientFormulasSuccess(response));
    })
    .catch((error) => {
      if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
        dispatch(storeForm('ClientFormulaScreenNew', clientId.toString(), formula));
      }
      return dispatch(postClientFormulasFailed(error));
    });
};


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
  return Formula.getClientFormulas(clientId)
    .then(response => dispatch(getClientFormulasSuccess(response)))
    .catch(error => dispatch(getClientFormulasFailed(error)));
};

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

function selectProvider(provider) {
  return {
    type: SELECTED_PROVIDER,
    data: { provider },
  };
}

function setOnEditionFormula(onEditionFormula) {
  return {
    type: SET_ON_EDITION_FORMULA,
    data: { onEditionFormula },
  };
}

const clientFormulasActions = {
  setFormulas,
  setFilteredFormulas,
  selectProvider,
  setOnEditionFormula,
  getClientFormulas,
  postClientFormulas,
  deleteClientFormulas,
  undeleteClientFormulas,
  putClientFormulas,
  setClientFormulaUpdateForm,
  setClientFormulaNewForm,
  purgeClientFormulaNewForm,
  purgeClientFormulaUpdateForm,
};

export default clientFormulasActions;
