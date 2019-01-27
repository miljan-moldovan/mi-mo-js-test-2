import { getApiInstance } from '../../api';

export default async (clientQueueItemId, noShow) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/NoShow/${clientQueueItemId}`, noShow)
    .then(({ data: { response } }) => response);
};
