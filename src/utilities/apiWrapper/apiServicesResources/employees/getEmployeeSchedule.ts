import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { ResponseEmployeeSchedule } from '@/models';

let cancellationToken = null;

export default async (employeeId, date): Promise<ResponseEmployeeSchedule> => {
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
