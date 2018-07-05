import { getApiInstance } from '../../api';

export default async ({ clientId, id }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Client/${clientId}/Note/${id}/Undelete`).then(({ data: { response } }) => response);
};
