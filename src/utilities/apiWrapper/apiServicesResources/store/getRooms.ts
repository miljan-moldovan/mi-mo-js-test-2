import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { StoreRoom } from '@/models';

let cancellationToken = null;

export default async (): Promise<StoreRoom[]> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get('Store/Rooms', {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
