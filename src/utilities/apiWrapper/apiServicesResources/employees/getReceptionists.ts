import axios from 'axios';
import qs from 'qs';
import { cancelRequest } from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';

let cancellationToken = null;

export default async (query = {}) => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  const queryString = qs.stringify(query);
  return apiInstance.get(`Employees/Receptionists?${queryString}`, {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => response);
};
