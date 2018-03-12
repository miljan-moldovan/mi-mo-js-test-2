import {
  PUT_START_SERVICE,
  PUT_START_SERVICE_SUCCESS,
  PUT_START_SERVICE_FAILED,
} from '../actions/service';

const initialState = {
  isLoading: false,
  error: null,
};

export default function serviceReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case PUT_START_SERVICE:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_START_SERVICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_START_SERVICE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
