import { Alert } from 'react-native';

export const showErrorAlert = (error) => {
  if (error.response) {
    const message = error.response.data.userMessage
    || error.response.data.systemMessage || error.response.data.systemErrorMessage
    || 'Unknown error';
    Alert.alert(
      'Something went wrong',
      message,
      [
        {
          text: 'Ok, got it',
          onPress: () => {},
        },
      ],
      { cancelable: false },
    );
  }
};

export const executeAllPromises = (promises) => {
  // Wrap all Promises in a Promise that will always "resolve"
  const resolvingPromises = promises.map(promise => new Promise(((resolve) => {
    const payload = new Array(2);
    promise.then((result) => {
      payload[0] = result;
    })
      .catch((error) => {
        payload[1] = error;
      })
      .then(() => {
        /*
           * The wrapped Promise returns an array:
           * The first position in the array holds the result (if any)
           * The second position in the array holds the error (if any)
           */
        resolve(payload);
      });
  })));

  const errors = [];
  const results = [];

  // Execute all wrapped Promises
  return Promise.all(resolvingPromises)
    .then((items) => {
      items.forEach((payload) => {
        if (payload[1]) {
          errors.push(payload[1]);
        }
        results.push(payload[0]);
      });

      return {
        errors,
        results,
      };
    });
};

const utils = {
  showErrorAlert, executeAllPromises,
};

export default utils;
