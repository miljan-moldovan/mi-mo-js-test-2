import axios from 'axios';
import qs from 'qs';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { ServiceCategories } from '@/models';

let cancellationToken = null;

export default async (query): Promise<ServiceCategories[]> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  const queryString = qs.stringify(query);
  return apiInstance
    .get(`Services/Tree?${queryString}`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
