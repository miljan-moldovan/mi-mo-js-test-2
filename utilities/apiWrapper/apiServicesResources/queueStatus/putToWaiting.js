import { getApiInstance } from '../../api';

export default async (clientQueueItemId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/ToWaiting/${clientQueueItemId}`)
    .then(({ data: { response } }) => response);
};
