import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { ServiceCheck } from '@/models';

let cancellationToken = null;

export default async ({ serviceId, setCancelToken = true }): Promise<ServiceCheck> => {
  const apiInstance = await getApiInstance();
  let cancelToken = {
    cancelToken: new axios.CancelToken(c => {
      cancellationToken = c;
    }),
  };
  cancelToken = setCancelToken ? cancelToken : null;

  cancelRequest(cancellationToken);
  return apiInstance
    .get(`Services/${serviceId}/Check`, cancelToken)
    .then(({ data: { response } }) => response);
};
