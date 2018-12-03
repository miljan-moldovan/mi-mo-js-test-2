import {
  GET_REMOVALREASONTYPES,
  GET_REMOVALREASONTYPES_SUCCESS,
  GET_REMOVALREASONTYPES_FAILED,
} from '../actions/removalReasonTypes';
import { Maybe, QueueRemovalReasonType } from '@/models';

const initialState = {
  isLoading: false,
  error: null,
  removalReasonTypes: [],
};

export interface RemovalReasonTypesReducer {
  isLoading: boolean;
  error: Maybe<any>;
  removalReasonTypes: QueueRemovalReasonType[];
}

export default function removalReasonTypesReducer(
  state = initialState,
  action
) {
  const { type, data } = action;

  switch (type) {
    case GET_REMOVALREASONTYPES:
      return {
        ...state,
        isLoading: true,
        removalReasonTypes: [],
      };
    case GET_REMOVALREASONTYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        removalReasonTypes: data.response,
      };
    case GET_REMOVALREASONTYPES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
