import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { StoreScheduleException, EmployeeScheduleException } from '@/models';

let cancellationToken = null;

export default async ({ fromDate, toDate }): Promise<StoreScheduleException[] | EmployeeScheduleException[]> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`Store/ScheduleExceptions/${fromDate}/${toDate}`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
