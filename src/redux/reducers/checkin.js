import {
  PUT_CHECK_IN,
  PUT_CHECK_IN_SUCCESS,
  PUT_CHECK_IN_FAILED,
} from '../actions/checkin';

const initialState = {
  isLoading: false,
  error: null,
};

export default function checkinReducer (state = initialState, action) {
  const {type, data} = action;
  switch (type) {
    case PUT_CHECK_IN:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_CHECK_IN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_CHECK_IN_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
