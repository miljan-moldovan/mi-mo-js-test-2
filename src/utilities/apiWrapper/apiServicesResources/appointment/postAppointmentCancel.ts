import { getApiInstance } from '../../api';
import { PureAppointment } from '@/models';

export default async ({ appointmentIds, appointmentCancellation }): Promise<PureAppointment[]> => {
  const apiInstance = await getApiInstance();
  return apiInstance
    .post('Appointment/CancelBulk', { appointmentIds, appointmentCancellation })
    .then(({ data: { response } }) => response);
};
