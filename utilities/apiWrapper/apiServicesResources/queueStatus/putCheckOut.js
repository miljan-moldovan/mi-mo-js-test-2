import { getApiInstance } from '../../api';

export default async (clientQueueItemId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/CheckOut/${clientQueueItemId}`)
    .then(({ data: { response } }) => response);
};
