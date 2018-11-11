import { getApiInstance } from '../../api';

export default async (employeesOrder) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Employees/AppointmentOrder', employeesOrder).then(({ data: { response } }) => response);
};
