import {
  PUT_BLOCKTIME,
  PUT_BLOCKTIME_SUCCESS,
  PUT_BLOCKTIME_FAILED,
} from '../actions/blockTime';

const initialState = {
  isLoading: false,
  error: null,
  blockTime: null,
};

export default function blockTimeReducer(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case PUT_BLOCKTIME:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_BLOCKTIME_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case PUT_BLOCKTIME_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
