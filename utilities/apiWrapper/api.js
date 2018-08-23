// import { NetInfo, AsyncStorage } from 'react-native';
// import OfflineFirstAPI from 'react-native-offline-api';
// import apiOptions from './apiOptions';
// import apiServices from './apiServices';
// import apiConstants from './apiConstants';
// import ApiError from './apiError';
//
// const URLKEY = '@APISettings:url';
// const STOREKEY = '@APISettings:store';
//
// let api = new OfflineFirstAPI(apiOptions.conf, apiServices.conf);
//
// function getHeader() {
//   const header = {
//     'Content-Type': 'application/json',
//     'X-SU-store-key': '1',
//     'X-SU-user-id': '60',
//   };
//   return header;
// }
//
// function cleanCache(service, callback) {
//   const promises = [];
//
//   if (apiConstants.cleanCache.indexOf(service) > -1) {
//     promises.push(api.clearCache(service));
//     if (service in apiConstants.cacheCleaningDependencies) {
//       const cacheDependencies = apiConstants.cacheCleaningDependencies[service];
//       if (cacheDependencies) {
//         for (let i = 0; i < cacheDependencies.length; i += 1) {
//           const cacheDependency = cacheDependencies[i];
//           promises.push(api.clearCache(cacheDependency));
//         }
//       }
//     }
//   }
//
//   Promise.all(promises)
//     .then((data) => {
//       callback(data);
//     })
//     .catch((error) => {
//       callback(error);
//     });
// }
//
// function getError(requestResponse) {
//   let message = `Unknown Error ${requestResponse.result}`;
//
//   switch (requestResponse.result) {
//     case apiConstants.responsesCodes.NotAuthenticated:
//       message = 'NotAuthenticated';
//       break;
//     case apiConstants.responsesCodes.NoPermission:
//       message = 'NoPermission';
//       break;
//     case apiConstants.responsesCodes.FailedValidation:
//       message = 'FailedValidation';
//       break;
//     case apiConstants.responsesCodes.Exception:
//       message = 'Exception';
//       break;
//     case apiConstants.responsesCodes.NotFound:
//       message = 'NotFound';
//       break;
//     default:
//       break;
//   }
//
//   return new ApiError(
//     message, requestResponse.systemErrorDetail,
//     requestResponse.systemErrorStack, requestResponse.systemErrorType, requestResponse.result,
//   );
// }
//
// function doRequest(key, parameters, options = {
//   retries: 1, rejectCodes: [], delay: 2000, needsAuth: true,
// }) {
//   let needsAuth = true;
//
//   if (options.needsAuth) {
//     needsAuth = options.needsAuth;
//   }
//
//   const fetchData = {
//     headers: getHeader(needsAuth),
//   };
//
//   if ('body' in parameters) {
//     const body = (typeof parameters.body === 'string' || parameters.body instanceof String) ? parameters.body : JSON.stringify(parameters.body);
//     fetchData.fetchOptions = { body };
//   }
//
//   if ('path' in parameters) {
//     fetchData.pathParameters = parameters.path;
//   }
//
//   if ('query' in parameters) {
//     fetchData.queryParameters = parameters.query;
//   }
//
//   const retries = options.retries;
//   const rejectCodes = options.rejectCodes.join(' ');
//   let delay;
//
//   if (options.delay) {
//     delay = options.delay;
//   }
//
//   return new Promise(async (resolve, reject) => {
//     let count = 1;
//
//     // bypass default URL if it exists in the store
//     let apiURL,
//       store;
//     try {
//       apiURL = await AsyncStorage.getItem(URLKEY);
//       store = await AsyncStorage.getItem(STOREKEY);
//       if (apiURL !== null || store !== null) {
//         fetchData.headers['X-SU-store-key'] = store;
//         // setting option domains parameter during fetch doesn't work, so we need to reset the API
//         // fetchData.domains = { default: apiURL };
//         apiOptions.conf.domains = { default: apiURL };
//         api = new OfflineFirstAPI(apiOptions.conf, apiServices.conf);
//       }
//     } catch (error) {
//       // Error retrieving data, keep default settings
//
//     }
//
//
//     const attempt = () => api.fetch(
//       key,
//       fetchData,
//     )
//       .then((requestResponse) => {
//         const status = 'status' in requestResponse ? requestResponse.status.toString() : '200';
//
//         if (rejectCodes.includes(status) && count < retries) {
//           count += 1;
//           delay ? setTimeout(attempt, delay) : attempt();
//         } else if (requestResponse.result === apiConstants.responsesCodes.Success) {
//           cleanCache(key, () => { resolve(requestResponse.response); });
//         } else {
//           reject(getError(requestResponse));
//         }
//       })
//       .catch((error) => {
//         if (count < retries) {
//           count += 1;
//           delay ? setTimeout(attempt, delay) : attempt();
//         } else {
//           NetInfo.isConnected.fetch().then((isConnected) => {
//             let errorCode = apiConstants.responsesCodes.UnknownError;
//
//             if (!isConnected) {
//               errorCode = apiConstants.responsesCodes.NetworkError;
//             }
//             reject(new ApiError(
//               error.message, null,
//               error.stack, null, errorCode,
//             ));
//           });
//         }
//       });
//     attempt();
//   });
// }
//
// function getEmployeePhoto(employeeId) {
//   return `${apiOptions.conf.domains.default}/api/v1/Employees/${employeeId}/Photo`;
// }
//
// export default { doRequest, getEmployeePhoto };

import { NetInfo, AsyncStorage } from 'react-native';
import axios from 'axios';
//import { showError } from 'redux/actions';

export const URLKEY = '@APISettings:url';
export const STOREKEY = '@APISettings:store';
export const JWTKEY = '@APISettings:jwt';
let BASEURL = '';
let headers = {
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
        BASEURL = apiURL;
      } else {
        BASEURL = 'http://zenithnew-mob.dev.cicd.salondev.net/api/v1';
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

const getEmployeePhoto = employeeId => `${BASEURL}Employees/${employeeId}/Photo`;

export { getApiInstance, getEmployeePhoto };
