import { getApiInstance, updateJWT } from '../../api';

export default async (url, username, password) => {
  const apiInstance = await getApiInstance();
  return apiInstance({
    url: 'MobilePos/SignIn',
    data: { username, password },
    method: 'POST',
  })
    .then(({ data }) => {
      // Need update JWT
      // updateJWT(data.response);
      return data;
    })
    .catch((err) => {
      if (err && err.response) {
        return err.response.data;
      }

      return err;
    });
};
