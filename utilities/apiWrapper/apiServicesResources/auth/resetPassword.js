// import axios from 'axios';
// import cancelRequest from '../../../helpers/cancelRequest';
// import { getApiInstance } from '../../api';
//
// let cancellationToken = null;
function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default async ({ url, username }) => {
  await delay(100);
  const urlError = url !== 'sportclips';
  const usernameError = username !== 'test';
  const success = !usernameError && !urlError;

  const response = {
    success,
    errors: {},
    errorMessages: [],
  };

  response.errors.usernameError = usernameError;
  response.errors.urlError = urlError;

  if (usernameError) {
    response.errorMessages.push('Username not found');
  }

  if (urlError) {
    response.errorMessages.push('Url is incorrect');
  }

  return response;
};
