import axios from 'axios';
import cancelRequest from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';

let cancellationToken = null;

export default async ({ id, idEmployee }) => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance.get(`Queue/${id}/Employee/${idEmployee}/Services`, {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => response);
};
