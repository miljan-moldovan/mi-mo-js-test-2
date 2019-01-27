import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { ResponseEmployeeSchedule, EmployeeSchedule } from '@/models';
import { getEmployeesScheduleDates } from '@/utilities/apiWrapper/apiServicesResources/employees/index';

let cancellationToken = null;

export default async (employeeId, date): Promise<EmployeeSchedule> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`Employees/${employeeId}/Schedule/${date}`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
