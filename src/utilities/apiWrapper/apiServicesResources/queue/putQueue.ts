import { getApiInstance } from '../../api';

export default async (queueId, queue) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Queue/${queueId}`, queue).then(({ data: { response } }) => response);
};
