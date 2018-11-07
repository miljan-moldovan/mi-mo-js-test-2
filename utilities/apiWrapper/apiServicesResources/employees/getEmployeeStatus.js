import axios from 'axios';
import cancelRequest from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';

let cancellationToken = null;

export default async (id, setCancelToken = true) => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);

  let cancelToken = { cancelToken: new axios.CancelToken((c) => { cancellationToken = c; }) };
  cancelToken = setCancelToken ? cancelToken : {};

  return apiInstance.get(`Employees/${id}/Status`, cancelToken).then(({ data: { response } }) => response);
};
