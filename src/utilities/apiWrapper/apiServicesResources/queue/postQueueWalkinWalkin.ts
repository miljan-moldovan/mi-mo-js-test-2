import { getApiInstance } from '../../api';
import { QueueItem } from '@/models';

export default async (walkin): Promise<QueueItem> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Queue/Walkin/Walkin', walkin).then(({ data: { response } }) => response);
};
