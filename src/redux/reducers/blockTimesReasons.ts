import {
  GET_BLOCKTIMES_REASONS,
  GET_BLOCKTIMES_REASONS_SUCCESS,
  GET_BLOCKTIMES_REASONS_FAILED,
} from '../actions/blockTimesReasons';
import { Maybe } from '@/models';

const initialState = {
  isLoading: false,
  error: null,
  blockTimesReasons: [],
};

export interface BlockTimeReasonsReducer {
  isLoading: boolean;
  error: Maybe<any>;
  blockTimesReasons: any[];
}

export default function blockTimesReasonsReducer(
  state = initialState,
  action
) {
  const { type, data } = action;

  switch (type) {
    case GET_BLOCKTIMES_REASONS:
      return {
        ...state,
        isLoading: true,
        blockTimesReasons: [],
      };
    case GET_BLOCKTIMES_REASONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        blockTimesReasons: data.response,
      };
    case GET_BLOCKTIMES_REASONS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
