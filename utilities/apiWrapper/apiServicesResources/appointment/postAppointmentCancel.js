import { getApiInstance } from '../../api';

export default async (id, { reason, employeeId }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Appointment/${id}/Cancel`, { reason, employeeId }).then(({ data: { response } }) => response);
};
