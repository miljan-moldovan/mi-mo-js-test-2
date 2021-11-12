import { getApiInstance } from '../../api';
import { QueueItem } from '@/models';

export default async (walkin): Promise<QueueItem> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Queue/WalkIn/Client', walkin).then(({ data: { response } }) => response);
};
