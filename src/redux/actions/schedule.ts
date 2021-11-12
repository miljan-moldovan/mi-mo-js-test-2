import moment from 'moment';

import DateTime from '../../constants/DateTime';
import { Employees } from '../../utilities/apiWrapper';
import { showErrorAlert } from './utils';

export const GET_EMPLOYEE_SCHEDULE_FOR_DATE =
  'schedule/GET_EMPLOYEE_SCHEDULE_FOR_DATE';
export const GET_EMPLOYEE_SCHEDULE_FOR_DATE_SUCCESS =
  'schedule/GET_EMPLOYEE_SCHEDULE_FOR_DATE_SUCCESS';
export const GET_EMPLOYEE_SCHEDULE_FOR_DATE_FAILED =
  'schedule/GET_EMPLOYEE_SCHEDULE_FOR_DATE_FAILED';

const getEmployeeScheduleForDate = (employeeId: number, date: string | moment.Moment): any => dispatch => {
  dispatch({ type: GET_EMPLOYEE_SCHEDULE_FOR_DATE });
  Employees.getEmployeeSchedule(
    employeeId,
    moment(date).format(DateTime.date)
  )
    .then(schedule =>
      dispatch({
        type: GET_EMPLOYEE_SCHEDULE_FOR_DATE_SUCCESS,
        data: { employeeId, date, schedule },
      })
    )
    .catch(error => {
      showErrorAlert(error);
      dispatch({
        type: GET_EMPLOYEE_SCHEDULE_FOR_DATE_FAILED,
      });
    });
};

const scheduleActions = {
  getEmployeeScheduleForDate,
};

export interface ScheduleActions {
  getEmployeeScheduleForDate: (employeeId: number, date: string | moment.Moment) => any;
}
export default scheduleActions;
