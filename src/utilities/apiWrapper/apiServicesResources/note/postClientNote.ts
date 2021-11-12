import { getApiInstance } from '../../api';

export default async (clientId, note) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Clients/${clientId}/Notes`, note).then(({ data: { response } }) => response);
};
