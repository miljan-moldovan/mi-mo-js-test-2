import { getApiInstance } from '../../api';

export default async (clientQueueItemId, walkout) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/WalkOut/${clientQueueItemId}`, walkout).then(({ data: { response } }) => response);
};
