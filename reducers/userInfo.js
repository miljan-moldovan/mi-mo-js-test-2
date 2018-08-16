import {
  GET_SESSION_DATA,
  GET_SESSION_DATA_SUCCESS,
  GET_SESSION_DATA_FAILED,
  GET_EMPLOYEE_DATA,
  GET_EMPLOYEE_DATA_SUCCESS,
  GET_EMPLOYEE_DATA_FAILED,
} from '../actions/user';
import { GET_SERVICES_SUCCESS } from '../actions/service';
import { GET_EMPLOYEES_SUCCESS } from '../actions/apptBookSetEmployeeOrder';

const initialState = {
  isLoading: false,
  userId: null,
  guardUserId: 0,
  centralEmployeeId: 0,
  employeeId: 0,
  storeKey: 0,
  baseHost: '',
  currentEmployee: null,
};

const userInfoReducer = (prevState = initialState, action) => {
  const { type, data = {} } = action;
  const state = prevState;
  switch (type) {
    case GET_SESSION_DATA:
      state.isLoading = true;
      break;
    case GET_SESSION_DATA_SUCCESS:
      state.isLoading = false;
      state.userId = data.info.userId;
      state.employeeId = data.info.employeeId;
      break;
    case GET_EMPLOYEE_DATA:
      state.isLoading = true;
      break;
    case GET_EMPLOYEE_DATA_SUCCESS:
      state.isLoading = false;
      state.currentEmployee = data.employee;
      break;
    default:
      break;
  }
  return state;
};
export default userInfoReducer;
