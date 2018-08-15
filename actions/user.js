import { Session, Employees } from '../utilities/apiWrapper';

export const GET_SESSION_DATA = 'user/GET_SESSION_DATA';
export const GET_SESSION_DATA_SUCCESS = 'user/GET_SESSION_DATA_SUCCESS';
export const GET_SESSION_DATA_FAILED = 'user/GET_SESSION_DATA_FAILED';
export const GET_EMPLOYEE_DATA = 'user/GET_EMPLOYEE_DATA';
export const GET_EMPLOYEE_DATA_SUCCESS = 'user/GET_EMPLOYEE_DATA_SUCCESS';
export const GET_EMPLOYEE_DATA_FAILED = 'user/GET_EMPLOYEE_DATA_FAILED';

const getSessionInfoSuccess = info => (dispatch) => {
  dispatch({
    type: GET_SESSION_DATA_SUCCESS,
    data: { info },
  });
  Employees.getEmployee(info.employeeId)
    .then(employee => dispatch({
      type: GET_EMPLOYEE_DATA_SUCCESS,
      data: { employee },
    }));
};

const getEmployeeData = () => async (dispatch) => {
  dispatch({
    type: GET_SESSION_DATA,
  });
  Session.getSessionInfo()
    .then(info => dispatch(getSessionInfoSuccess(info)))
    .catch(error => dispatch({
      type: GET_SESSION_DATA_FAILED,
      data: { error },
    }));
};

const userActions = {
  getEmployeeData,
};
export default userActions;
