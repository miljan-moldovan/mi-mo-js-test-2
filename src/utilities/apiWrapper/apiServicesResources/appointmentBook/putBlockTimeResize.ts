import { getApiInstance } from '../../api';
import { PureBlockTime } from '@/models';

export default async (id, { newLength }): Promise<PureBlockTime> => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`AppointmentBook/BlockTime/${id}/Resize`, { newLength })
    .then(({ data: { response } }) => response);
};
