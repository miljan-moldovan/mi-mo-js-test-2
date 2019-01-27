import { getApiInstance } from '../../api';

export default async (employeeId, schedule) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Employees/${employeeId}/ScheduleException`, schedule).then(({ data: { response } }) => response);
};
