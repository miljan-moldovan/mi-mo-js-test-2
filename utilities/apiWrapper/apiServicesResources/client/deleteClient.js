import { getApiInstance } from '../../api';

export default async ({ clientId }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.delete(`Clients/${clientId}`).then(({ data: { response } }) => response);
};
