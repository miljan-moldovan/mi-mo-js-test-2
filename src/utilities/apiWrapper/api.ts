import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Dictionary } from '@/models';

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
      timeout: 30000,
      headers,
    });
  }
  return axiosInstance;
};

const resetApiInstance = () => {
  axiosInstance = null;
};

const getEmployeePhoto = employeeId => `${BASEURL}Employees/${employeeId}/Photo`;

export { getApiInstance, getEmployeePhoto, resetApiInstance };
