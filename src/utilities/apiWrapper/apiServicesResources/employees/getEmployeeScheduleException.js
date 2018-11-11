import axios from 'axios';
import cancelRequest from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';

let cancellationToken = null;

export default async (employeeId, date) => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance.get(`Employees/${employeeId}/ScheduleException?startDate=${date}&endDate=${date}&api-version=1`, {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => response);
};
