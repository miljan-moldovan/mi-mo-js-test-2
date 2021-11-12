import { getApiInstance } from '../../api';

export default async (queueItemId, serviceEmployeeId, newService) => {
  
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Queue/${queueItemId}/ServiceEmployee/${serviceEmployeeId}/Service`, newService).then(({ data: { response } }) => response);
};
