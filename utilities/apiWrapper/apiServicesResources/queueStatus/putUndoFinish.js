import { getApiInstance } from '../../api';

export default async (clientQueueItemId) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`QueueStatus/UndoFinish/${clientQueueItemId}`).then(({ data: { response } }) => response);
};
