// @flow
import axios from 'axios';

import AT from './types';

// import config from '../config';
// const { endpoints } = config;

import processError from '../utilities/processError.js';

export const login = (url: string, username: string, password: string, callback: (success: boolean, err) => void) => async (dispatch: Object => void) => {
  setTimeout(() => { // emulate delay while API isn't ready
    try {
      // const url = endpoints.LOGIN;
      // let { data } = await axios.post(url, { email, password });
      const urlError = url !== 'sportclips';
      const usernameError = username !== 'test';
      const passwordError = password !== 'test';

      if (urlError || usernameError || passwordError) {
        const errObj = {
          response: {
            data: {},
          },
        };

        if (urlError) {
          errObj.response.data.urlError = urlError;
        }

        if (usernameError || passwordError) {
          errObj.response.data.message = 'Invalid username or password. Try u: test p: test';
          errObj.response.data.errors = [
            'Password is 12 chars. minimum',
            'Username and Password don\'t match.',
          ];
          errObj.response.data.loginError = true;
        }
        throw errObj;
      }
      const data = { jws: 'abcxyz' };
      dispatch({
        type: AT.LOGIN_SUCCESS,
        data,
      });
      callback(true);
    } catch (error) {
      const e = processError(error);
      dispatch({
        type: AT.LOGIN_FAILURE,
        data: { errorMessage: e.message },
      });
      callback(false, e, error);
    }
  }, 2000);
};

export const logout = () => ({ type: AT.LOGOUT });
export const enableFingerprintLogin = () => ({ type: AT.FINGERPRINT_ENABLE });
export const disableFingerprintLogin = () => ({ type: AT.FINGERPRINT_DISABLE });
export const updateFingerprintValidationTime = () => ({ type: AT.FINGERPRINT_AUTHENTICATE, data: { fingerprintAuthenticationTime: Date.now() } });
