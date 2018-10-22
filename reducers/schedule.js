import { cloneDeep } from 'lodash';

import {
  GET_EMPLOYEE_SCHEDULE_FOR_DATE,
  GET_EMPLOYEE_SCHEDULE_FOR_DATE_FAILED,
  GET_EMPLOYEE_SCHEDULE_FOR_DATE_SUCCESS,
} from '../actions/schedule';

const initialState = {
  isLoading: false,
  schedules: [],
};

const scheduleReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_EMPLOYEE_SCHEDULE_FOR_DATE:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EMPLOYEE_SCHEDULE_FOR_DATE_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    case GET_EMPLOYEE_SCHEDULE_FOR_DATE_SUCCESS:
      state.schedules.push({
        date: data.date,
        employeeId: data.employeeId,
        schedule: data.schedule,
      });
      return {
        ...state,
        isLoading: false,
        schedules: cloneDeep(state.schedules),
      };
    default:
      return state;
  }
};
export default scheduleReducer;
