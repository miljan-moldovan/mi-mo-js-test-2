import rebookActions, {
  POST_REBOOK,
  POST_REBOOK_SUCCESS,
  POST_REBOOK_FAILED,
  SET_REBOOK_DATA,
} from '../actions/rebookDialog';
import { Maybe } from '@/models';

const initialState: RebookReducer = {
  isLoading: false,
  error: null,
  rebookData: {},
};

export interface RebookReducer {
  isLoading: boolean;
  error: Maybe<any>;
  rebookData: any;
}

export default function rebookReducer(state: RebookReducer = initialState, action): RebookReducer {
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
    case SET_REBOOK_DATA:
      return {
        ...state,
        rebookData: data.rebookData,
      };
    default:
      return state;
  }
}
