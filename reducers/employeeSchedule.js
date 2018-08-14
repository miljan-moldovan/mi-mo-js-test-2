import {
  GET_EMPLOYEE_SCHEDULE_EXCEPTION,
  GET_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS,
  GET_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED,
  GET_EMPLOYEE_SCHEDULE,
  GET_EMPLOYEE_SCHEDULE_SUCCESS,
  GET_EMPLOYEE_SCHEDULE_FAILED,
  PUT_EMPLOYEE_SCHEDULE_EXCEPTION,
  PUT_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS,
  PUT_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED,
} from '../actions/employeeSchedule';

const initialState = {
  isLoading: false,
  error: null,
  employeeScheduleException: null,
  employeeSchedule: null,
};

export default function employeeScheduleReducer(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case GET_EMPLOYEE_SCHEDULE_EXCEPTION:
      return {
        ...state,
        isLoading: true,
        employeeScheduleException: null,
      };
    case GET_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        employeeScheduleException: data.response,
        employeeSchedule: null,
      };
    case GET_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    case GET_EMPLOYEE_SCHEDULE:
      return {
        ...state,
        isLoading: true,
        employeeSchedule: null,
      };
    case GET_EMPLOYEE_SCHEDULE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        employeeSchedule: data.response,
        employeeScheduleException: null,
      };
    case GET_EMPLOYEE_SCHEDULE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    case PUT_EMPLOYEE_SCHEDULE_EXCEPTION:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case PUT_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
