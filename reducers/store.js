import moment from 'moment';
import { cloneDeep } from 'lodash';
import {
  GET_SCHEDULE_FOR_DATE,
  GET_SCHEDULE_FOR_DATE_FAILED,
  GET_SCHEDULE_FOR_DATE_SUCCESS,
} from '../actions/store';

const defaultState = {
  isLoading: false,
  selectedDate: moment(),
  selectedDateScheduledIntervals: [],
};

const storeReducer = (state = defaultState, action) => {
  const { type, data = {} } = action;
  const newState = cloneDeep(state);
  switch (type) {
    case GET_SCHEDULE_FOR_DATE:
      newState.isLoading = true;
      newState.selectedDate = data.date;
      break;
    case GET_SCHEDULE_FOR_DATE_FAILED:
      newState.isLoading = false;
      break;
    case GET_SCHEDULE_FOR_DATE_SUCCESS:
      newState.isLoading = false;
      newState.selectedDateScheduledIntervals = data.schedule;
      break;
    default:
      break;
  }

  return newState;
};
export default storeReducer;
