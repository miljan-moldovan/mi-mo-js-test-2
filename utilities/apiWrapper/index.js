import OfflineFirstAPI from 'react-native-offline-api';
import apiOptions from './apiOptions';
import apiServices from './apiServices';
import apiConstants from './apiConstants';


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

function doRequest(key, parameters, options = {
  retries: 3, rejectCodes: [], delay: 2000, needsAuth: true,
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
      .then((response) => {
        const status = 'status' in response ? response.status.toString() : '200';

        if (rejectCodes.includes(status) && count < retries) {
          count += 1;
          delay ? setTimeout(attempt, delay) : attempt();
        } else {
          cleanCache(key, () => { resolve(response); });
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
