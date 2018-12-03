import { Moment } from 'moment';
import { cloneDeep } from 'lodash';

import {
  GET_EMPLOYEE_SCHEDULE_FOR_DATE,
  GET_EMPLOYEE_SCHEDULE_FOR_DATE_FAILED,
  GET_EMPLOYEE_SCHEDULE_FOR_DATE_SUCCESS,
} from '../actions/schedule';
import { EmployeeSchedule, Employee, Maybe } from '@/models';

const initialState: ScheduleReducer = {
  isLoading: false,
  schedules: [],
};

export interface ScheduleReducer {
  isLoading: boolean;
  schedules: ScheduleWithEmployeeId[];
}

interface ScheduleWithEmployeeId {
  date: string | Moment;
  employeeId?: Maybe<number>;
  schedule: EmployeeSchedule;
}

const scheduleReducer = (state: ScheduleReducer = initialState, action): ScheduleReducer => {
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
