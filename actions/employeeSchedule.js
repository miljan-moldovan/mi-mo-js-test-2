import moment from 'moment';
import { Employees } from '../utilities/apiWrapper';


export const GET_EMPLOYEE_SCHEDULE = 'employeeSchedule/GET_EMPLOYEE_SCHEDULE';
export const GET_EMPLOYEE_SCHEDULE_SUCCESS = 'employeeSchedule/GET_EMPLOYEE_SCHEDULE_SUCCESS';
export const GET_EMPLOYEE_SCHEDULE_FAILED = 'employeeSchedule/GET_EMPLOYEE_SCHEDULE_FAILED';
export const PUT_EMPLOYEE_SCHEDULE = 'employeeSchedule/PUT_EMPLOYEE_SCHEDULE';
export const PUT_EMPLOYEE_SCHEDULE_SUCCESS = 'employeeSchedule/PUT_EMPLOYEE_SCHEDULE_SUCCESS';
export const PUT_EMPLOYEE_SCHEDULE_FAILED = 'employeeSchedule/PUT_EMPLOYEE_SCHEDULE_FAILED';

const getEmployeeScheduleSuccess = response => ({
  type: GET_EMPLOYEE_SCHEDULE_SUCCESS,
  data: { response },
});

const getEmployeeScheduleFailed = error => ({
  type: GET_EMPLOYEE_SCHEDULE_FAILED,
  data: { error },
});

const putEmployeeScheduleSuccess = employeeSchedule => ({
  type: PUT_EMPLOYEE_SCHEDULE_SUCCESS,
  data: { employeeSchedule },
});

const putEmployeeScheduleFailed = error => ({
  type: PUT_EMPLOYEE_SCHEDULE_FAILED,
  data: { error },
});

const getEmployeeSchedule = (employeeId, date, callback) => (dispatch) => {
  dispatch({ type: GET_EMPLOYEE_SCHEDULE });

  return Employees.getEmployeeScheduleException(employeeId, date)
    .then((response) => { dispatch(getEmployeeScheduleSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getEmployeeScheduleFailed(error)); callback(false); });
};

const putEmployeeSchedule = (employeeId, data, date, callback) => (dispatch) => {
  dispatch({ type: PUT_EMPLOYEE_SCHEDULE });

  return Employees.putEmployeeScheduleException(employeeId, data)
    .then((response) => {
      callback(true);
      Employees.getEmployeeScheduleException(employeeId, date, callback)
        .then(resp => dispatch(putEmployeeScheduleSuccess(resp)));
    })
    .catch((error) => { dispatch(putEmployeeScheduleFailed(error)); callback(false); });
};

const employeeScheduleActions = {
  getEmployeeSchedule,
  putEmployeeSchedule,
};

export default employeeScheduleActions;
