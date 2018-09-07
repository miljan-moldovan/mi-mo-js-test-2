import { Alert } from 'react-native';

export const showErrorAlert = (error) => {
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
};

const utils = {
  showErrorAlert,
};

export default utils;
