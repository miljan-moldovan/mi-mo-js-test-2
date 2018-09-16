import {
  GET_APPOINTMENT,
  GET_APPOINTMENT_FAILED,
  GET_APPOINTMENT_SUCCESS,
} from '../actions/queueDetail';

const initialState = {
  isLoading: false,
  appointment: null,
};

export function queueDetailReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case GET_APPOINTMENT:
      return {
        ...state,
        isLoading: true,
      };
    case GET_APPOINTMENT_SUCCESS: {
      return {
        isLoading: false,
        appointment: data.appointment,
      };
    }
    case GET_APPOINTMENT_FAILED: {
      return {
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
export default queueDetailReducer;
