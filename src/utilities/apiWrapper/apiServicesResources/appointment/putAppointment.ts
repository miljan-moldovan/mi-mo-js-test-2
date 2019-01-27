import { getApiInstance } from '../../api';
import { PureAppointment } from '@/models';

export default async (id, appt): Promise<PureAppointment> => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Appointment/${id}`, appt).then(({ data: { response } }) => response);
};
