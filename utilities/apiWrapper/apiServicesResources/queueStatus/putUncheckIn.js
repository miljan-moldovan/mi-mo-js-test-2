import { getApiInstance } from '../../api';

export default async (clientQueueItemId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/UnCheckIn/${clientQueueItemId}`).then(({ data: { response } }) => response);
};
