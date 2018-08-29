import { Alert } from 'react-native';
import { getApiInstance } from '../../api';

export default async (clientQueueItemId, data) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/StartService/${clientQueueItemId}`, data)
    .then(({ data: { response } }) => response).catch((error) => {
      const message = error.response.data.userMessage;
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
