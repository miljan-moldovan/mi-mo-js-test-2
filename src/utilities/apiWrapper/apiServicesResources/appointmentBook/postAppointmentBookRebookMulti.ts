import { getApiInstance } from '../../api';
import { PureAppointment } from '@/models';

export default async (rebook): Promise<PureAppointment[]> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('AppointmentBook/Rebook/Multi', rebook).then(({ data: { response } }) => response);
};
