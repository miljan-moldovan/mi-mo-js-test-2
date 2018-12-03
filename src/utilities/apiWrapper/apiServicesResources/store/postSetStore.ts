import { getApiInstance, resetApiInstance } from '../../api';

export default async (storeId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`MobilePos/SetStore/${storeId}`, { newStoreId: storeId })
    .then((resp) => {
      const { data } = resp;
      resetApiInstance();
      return data;
    })
    .catch((err) => {
      if (err && err.response) {
        return err.response.data;
      }

      return null;
    });
};
