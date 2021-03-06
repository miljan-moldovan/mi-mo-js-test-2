import axios from 'axios';
import qs from 'qs';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { Client } from '@/models';

let cancellationToken = null;
let oldQuery = {
  'nameFilter.FilterValue': '',
  'nameFilter.Skip': -1,
};

export default async (query): Promise<Client> => {
  const apiInstance = await getApiInstance();
  const cancel =
    oldQuery['nameFilter.FilterValue'] === query['nameFilter.FilterValue'] &&
    oldQuery['nameFilter.Skip'] === query['nameFilter.Skip'];
  if (cancel) {
    cancelRequest(cancellationToken);
  }
  oldQuery = query;
  const queryString = qs.stringify(query);
  return apiInstance
    .get(`Clients?${queryString}`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data }) => data);
};
