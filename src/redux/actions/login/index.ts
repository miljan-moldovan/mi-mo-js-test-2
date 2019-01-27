import { AsyncStorage } from 'react-native';
import { AccessState, Tasks } from '@/constants/Tasks';

import processError from '@//utilities/processError';
import { Login } from '@/utilities/apiWrapper';
import { JWTKEY } from '@/utilities/apiWrapper/api';
import { Maybe } from '@/models';
import * as Session from '@/utilities/apiWrapper/apiServicesResources/session';
import { getRestrictions } from '@/redux/actions/restrictions';

export type DataError = {
  message: string,
  errors: any[],
  loginError: boolean,
  urlError: boolean,
};
const permissionMessage = 'You don\'t have permissions';
export type ErrorObj =
  {
    response: {
      data: DataError;
    },
  };

export const AT = {
  LOGIN_SUCCESS: 'login/LOGIN_SUCCESS',
  RELOGIN_SUCCESS: 'login/RELOGIN_SUCCESS',
  LOGIN_FAILURE: 'login/LOGIN_FAILURE',
  LOGOUT: 'login/LOGOUT',
  FINGERPRINT_ENABLE: 'login/FINGERPRINT_ENABLE',
  FINGERPRINT_DISABLE: 'login/FINGERPRINT_DISABLE',
  FINGERPRINT_AUTHENTICATE: 'login/FINGERPRINT_AUTHENTICATE',
  CHANGE_USERNAME: 'login/CHANGE_USERNAME',
  CHANGE_URL: 'login/CHANGE_URL',
};

export const changeUsername = username => dispatch =>
  dispatch({
    type: AT.CHANGE_USERNAME,
    data: username,
  });

export const changeURL = url => dispatch =>
  dispatch({
    type: AT.CHANGE_URL,
    data: url,
  });

export const login = (url, username, password, callback) => async dispatch => {
  try {
    // const url = endpoints.LOGIN;
    // let { data } = await axios.post(url, { email, password });
    let urlError = false;
    const errObj: ErrorObj = {
      response: {
        data: {} as  DataError,
      },
    };

    const data = await Login.signIn(url, username, password);

    if (data && data.message === 'Network Error') {
      urlError = true;
      errObj.response.data.urlError = urlError;
    }
    if (data.result !== 1 && !urlError) {
      errObj.response.data.message = data.userMessage;
      errObj.response.data.errors = [data.userMessage];
      errObj.response.data.loginError = true;
    } else if (!urlError) {
      await AsyncStorage.setItem(JWTKEY, data.response);

      const permission = await Session.getSessionTaskIsAllowed(Tasks.Mobile_PosApp);
      dispatch(getRestrictions([Tasks.Mobile_FullAppointments, Tasks.Mobile_Appointments]));
      if (permission === AccessState.Denied) {
        errObj.response.data.message = permissionMessage;
        errObj.response.data.errors = [permissionMessage];
        errObj.response.data.loginError = true;
        throw errObj;
      }
      const userToken = { jws: data.response };

      dispatch({
        type: AT.LOGIN_SUCCESS,
        data: { ...userToken, username, url },
      });
      callback(true);
    }

    if (
      errObj.response.data.urlError ||
      (errObj.response.data.errors && errObj.response.data.errors.length > 0)
    ) {
      throw errObj;
    }
  } catch (error) {
    const e = processError(error);
    dispatch({
      type: AT.LOGIN_FAILURE,
      data: { errorMessage: e.message },
    });
    callback(false, e, error);
  }
};

export const checkPasswordCorrect = (password, callback) => async (dispatch, getState) => {
  try {
    const loginUserName = getState().auth.loginUserName;
    const loginUrl = getState().auth.loginUrl;

    const data = await Login.reSignIn(loginUrl, loginUserName, password);

    if (data.result === 1) {
      // Need update JWT
      /*
      const userToken = { jws: data.response };
      await AsyncStorage.setItem(JWTKEY, data.response);
      dispatch({
        type: AT.RELOGIN_SUCCESS,
        data: userToken,
      });
      */
      return callback(true);
    }
    return callback(false);
  } catch (error) {
    return callback(false);
  }
};

export const logout = () => {
  AsyncStorage.removeItem(JWTKEY);
  return { type: AT.LOGOUT };
};
export const enableFingerprintLogin = () => ({ type: AT.FINGERPRINT_ENABLE });
export const disableFingerprintLogin = () => ({ type: AT.FINGERPRINT_DISABLE });
export const updateFingerprintValidationTime = () => ({
  type: AT.FINGERPRINT_AUTHENTICATE,
  data: { fingerprintAuthenticationTime: Date.now() },
});

export interface LoginActions {
  login: (url: string, username: string, password: string, callback: Maybe<any>) => any;
  logout: () => any;
  changeUsername: (username: string) => any;
  changeURL: (url: string) => any;
  enableFingerprintLogin: () => any;
  disableFingerprintLogin: () => any;
  updateFingerprintValidationTime: () => any;
}
