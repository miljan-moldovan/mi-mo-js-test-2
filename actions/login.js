// @flow
import axios from 'axios';

import AT from './types';

// import config from '../config';
// const { endpoints } = config;

import processError from '../utilities/processError.js';

export const login = (username: string, password: string, callback: (success: boolean, message: ?string) => void)  => async (dispatch: Object => void) => {
  setTimeout(() => { // emulate delay while API isn't ready
    try {
      // const url = endpoints.LOGIN;
      // let { data } = await axios.post(url, { email, password });
      if (username != 'test' || password != 'test') {
        throw { response: { data: { message: 'Invalid password. Try u: test p: test' } } };
      }
      let data = { jws: 'abcxyz'};
      console.log('login ', data);
      dispatch({
        type: AT.LOGIN_SUCCESS,
        data
      });
      callback(true);
    } catch (error) {
      console.log('Login error', error);
      const e = processError(error);
      dispatch({
        type: AT.LOGIN_FAILURE,
        data: { errorMessage: e.message }
      });
      callback(false, e.message, error);
    }
  }, 2000);
};

export const logout = () => ({ type: AT.LOGOUT });
export const enableFingerprintLogin = () => ({ type: AT.FINGERPRINT_ENABLE });
export const disableFingerprintLogin = () => ({ type: AT.FINGERPRINT_DISABLE });
export const updateFingerprintValidationTime = () => ({ type: AT.FINGERPRINT_AUTHENTICATE, data: { fingerprintAuthenticationTime: Date.now() } });
