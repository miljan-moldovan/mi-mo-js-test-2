import { getApiInstance } from '../../api';
import { PureBlockTime } from '@/models';

export default async (id, {
  date, employeeId, newTime, roomId = null,
  roomOrdinal = null, resourceId = null, resourceOrdinal = null,
}): Promise<PureBlockTime> => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`AppointmentBook/BlockTime/${id}/Move`, {
    date, employeeId, newTime, roomId, roomOrdinal, resourceId, resourceOrdinal,
  }).then(({ data: { response } }) => response);
};
