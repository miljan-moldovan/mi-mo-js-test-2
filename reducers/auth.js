// @flow
import { AT } from '../actions/login';
import {
  GET_SESSION_DATA,
  GET_SESSION_DATA_SUCCESS,
  GET_SESSION_DATA_FAILED,
  GET_EMPLOYEE_DATA,
  GET_EMPLOYEE_DATA_SUCCESS,
  GET_EMPLOYEE_DATA_FAILED,
} from '../actions/user';

const initialState = {
  url: '',
  username: '',
  loggedIn: false,
  userId: null,
  guardUserId: 0,
  centralEmployeeId: 0,
  employeeId: 0,
  storeKey: 0,
  baseHost: '',
  currentEmployee: null,
};

function auth(state = initialState, action) {
  switch (action.type) {
    case AT.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        jws: action.data.jws,
      };
    case AT.LOGIN_FAILURE:
      return {
        loggedIn: false,
      };
    case AT.FINGERPRINT_ENABLE:
      return {
        ...state,
        useFingerprintId: true,
      };
    case AT.FINGERPRINT_DISABLE:
      return {
        ...state,
        useFingerprintId: false,
      };
    case AT.FINGERPRINT_AUTHENTICATE:
      return {
        ...state,
        fingerprintAuthenticationTime: action.data.fingerprintAuthenticationTime,
      };
    case AT.CHANGE_USERNAME:
      return { ...state, username: action.data };
    case AT.CHANGE_URL:
      return { ...state, url: action.data };
    default:
      return state;
  }
}

export { auth };
