import {
  GET_APPOINTMENTS,
  GET_APPOINTMENTS_SUCCESS,
  GET_APPOINTMENTS_FAILED,
  POST_APPOINTMENT_MOVE,
  POST_APPOINTMENT_MOVE_SUCCESS,
  POST_APPOINTMENT_MOVE_FAILED
} from '../actions/appointment';

const initialState = {
  isMoving: false,
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
    case POST_APPOINTMENT_MOVE:
      return {
        ...state,
        isMoving: true,
      };
    case POST_APPOINTMENT_MOVE_SUCCESS:
      return {
        ...state,
        isMoving: false,
      };
    case POST_APPOINTMENT_MOVE_FAILED:
      return {
        ...state,
        isMoving: false,
      };
    default:
      return state;
  }
}
