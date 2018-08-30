import { Alert } from 'react-native';
import { getApiInstance } from '../../api';

export default async (date, employeeId, messageText) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`AppointmentBook/${date}/Employee/${employeeId}/MessageClients`, {
    messageText,
  }).then(({ data: { response } }) => response).catch((error) => {
    const message = error.response.data.userMessage
    || error.response.data.systemMessage || error.response.data.systemErrorMessage;

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
  });
};
