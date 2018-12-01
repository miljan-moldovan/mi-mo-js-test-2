import { getApiInstance } from '../../api';

function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default async ({ url, username }) => {
  const apiInstance = await getApiInstance();
  let responseObject;
  try {
    const { data } = await apiInstance.post('/MobilePos/ResetPassword', { username });
    responseObject = data;
  } catch (e) {
    responseObject = e.response.data;
  }

  const urlError = url !== 'sportclips';
  let usernameError = false;

  const response = {
    errorMessages: [],
  };

  if (responseObject.result !== 1) {
    usernameError = true;
    response.errorMessages.push(responseObject.userMessage);
  }
  response.success = !usernameError && !urlError;
  response.errors = { usernameError, urlError };

  if (urlError) {
    response.errorMessages.push('Url is incorrect');
  }

  return response;
};
