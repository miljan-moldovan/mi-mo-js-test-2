import { getApiInstance } from '../../api';
import { PureProvider } from '@/models';

export default async (employeesOrder): Promise<PureProvider[]> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Employees/AppointmentOrder', employeesOrder).then(({ data: { response } }) => response);
};
