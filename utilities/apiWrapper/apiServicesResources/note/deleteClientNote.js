import { getApiInstance } from '../../api';

export default async ({ clientId, noteId }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.delete(`Client/${clientId}/Note/${noteId}`).then(({ data: { response } }) => response);
};
