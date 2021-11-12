// @flow
import { AT } from '../actions/login';
import { Maybe, PureProvider } from '@/models';
import { any } from 'prop-types';

const initialState: AuthReducer = {
  url: '',
  username: '',
  loggedIn: false,
  userId: null,
  guardUserId: 0,
  centralEmployeeId: 0,
  employeeId: 0,
  storeKey: 0,
  baseHost: '',
  loginUrl: '',
  loginUserName: '',
  currentEmployee: null,
  jws: null,
};

export interface AuthReducer {
  url: string;
  username: string;
  loggedIn: boolean;
  userId: Maybe<number>;
  guardUserId: number;
  centralEmployeeId: number;
  employeeId: number;
  loginUserName: string,
  storeKey: number;
  loginUrl: string;
  baseHost: string;
  currentEmployee: Maybe<PureProvider>;
  jws: Maybe<any>;
}

function auth(state: AuthReducer = initialState, action): AuthReducer {
  switch (action.type) {
    case AT.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        jws: action.data.jws,
        loginUserName: action.data.username,
        loginUrl: action.data.url,
      };
    case AT.RELOGIN_SUCCESS:
      return {
        ...state,
        jws: action.data.jws,
      };
    case AT.LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
      };
    // case AT.FINGERPRINT_ENABLE:
    //   return {
    //     ...state,
    //     useFingerprintId: true,
    //   };
    // case AT.FINGERPRINT_DISABLE:
    //   return {
    //     ...state,
    //     useFingerprintId: false,
    //   };
    // case AT.FINGERPRINT_AUTHENTICATE:
    //   return {
    //     ...state,
    //     fingerprintAuthenticationTime: action.data
    //       .fingerprintAuthenticationTime,
    //   };
    case AT.CHANGE_USERNAME:
      return { ...state, username: action.data };
    case AT.CHANGE_URL:
      return { ...state, url: action.data };
    default:
      return state;
  }
}

export { auth };
