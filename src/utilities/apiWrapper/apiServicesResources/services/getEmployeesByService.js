import axios from 'axios';
import qs from 'qs';
import {cancelRequest} from '@/utilities/helpers/cancelRequest';
import {getApiInstance} from '../../api';

let cancellationToken = null;

export default async (serviceId, query) => {
  const queryString = qs.stringify (query);
  const apiInstance = await getApiInstance ();
  cancelRequest (cancellationToken);
  return apiInstance
    .get (`Services/${serviceId}/Employees?${queryString}`, {
      cancelToken: new axios.CancelToken (c => {
        cancellationToken = c;
      }),
    })
    .then (({data: {response}}) => response);
};
