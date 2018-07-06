import { getApiInstance } from '../../api';

export default async ({ clientId, id }, note) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Client/${clientId}/Note/${id}`, note).then(({ data: { response } }) => response);
};
