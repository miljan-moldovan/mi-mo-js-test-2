import { getApiInstance } from '../../api';

export default async (clientId, note) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Client/${clientId}/Note`, note).then(({ data: { response } }) => response);
};
