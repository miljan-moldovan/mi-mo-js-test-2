import axios from 'axios';
import {cancelRequest} from '@/utilities/helpers/cancelRequest';
import {getApiInstance} from '../../api';

let cancellationToken = null;

export default async ({id, serviceEmployeeId}) => {
  const apiInstance = await getApiInstance ();
  cancelRequest (cancellationToken);
  return apiInstance
    .get (`Queue/${id}/ServiceEmployee/${serviceEmployeeId}/Services`, {
      cancelToken: new axios.CancelToken (c => {
        cancellationToken = c;
      }),
    })
    .then (({data: {response}}) => response);
};
