import { getApiInstance } from '../../api';

export default async (clientId, email) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Clients/${clientId}/Email`, { email }).then(({ data: { response } }) => response);
};
