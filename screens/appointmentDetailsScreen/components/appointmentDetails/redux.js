export const ADD_FORMULA = 'appointmentFormulas/ADD_FORMULA';
export const SET_FORMULAS = 'appointmentFormulas/SET_FORMULAS';
export const SET_FILTERED_FORMULAS = 'appointmentFormulas/SET_FILTERED_FORMULAS';
export const SELECTED_FILTER_TYPES = 'appointmentFormulas/SELECTED_FILTER_TYPES';

const formulas = [];

const initialState = {
  formulas,
};

export function appointmentDetailsReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    default:
      return state;
  }
}

const appointmentDetailsActions = {
};

export default appointmentDetailsActions;
