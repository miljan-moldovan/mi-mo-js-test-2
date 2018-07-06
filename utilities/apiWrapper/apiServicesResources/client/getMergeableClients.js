import axios from 'axios';
import cancelRequest from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';

let cancellationToken = null;

export default async (id) => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance.get(`Clients/${id}/MergeableClients`, {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => response);
};
