import axios from 'axios';
import cancelRequest from '../../../helpers/cancelRequest';
import {getApiInstance} from '../../api';

let cancellationToken = null;

export default async ({serviceId, employeeId, setCancelToken = true}) => {
  const apiInstance = await getApiInstance ();
  let cancelToken = {
    cancelToken: new axios.CancelToken (c => {
      cancellationToken = c;
    }),
  };
  cancelToken = setCancelToken ? cancelToken : null;

  cancelRequest (cancellationToken);
  return apiInstance
    .get (`Services/${serviceId}/Check/Employee/${employeeId}`, cancelToken)
    .then (({data: {response}}) => response);
};
