import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { ResponseEmployeeSchedule } from '@/models';

let cancellationToken = null;

export default async ({ startDate, endDate, id }): Promise<ResponseEmployeeSchedule> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`Employees/Schedule/${startDate}/${endDate}?ids=${id}`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response[0].value);
};
