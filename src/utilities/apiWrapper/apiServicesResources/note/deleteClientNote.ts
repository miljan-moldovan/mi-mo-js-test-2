import { getApiInstance } from '../../api';

export default async ({ clientId, noteId }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.delete(`Clients/${clientId}/Notes/${noteId}`).then(({ data: { response } }) => response);
};
