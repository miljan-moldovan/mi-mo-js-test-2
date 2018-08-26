import moment from 'moment';

import {
  LOAD_STORE_INFO_SUCCESS,
  LOAD_SCHEDULE_EXCEPTIONS_SUCCESS,
  GET_SCHEDULE_FOR_DATE,
  GET_SCHEDULE_FOR_DATE_FAILED,
  GET_SCHEDULE_FOR_DATE_SUCCESS,
} from '../actions/store';

const initialState = {
  isLoading: false,
  storeInfo: null,
  scheduleExceptions: [],
  selectedDate: moment(),
  selectedDateScheduledIntervals: [],
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
    case GET_SCHEDULE_FOR_DATE:
      return {
        ...state,
        isLoading: true,
        selectedDate: data.date,
      };
    case GET_SCHEDULE_FOR_DATE_FAILED:
      return {
        isLoading: false,
      };
    case GET_SCHEDULE_FOR_DATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedDateScheduledIntervals: data.schedule,
      };
    default:
      return state;
  }
}
