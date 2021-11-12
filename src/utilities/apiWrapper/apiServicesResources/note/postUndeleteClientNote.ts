import { getApiInstance } from '../../api';

export default async ({ clientId, id }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Clients/${clientId}/Notes/${id}/Undelete`).then(({ data: { response } }) => response);
};
