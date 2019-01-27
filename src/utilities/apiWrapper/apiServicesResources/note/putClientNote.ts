import { getApiInstance } from '../../api';

export default async ({ clientId, id }, note) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Clients/${clientId}/Notes/${id}`, note).then(({ data: { response } }) => response);
};
