import OfflineFirstAPI from 'react-native-offline-api';
import apiOptions from './apiOptions';
import apiServices from './apiServices';
import apiConstants from './apiConstants';
import ApiError from './apiError';


const api = new OfflineFirstAPI(apiOptions.conf, apiServices.conf);

function getHeader() {
  const header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-SU-store_id': 'store_id=1',
  };
  return header;
}

function cleanCache(service, callback) {
  if (apiConstants.cleanCache.indexOf(service) > -1) {
    api.clearCache(service);
    if (service in apiConstants.cacheCleaningDependencies) {
      const cacheDependencies = apiConstants.cacheCleaningDependencies[service];
      if (cacheDependencies) {
        for (let i = 0; i < cacheDependencies.length; i += 1) {
          const cacheDependency = cacheDependencies[i];
          api.clearCache(cacheDependency);
        }
      }
    }
  }
  callback();
}

function getError(requestResponse) {
  let message = `Unknown Error ${requestResponse.result}`;

  switch (requestResponse.result) {
    case apiConstants.responsesCodes.NotAuthenticated:
      message = 'NotAuthenticated';
      break;
    case apiConstants.responsesCodes.NoPermission:
      message = 'NoPermission';
      break;
    case apiConstants.responsesCodes.FailedValidation:
      message = 'FailedValidation';
      break;
    case apiConstants.responsesCodes.Exception:
      message = 'Exception';
      break;
    case apiConstants.responsesCodes.NotFound:
      message = 'NotFound';
      break;
    default:
      break;
  }

  return new ApiError(
    message, requestResponse.systemErrorDetail,
    requestResponse.systemErrorStack, requestResponse.systemErrorType,
  );
}

function doRequest(key, parameters, options = {
  retries: 1, rejectCodes: [], delay: 2000, needsAuth: true,
}) {
  let needsAuth = true;

  if (options.needsAuth) {
    needsAuth = options.needsAuth;
  }

  const fetchData = {
    headers: getHeader(needsAuth),
    credentials: 'include',
  };

  if ('body' in parameters) {
    fetchData.fetchOptions = { body: parameters.body };
  }

  if ('path' in parameters) {
    fetchData.pathParameters = parameters.path;
  }

  if ('query' in parameters) {
    fetchData.queryParameters = parameters.query;
  }

  const retries = options.retries;
  const rejectCodes = options.rejectCodes.join(' ');
  let delay;

  if (options.delay) {
    delay = options.delay;
  }

  return new Promise((resolve, reject) => {
    let count = 1;
    const attempt = () => api.fetch(
      key,
      fetchData,
    )
      .then((requestResponse) => {
        const status = 'status' in requestResponse ? response.status.toString() : '200';

        if (rejectCodes.includes(status) && count < retries) {
          count += 1;
          delay ? setTimeout(attempt, delay) : attempt();
        } else if (requestResponse.result === apiConstants.responsesCodes.Success) {
          cleanCache(key, () => { resolve(requestResponse.response); });
        } else {
          reject(getError(requestResponse));
        }
      })
      .catch((error) => {
        if (count < retries) {
          count += 1;
          delay ? setTimeout(attempt, delay) : attempt();
        } else {
          reject(error);
        }
      });
    attempt();
  });
}


export default { doRequest };
