import { getApiInstance } from '../../api';
import { PureBlockTime } from '@/models';

export default async (blockTime): Promise<PureBlockTime> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('AppointmentBook/BlockTime', blockTime)
    .then(({ data: { response } }) => response);
};
