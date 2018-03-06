import {
  GET_REMOVAL_REASON_TYPES,
  GET_REMOVAL_REASON_TYPES_SUCCESS,
  GET_REMOVAL_REASON_TYPES_FAILED,
  PUT_WALKOUT,
  PUT_WALKOUT_SUCCESS,
  PUT_WALKOUT_FAILED,
} from '../actions/walkout';

const initialState = {
  reasonTypes: [],
  isLoading: false,
  error: null,
};

export default function walkoutReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case GET_REMOVAL_REASON_TYPES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_REMOVAL_REASON_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reasonTypes: data.reasonTypes,
        error: null,
      };
    case GET_REMOVAL_REASON_TYPES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        reasonTypes: [],
      };
    case PUT_WALKOUT:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_WALKOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_WALKOUT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
