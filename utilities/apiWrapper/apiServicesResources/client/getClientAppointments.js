import axios from 'axios';
import qs from 'qs';
//import cancelRequest from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';

//let cancellationToken = null;

export default async ({ clientId, fromDate, query }) => {
  const apiInstance = await getApiInstance();
  //cancelRequest(cancellationToken);
  const queryString = qs.stringify(query);
  return apiInstance.get(`Clients/${clientId}/Appointments/${fromDate}?${queryString}`, {
    // cancelToken: new axios.CancelToken((c) => {
    //   cancellationToken = c;
    // }),
  }).then(({ data }) => data);
};
