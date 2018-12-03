import {AsyncStorage} from 'react-native';

import processError from '../../utilities/processError';
import {Login} from '../../utilities/apiWrapper';
import {JWTKEY} from '../../utilities/apiWrapper/api';

export const AT = {
  LOGIN_SUCCESS: 'login/LOGIN_SUCCESS',
  LOGIN_FAILURE: 'login/LOGIN_FAILURE',
  LOGOUT: 'login/LOGOUT',
  FINGERPRINT_ENABLE: 'login/FINGERPRINT_ENABLE',
  FINGERPRINT_DISABLE: 'login/FINGERPRINT_DISABLE',
  FINGERPRINT_AUTHENTICATE: 'login/FINGERPRINT_AUTHENTICATE',
  CHANGE_USERNAME: 'login/CHANGE_USERNAME',
  CHANGE_URL: 'login/CHANGE_URL',
};

export const changeUsername = username => dispatch =>
  dispatch ({
    type: AT.CHANGE_USERNAME,
    data: username,
  });

export const changeURL = url => dispatch =>
  dispatch ({
    type: AT.CHANGE_URL,
    data: url,
  });

export const login = (url, username, password, callback) => async dispatch => {
  try {
    // const url = endpoints.LOGIN;
    // let { data } = await axios.post(url, { email, password });
    let urlError = false;
    const errObj = {
      response: {
        data: {},
      },
    };

    const data = await Login.signIn (url, username, password);
    if (data && data.message === 'Network Error') {
      urlError = true;
      errObj.response.data.urlError = urlError;
    }
    if (data.result !== 1 && !urlError) {
      errObj.response.data.message = data.userMessage;
      errObj.response.data.errors = [data.userMessage];
      errObj.response.data.loginError = true;
    } else if (!urlError) {
      const userToken = {jws: data.response};
      await AsyncStorage.setItem (JWTKEY, data.response);
      dispatch ({
        type: AT.LOGIN_SUCCESS,
        data: userToken,
      });
      callback (true);
    }

    if (
      errObj.response.data.urlError ||
      (errObj.response.data.errors && errObj.response.data.errors.length > 0)
    ) {
      throw errObj;
    }
  } catch (error) {
    const e = processError (error);
    dispatch ({
      type: AT.LOGIN_FAILURE,
      data: {errorMessage: e.message},
    });
    callback (false, e, error);
  }
};

export const logout = () => {
  AsyncStorage.removeItem (JWTKEY);
  return {type: AT.LOGOUT};
};
export const enableFingerprintLogin = () => ({type: AT.FINGERPRINT_ENABLE});
export const disableFingerprintLogin = () => ({type: AT.FINGERPRINT_DISABLE});
export const updateFingerprintValidationTime = () => ({
  type: AT.FINGERPRINT_AUTHENTICATE,
  data: {fingerprintAuthenticationTime: Date.now ()},
});
