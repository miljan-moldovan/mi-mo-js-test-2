import { getApiInstance } from '../../api';

export default async (username, password) => {
  const apiInstance = await getApiInstance();
  return apiInstance({
    url: 'MobilePos/SignIn',
    data: { username, password },
    method: 'POST',
  })
    .then(({ data }) => data)
    .catch((err) => {
      if (err && err.response) {
        return err.response.data;
      }

      return null;
    });
};
