import { Employees, AppointmentBook } from '../../utilities/apiWrapper';

export const GET_EMPLOYEE_SCHEDULE_EXCEPTION =
  'employeeSchedule/GET_EMPLOYEE_SCHEDULE_EXCEPTION';
export const GET_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS =
  'employeeSchedule/GET_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS';
export const GET_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED =
  'employeeSchedule/GET_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED';

export const GET_EMPLOYEE_SCHEDULE = 'employeeSchedule/GET_EMPLOYEE_SCHEDULE';
export const GET_EMPLOYEE_SCHEDULE_SUCCESS =
  'employeeSchedule/GET_EMPLOYEE_SCHEDULE_SUCCESS';
export const GET_EMPLOYEE_SCHEDULE_FAILED =
  'employeeSchedule/GET_EMPLOYEE_SCHEDULE_FAILED';

export const PUT_EMPLOYEE_SCHEDULE_EXCEPTION =
  'employeeSchedule/PUT_EMPLOYEE_SCHEDULE_EXCEPTION';
export const PUT_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS =
  'employeeSchedule/PUT_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS';
export const PUT_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED =
  'employeeSchedule/PUT_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED';

const getEmployeeScheduleSuccess = response => ({
  type: GET_EMPLOYEE_SCHEDULE_SUCCESS,
  data: { response },
});

const getEmployeeScheduleFailed = error => ({
  type: GET_EMPLOYEE_SCHEDULE_FAILED,
  data: { error },
});

const putEmployeeScheduleSuccess = employeeSchedule => ({
  type: PUT_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS,
  data: { employeeSchedule },
});

const putEmployeeScheduleFailed = error => ({
  type: PUT_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED,
  data: { error },
});

const getEmployeeScheduleExceptionSuccess = response => ({
  type: GET_EMPLOYEE_SCHEDULE_EXCEPTION_SUCCESS,
  data: { response },
});

const getEmployeeScheduleExceptionFailed = error => ({
  type: GET_EMPLOYEE_SCHEDULE_EXCEPTION_FAILED,
  data: { error },
});

const getEmployeeScheduleException = (
  employeeId,
  date,
  callback
) => dispatch => {
  dispatch({ type: GET_EMPLOYEE_SCHEDULE_EXCEPTION });

  return Employees.getEmployeeScheduleException(employeeId, date)
    .then(response => {
      dispatch(getEmployeeScheduleExceptionSuccess(response));
      callback(true);
    })
    .catch(error => {
      dispatch(getEmployeeScheduleExceptionFailed(error));
      callback(false);
    });
};

const getEmployeeSchedule = (employeeId, date, callback) => dispatch => {
  dispatch({ type: GET_EMPLOYEE_SCHEDULE });

  return AppointmentBook.getAppointmentBookEmployees(date, employeeId)
    .then(response => {
      dispatch(getEmployeeScheduleSuccess(response));
      callback(true);
    })
    .catch(error => {
      dispatch(getEmployeeScheduleFailed(error));
      callback(false);
    });
};

const putEmployeeSchedule = (employeeId, data, date, callback) => dispatch => {
  dispatch({ type: PUT_EMPLOYEE_SCHEDULE_EXCEPTION });

  return Employees.putEmployeeScheduleException(employeeId, data)
    .then(response => {
      callback(true);
      Employees.getEmployeeScheduleException(
        employeeId,
        date,
      ).then(resp => dispatch(putEmployeeScheduleSuccess(resp)));
    })
    .catch(error => {
      dispatch(putEmployeeScheduleFailed(error));
      callback(false);
    });
};

const employeeScheduleActions = {
  getEmployeeSchedule,
  getEmployeeScheduleException,
  putEmployeeSchedule,
};

export default employeeScheduleActions;
