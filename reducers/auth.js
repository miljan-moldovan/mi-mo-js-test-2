// @flow
import { AT } from '../actions/login.js';

const initialState = {
  url: '',
  username: '',
  loggedIn: false,
};

function auth(state: Object = initialState, action: Object) {
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
    case AT.LOGOUT:
      return {};
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
