import { getApiInstance } from '../../api';

export default async (clientQueueItemId, data) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/StartService/${clientQueueItemId}`, data)
    .then(({ data: { response } }) => response);
};
