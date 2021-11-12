import { getApiInstance } from '../../api';

export default async (queueItemId, serviceEmployeeId, newService) => {
  
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Queue/${queueItemId}/ServiceEmployee/${serviceEmployeeId}/Employee`, newService).then(({ data: { response } }) => response);
};
