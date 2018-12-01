import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { PureBlockTime } from '@/models';

let cancellationToken = null;

export default async ({ fromDate, toDate }): Promise<PureBlockTime> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`AppointmentBook/${fromDate}/${toDate}/BlockTime`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
