import { getApiInstance } from '../../api';

export default async (queueGroup) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Queue/Group', queueGroup).then(({ data: { response } }) => response);
};
