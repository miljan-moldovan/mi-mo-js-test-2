import axios from 'axios';
import qs from 'qs';
import {cancelRequest} from '@/utilities/helpers/cancelRequest';
import {getApiInstance} from '../../api';

let cancellationToken = null;
let oldQuery = {
  clientId: -1,
  fromDate: '',
  query: {
    skip: -1,
  },
};

export default async ({clientId, fromDate, query}) => {
  const apiInstance = await getApiInstance ();
  const cancel =
    oldQuery.clientId === clientId &&
    oldQuery.fromDate === fromDate &&
    oldQuery.query.skip === query.skip;
  if (cancel) {
    cancelRequest (cancellationToken);
  }
  oldQuery = {clientId, fromDate, query};
  const queryString = qs.stringify (query);
  return apiInstance
    .get (`Clients/${clientId}/Appointments/${fromDate}?${queryString}`, {
      cancelToken: new axios.CancelToken (c => {
        cancellationToken = c;
      }),
    })
    .then (({data}) => data);
};
