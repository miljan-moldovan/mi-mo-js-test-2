// @flow
import e from '../constants/ErrorTypes';

export default function processError(error: any): any {
  let type,
    message;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    message = 'The server has returned an error. ' + (error.response.data && error.response.data.message);
    type = e.SERVER;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js

    message = 'Error sending information. Please verify your Internet connection.';
    type = e.NETWORK;
  } else {
    // Something happened in setting up the request that triggered an Error

    message = 'Internal error sending information. Please try again or contact support.';
    type = e.INTERNAL;
  }


  return {
    type,
    message,
    error,
  };
}
