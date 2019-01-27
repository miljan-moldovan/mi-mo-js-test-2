import { getApiInstance } from '../../api';
import { PureAppointment } from '@/models';

export default async (id, move): Promise<PureAppointment> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Appointment/${id}/Move`, move).then(({ data: { response } }) => response);
};
