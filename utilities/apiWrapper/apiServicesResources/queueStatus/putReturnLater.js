import { getApiInstance } from '../../api';

export default async (clientQueueItemId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/ReturnLater/${clientQueueItemId}`).then(({ data: { response } }) => response);
};
