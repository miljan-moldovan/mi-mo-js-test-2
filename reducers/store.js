// @flow
import {
  LOAD_STORE_INFO_SUCCESS,
  LOAD_SCHEDULE_EXCEPTIONS_SUCCESS,
} from '../actions/store';

const initialState = {
  hasStore: false,
  storeId: null,
  storeInfo: null,
  scheduleExceptions: [],
};

export default function storeReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_STORE_INFO_SUCCESS:
      return {
        ...state,
        storeInfo: data.storeInfo,
      };
    case LOAD_SCHEDULE_EXCEPTIONS_SUCCESS:
      return {
        ...state,
        scheduleExceptions: data.scheduleExceptions,
      };
    default:
      return state;
  }
}
