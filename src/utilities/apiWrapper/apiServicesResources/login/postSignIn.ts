import { AsyncStorage } from 'react-native';
import { getApiInstance, JWTKEY, resetApiInstance, URLKEY } from '../../api';

export default async (url, username, password) => {
  await AsyncStorage.removeItem(JWTKEY);
  await AsyncStorage.setItem(URLKEY, url);
  resetApiInstance();

  const apiInstance = await getApiInstance();
  return apiInstance({
    url: 'MobilePos/SignIn',
    data: { username, password },
    method: 'POST',
  })
    .then(({ data }) => {
      resetApiInstance();
      return data;
    })
    .catch((err) => {
      if (err && err.response) {
        return err.response.data;
      }

      return err;
    });
};
