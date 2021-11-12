import { getApiInstance } from '../../api';

export default async ({ queueItemId, employeeId, serviceId }, newEmployee) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Queue/${queueItemId}/Employee/${employeeId}/Service/${serviceId}/Employee`, newEmployee).then(({ data: { response } }) => response);
};
