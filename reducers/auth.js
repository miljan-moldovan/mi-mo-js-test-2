// @flow
import { REHYDRATE } from 'redux-persist/constants';
import AT from '../actions/types.js';

function auth (state: Object = {}, action: Object) {
  console.log('auth reducer. action:', action, '\state: ', state);

  switch (action.type) {
    case AT.LOGIN_SUCCESS:
      console.log('LOGIN_SUCCESS', action.data);
      return {
        ...state,
        loggedIn: true,
        jws: action.data.jws
      };
    case AT.LOGIN_FAILURE:
      console.log('LOGIN_FAILURE', action.data);
      return {
        loggedIn: false,
      };
    case AT.LOGOUT:
      return {};
    case AT.FINGERPRINT_ENABLE:
      return {
        ...state,
        useFingerprintId: true
      }
    case AT.FINGERPRINT_DISABLE:
      return {
        ...state,
        useFingerprintId: false
      }
    case AT.FINGERPRINT_AUTHENTICATE:
      return {
        ...state,
        fingerprintAuthenticationTime: action.data.fingerprintAuthenticationTime
      }
    default:
      return state;
  }
}

export { auth };
