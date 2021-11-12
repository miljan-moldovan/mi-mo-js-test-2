import { getApiInstance } from '../../api';

export default async ({ groupId, clientQueueId }, groupLeader) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Queue/Group/${groupId}/Leader/${clientQueueId}`, groupLeader).then(({ data: { response } }) => response);
};
