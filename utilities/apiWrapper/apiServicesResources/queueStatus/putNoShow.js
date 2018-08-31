import { getApiInstance } from '../../api';

export default async (clientQueueItemId, removalReason) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/NoShow/${clientQueueItemId}`, removalReason)
    .then(({ data: { response } }) => response);
};
