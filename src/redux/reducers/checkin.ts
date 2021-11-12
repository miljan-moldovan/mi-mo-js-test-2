import {
  PUT_CHECK_IN,
  PUT_CHECK_IN_SUCCESS,
  PUT_CHECK_IN_FAILED,
} from '../actions/checkin';
import { Maybe } from '@/models';

const initialState: CheckInReducer = {
  isLoading: false,
  error: null,
};

export interface CheckInReducer {
  isLoading: boolean;
  error: Maybe<any>;
}

export default function checkinReducer(state: CheckInReducer = initialState, action): CheckInReducer {
  const { type, data } = action;
  switch (type) {
    case PUT_CHECK_IN:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_CHECK_IN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_CHECK_IN_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
