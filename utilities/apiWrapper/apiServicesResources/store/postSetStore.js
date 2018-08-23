import { getApiInstance } from '../../api';

export default async (storeId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`MobilePos/SetStore/${storeId}`, { newStoreId: storeId })
    .then(({ data: { response } }) => response)
    .catch((err) => {
      if (err && err.response) {
        return err.response.data;
      }

      return null;
    });
};
