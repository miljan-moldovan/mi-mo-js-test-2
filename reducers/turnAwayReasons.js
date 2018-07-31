import {
  GET_TURNAWAY_REASONS,
  GET_TURNAWAY_REASONS_SUCCESS,
  GET_TURNAWAY_REASONS_FAILED,
} from '../actions/turnAwayReasons';

const initialState = {
  isLoading: false,
  error: null,
  turnAwayReasons: [],
};

export default function turnAwayReasonsReducer(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case GET_TURNAWAY_REASONS:
      return {
        ...state,
        isLoading: true,
        turnAwayReasons: [],
      };
    case GET_TURNAWAY_REASONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        turnAwayReasons: data.response,
      };
    case GET_TURNAWAY_REASONS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
