import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { EmployeeScheduleExceptionGet } from '@/models';

let cancellationToken = null;

export default async (employeeId, date): Promise<EmployeeScheduleExceptionGet> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(
      `Employees/${employeeId}/ScheduleException?startDate=${date}&endDate=${date}&api-version=1`,
      {
        cancelToken: new axios.CancelToken(c => {
          cancellationToken = c;
        }),
      }
    )
    .then(({ data: { response } }) => response);
};
