import axios from 'axios';
import qs from 'qs';
import { cancelRequest } from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';


let cancellationToken = null;

export default async (includeWaitTimes = true): Promise<any> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance.get(`Queue/Employees`, {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => response);
};
