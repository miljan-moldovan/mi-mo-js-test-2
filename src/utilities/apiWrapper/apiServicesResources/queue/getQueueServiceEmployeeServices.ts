import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { Service } from '@/models';

let cancellationToken = null;

export default async ({ id, serviceEmployeeId }): Promise<Service[]> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`Queue/${id}/ServiceEmployee/${serviceEmployeeId}/Services`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
