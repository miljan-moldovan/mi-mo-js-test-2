import rebookActions, {
  POST_REBOOK,
  POST_REBOOK_SUCCESS,
  POST_REBOOK_FAILED,
} from '../actions/rebook';

const initialState = {
  isLoading: true,
  error: null,
};

export default function rebookReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case POST_REBOOK:
      return {
        ...state,
        isLoading: true,
      };
    case POST_REBOOK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case POST_REBOOK_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
