import { Client } from '../../utilities/apiWrapper';

export const GET_FORMULAS_AND_NOTES = 'clients/GET_FORMULAS_AND_NOTES';
export const GET_FORMULAS_AND_NOTES_SUCCESS =
  'clients/GET_FORMULAS_AND_NOTES_SUCCESS';
export const GET_FORMULAS_AND_NOTES_FAILED =
  'clients/GET_FORMULAS_AND_NOTES_FAILED';

const getFormulasAndNotesSuccess = ({ formulas, notes }) => ({
  type: GET_FORMULAS_AND_NOTES_SUCCESS,
  data: { formulas, notes },
});

const getFormulasAndNotesFailed = error => ({
  type: GET_FORMULAS_AND_NOTES_FAILED,
  data: { error },
});

const getFormulasAndNotes = clientId => dispatch => {
  dispatch({ type: GET_FORMULAS_AND_NOTES });
  return Client.getFormulasAndNotes(clientId)
    .then(response => dispatch(getFormulasAndNotesSuccess(response)))
    .catch(error => dispatch(getFormulasAndNotesFailed(error)));
};

const formulasAndNotesActions = {
  getFormulasAndNotes,
};

export interface FormulasAndNotesActions {
  getFormulasAndNotes: (clientId: number) => any;
}

export default formulasAndNotesActions;
