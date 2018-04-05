import {
  GET_APPOINTMENTS,
  GET_APPOINTMENTS_SUCCESS,
  GET_APPOINTMENTS_FAILED,
} from '../actions/appointment';

const initialState = {
  isLoading: false,
  error: null,
  appointments: []
};

export default function appoinmentReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case GET_APPOINTMENTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        appointments: data.appointmentResponse
      };
    case GET_APPOINTMENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
