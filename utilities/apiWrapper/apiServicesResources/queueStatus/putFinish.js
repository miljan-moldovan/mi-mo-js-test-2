import { getApiInstance } from '../../api';

export default async (clientQueueItemId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/Finish/${clientQueueItemId}`)
    .then(({ data: { response } }) => response);
};
