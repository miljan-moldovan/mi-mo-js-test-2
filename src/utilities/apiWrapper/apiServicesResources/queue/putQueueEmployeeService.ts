import { getApiInstance } from '../../api';

export default async ({ queueItemId, employeeId, serviceId }, newService) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Queue/${queueItemId}/Employee/${employeeId}/Service/${serviceId}/Service`, newService)
    .then(({ data: { response } }) => response);
};
