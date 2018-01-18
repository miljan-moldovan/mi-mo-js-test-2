// @flow
import e from '../constants/ErrorTypes';

export default function processError(error: Object): Object {
  let type, message;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log('response error' , error.response.data, error.response.status, error.response.headers);
    message = "The server has returned an error. \n"+ (error.response.data && error.response.data.message);
    type = e.SERVER;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log('request error' , error.request);
    message = "Error sending information. Please verify your Internet connection.";
    type = e.NETWORK;
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message, error);
    message = "Internal error sending information. Please try again or contact support.";
    type = e.INTERNAL;
  }
  console.log(error.config);

  return {
    type,
    message,
    error
  }
};
