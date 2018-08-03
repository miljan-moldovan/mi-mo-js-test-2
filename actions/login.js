// @flow
import processError from '../utilities/processError';

export const AT = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  FINGERPRINT_ENABLE: 'FINGERPRINT_ENABLE',
  FINGERPRINT_DISABLE: 'FINGERPRINT_DISABLE',
  FINGERPRINT_AUTHENTICATE: 'FINGERPRINT_AUTHENTICATE',
  CHANGE_USERNAME: 'CHANGE_USERNAME',
  CHANGE_URL: 'CHANGE_URL',
};

export const changeUsername = (username: string) => (dispatch: Object => void) => {
  dispatch({
    type: AT.CHANGE_USERNAME,
    data: username,
  });
};

export const changeURL = (url: string) => (dispatch: Object => void) => {
  dispatch({
    type: AT.CHANGE_URL,
    data: url,
  });
};

export const login = (
  url: string,
  username: string,
  password: string,
  callback: (success: boolean, err:Error) => void,
) =>
  async (dispatch: Object => void) => {
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
export const updateFingerprintValidationTime = () => (
  { type: AT.FINGERPRINT_AUTHENTICATE, data: { fingerprintAuthenticationTime: Date.now() } });
