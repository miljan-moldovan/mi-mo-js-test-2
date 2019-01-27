import axios from 'axios';
import { getApiInstance } from '../../api';

let cancellationToken = null;

export default async () => {
  const apiInstance = await getApiInstance();
  return apiInstance.get('RecommendationSystem/Products', {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => response);
};
