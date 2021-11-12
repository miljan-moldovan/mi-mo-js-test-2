import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { PureProvider } from '@/models';

let cancellationToken = null;

export default async (id): Promise<PureProvider> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);

  return apiInstance
    .get(`Employees/${id}`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
