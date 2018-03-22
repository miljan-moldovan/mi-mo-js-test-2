export const SET_APPOINTMENT = 'appointmentDetails/SET_APPOINTMENT';
export const ADD_SERVICE = 'appointmentDetails/ADD_SERVICE';
export const SET_FILTERED_FORMULAS = 'appointmentDetails/SET_FILTERED_FORMULAS';
export const SELECTED_FILTER_TYPES = 'appointmentDetails/SELECTED_FILTER_TYPES';

const initialState = {
  appointment: null,
  error: null,
  services: [],
  products: [],
};

export function appointmentDetailsReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_APPOINTMENT:
      return {
        ...state,
        error: null,
        appointment: data.appointment,
        services: data.appointment.services,
      };
    case ADD_SERVICE:
      const { services } = state;
      console.log('data shit', data);
      if ('index' in data && data.index !== null) {
        services[data.index] = data.service;
      } else {
        services.push(data.service);
      }

      return {
        ...state,
        services,
        error: null,
      };
    default:
      return state;
  }
}

const setAppointment = appointment => ({
  type: SET_APPOINTMENT,
  data: { appointment },
});

const addService = ({ service, index }) => ({
  type: ADD_SERVICE,
  data: { service, index },
});

const appointmentDetailsActions = {
  setAppointment,
  addService,
};

export default appointmentDetailsActions;
