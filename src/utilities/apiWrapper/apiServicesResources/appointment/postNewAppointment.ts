import { getApiInstance } from '../../api';
import { PureAppointment } from '@/models';

export default async (appt): Promise<PureAppointment> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Appointment', appt)
    .then(({ data: { response } }) => response);
};
