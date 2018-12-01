import axios from 'axios';
import {cancelRequest} from '@/utilities/helpers/cancelRequest';
import {getApiInstance} from '../../api';

let cancellationToken = null;

export default async () => {
  const apiInstance = await getApiInstance ();
  cancelRequest (cancellationToken);
  return apiInstance
    .get ('Promotion/ForProducts', {
      cancelToken: new axios.CancelToken (c => {
        cancellationToken = c;
      }),
    })
    .then (({data: {response}}) => response);
};
