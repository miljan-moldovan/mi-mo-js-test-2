import {
  ADD_APPOINTMENT,
  GET_APPOINTMENTS,
  GET_APPOINTMENTS_SUCCESS,
  GET_APPOINTMENTS_FAILED,
  POST_APPOINTMENT_MOVE,
  POST_APPOINTMENT_MOVE_SUCCESS,
  POST_APPOINTMENT_MOVE_FAILED,
  POST_APPOINTMENT_CANCEL,
  POST_APPOINTMENT_CANCEL_SUCCESS,
  POST_APPOINTMENT_CANCEL_FAILED,
  POST_APPOINTMENT_CHECKIN,
  POST_APPOINTMENT_CHECKIN_SUCCESS,
} from '../actions/appointment';

const initialState = {
  isMoving: false,
  isLoading: false,
  isCheckingIn: false,
  error: null,
  appointments: [],
  isCanceling: false,
};

export default function appoinmentReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case ADD_APPOINTMENT:
      const { appointments } = state;
      appointments.push(data.appointment);
      return {
        ...state,
        appointments,
      };
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
        appointments: data.appointmentResponse,
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
    case POST_APPOINTMENT_CANCEL:
      return {
        ...state,
        isCancelling: true,
      };
    case POST_APPOINTMENT_CANCEL_SUCCESS:
      return {
        ...state,
        isCancelling: false,
      };
    case POST_APPOINTMENT_CANCEL_FAILED:
      return {
        ...state,
        isCancelling: false,
      };
    case POST_APPOINTMENT_CHECKIN:
      return {
        ...state,
        isCheckingIn: true,
      };
    case POST_APPOINTMENT_CHECKIN_SUCCESS:
      return {
        ...state,
        isCheckingIn: false,
      };
    default:
      return state;
  }
}
