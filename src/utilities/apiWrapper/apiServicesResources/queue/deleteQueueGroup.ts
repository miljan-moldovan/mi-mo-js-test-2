import { getApiInstance } from '../../api';

export default async (groupId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.delete(`Queue/Group/${groupId}`).then(({ data: { response } }) => response);
};
