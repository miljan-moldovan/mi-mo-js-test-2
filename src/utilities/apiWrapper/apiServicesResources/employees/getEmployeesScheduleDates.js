import axios from 'axios';
import qs from 'qs';
import {cancelRequest} from '@/utilities/helpers/cancelRequest';
import {getApiInstance} from '../../api';

let cancellationToken = null;

export default async ({startDate, endDate, ids}) => {
  const apiInstance = await getApiInstance ();
  const queryString = qs.stringify ({ids});
  cancelRequest (cancellationToken);
  return apiInstance
    .get (`Employees/Schedule/${startDate}/${endDate}?${queryString}`, {
      cancelToken: new axios.CancelToken (c => {
        cancellationToken = c;
      }),
    })
    .then (({data: {response}}) => response);
};
