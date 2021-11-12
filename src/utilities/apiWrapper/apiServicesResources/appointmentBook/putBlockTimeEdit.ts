import { getApiInstance } from '../../api';
import { PureBlockTime } from '@/models';

export default async (id, {
  date, employeeId, fromTime, toTime,
  notes, reasonId, bookedByEmployeeId,
}): Promise<PureBlockTime> => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`AppointmentBook/BlockTime/${id}`, {
    date, employeeId, fromTime, toTime, reasonId, notes, bookedByEmployeeId,
  }).then(({ data: { response } }) => response);
};
