import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { BlockType } from '@/models';

let cancellationToken = null;

export default async (): Promise<BlockType[]> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get('Store/BlockTypes', {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
