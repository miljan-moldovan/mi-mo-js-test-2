import rebookActions, {
  POST_REBOOK,
  POST_REBOOK_SUCCESS,
  POST_REBOOK_FAILED,
  SET_REBOOK_DATA,
} from '../actions/rebookDialog';

const initialState = {
  isLoading: false,
  error: null,
  rebookData: {},
};

export default function rebookReducer (state = initialState, action) {
  const {type, data} = action;
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
    case SET_REBOOK_DATA:
      return {
        ...state,
        rebookData: data.rebookData,
      };
    default:
      return state;
  }
}
