import { isNumber } from 'lodash';
import { Session, Employees } from '../../utilities/apiWrapper';
import { SessionInfo, Maybe, PureProvider, AppStore } from '@/models';
import newAppointmentActions from './newAppointment';

export const GET_SESSION_DATA = 'user/GET_SESSION_DATA';
export const GET_SESSION_DATA_SUCCESS = 'user/GET_SESSION_DATA_SUCCESS';
export const GET_SESSION_DATA_FAILED = 'user/GET_SESSION_DATA_FAILED';
export const GET_EMPLOYEE_DATA = 'user/GET_EMPLOYEE_DATA';
export const GET_EMPLOYEE_DATA_SUCCESS = 'user/GET_EMPLOYEE_DATA_SUCCESS';
export const GET_EMPLOYEE_DATA_FAILED = 'user/GET_EMPLOYEE_DATA_FAILED';

const getSessionInfoSuccess = (info: SessionInfo, employee: Maybe<PureProvider>): any => dispatch => {
  dispatch({
    type: GET_SESSION_DATA_SUCCESS,
    data: { info, employee },
  });
};

const getEmployeeData = (): any => async (dispatch, getState: () => AppStore) => {
  if (!getState().userInfoReducer.doneFetching) {
    dispatch({
      type: GET_SESSION_DATA,
    });
    Session.getSessionInfo()
      .then(async info => {
        const employee = isNumber(info.employeeId) && info.employeeId > 0
          ? await Employees.getEmployee(info.employeeId)
          : null;
        dispatch(newAppointmentActions.setBookedBy(employee));
        dispatch(getSessionInfoSuccess(info, employee));
      })
      .catch(error =>
        dispatch({
          type: GET_SESSION_DATA_FAILED,
          data: { error },
        }),
      );
  }
};

const userActions = {
  getEmployeeData,
};

export interface UserActions {
  getEmployeeData: () => any;
}

export default userActions;
