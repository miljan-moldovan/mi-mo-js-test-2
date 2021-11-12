import axios from 'axios';
import qs from 'qs';
import { cancelRequest } from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { PureProvider } from '@/models';

let cancellationToken = null;

export default async (query): Promise<PureProvider> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  const queryString = qs.stringify(query);

  return apiInstance.get(`Employees?${queryString}`, {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => response);
};
