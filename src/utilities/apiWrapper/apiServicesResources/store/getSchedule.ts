import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { StoreSchedule } from '@/models';

let cancellationToken = null;

export default async (date): Promise<StoreSchedule> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`Store/Schedule/${date}`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
