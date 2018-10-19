import {
  POST_BLOCKTIME,
  POST_BLOCKTIME_SUCCESS,
  POST_BLOCKTIME_FAILED,
  PUT_BLOCKTIME_EDIT,
  PUT_BLOCKTIME_EDIT_SUCCESS,
  PUT_BLOCKTIME_EDIT_FAILED,
} from '../actions/blockTime';

const initialState = {
  isLoading: false,
  error: null,
  blockTime: null,
};

export default function blockTimeReducer(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case POST_BLOCKTIME:
    case PUT_BLOCKTIME_EDIT:
      return {
        ...state,
        isLoading: true,
      };
    case POST_BLOCKTIME_SUCCESS:
    case PUT_BLOCKTIME_EDIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case POST_BLOCKTIME_FAILED:
    case PUT_BLOCKTIME_EDIT_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
