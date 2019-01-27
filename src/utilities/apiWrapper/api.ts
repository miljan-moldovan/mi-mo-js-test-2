import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Dictionary } from '@/models';
import store from '../../redux/store';
import { showCustomAlert } from '../../redux/actions/utils';
import { logout } from '../../redux/actions/login';

export const URLKEY = '@APISettings:url';
export const STOREKEY = '@APISettings:store';
export const JWTKEY = '@APISettings:jwt';
let BASEURL = '';
let headers: Dictionary<string> = {
  'Content-Type': 'application/json',
};

let axiosInstance = null;

const getApiInstance = async () => {
  if (!axiosInstance) {
    try {
      const apiURL = await AsyncStorage.getItem(URLKEY);
      const store = await AsyncStorage.getItem(STOREKEY);
      const jwt = await AsyncStorage.getItem(JWTKEY);
      if (apiURL !== null) {
        BASEURL = `https://${apiURL}/api/v1`;
      } else {
        BASEURL = 'https://nw.qa.sg.salondev.net/api/v1';
      }

      if (store !== null) {
        headers = { ...headers, 'X-SU-store-key': store };
      }

      if (jwt !== null) {
        headers = { ...headers, 'X-AuthToken': jwt };
      }
    } catch (error) {
      // Error retrieving data, keep default settings
    }
    axiosInstance = axios.create({
      baseURL: BASEURL,
      timeout: 90000,
      headers,
    });
    axiosInstance.interceptors.response.use(undefined, (error) => {
      const sessionExpired =
        error.response &&
        error.response.status === 401;

      if (sessionExpired && store.getState().auth.loggedIn && !/^((.*)(\/SignIn$))/.test(error.request.responseURL)) {
        const onPress = () => store.dispatch(logout());
        const text = {
          title: 'Session expired',
          button: 'Ok',
          message: 'You need to reauthenticate',
        };

        showCustomAlert(text, onPress);
      }
      return Promise.reject(error);
    });
  }
  return axiosInstance;
};

const resetApiInstance = () => {
  axiosInstance = null;
};

const updateJWT = (jwt) => {
  axiosInstance.defaults.headers['X-AuthToken'] = jwt;
};


const getEmployeePhoto = employeeId => `${BASEURL}Employees/${employeeId}/Photo`;

export { getApiInstance, getEmployeePhoto, resetApiInstance, updateJWT };
