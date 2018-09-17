import {
  GET_APPOINTMENT,
  GET_APPOINTMENT_FAILED,
  GET_APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT,
  UPDATE_APPOINTMENT_FAILED,
  UPDATE_APPOINTMENT_SUCCESS,
} from '../actions/queueDetail';

const initialState = {
  isLoading: false,
  appointment: null,
};

function queueDetailReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case GET_APPOINTMENT:
      return {
        ...state,
        isLoading: true,
      };
    case GET_APPOINTMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        appointment: data.appointment,
      };
    }
    case GET_APPOINTMENT_FAILED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case UPDATE_APPOINTMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case UPDATE_APPOINTMENT_FAILED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case UPDATE_APPOINTMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        appointment: data.appt,
      };
    }
    default:
      return state;
  }
}
export default queueDetailReducer;
