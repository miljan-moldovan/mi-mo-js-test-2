import { getApiInstance } from '../../api';
import { PureAppointment } from '@/models';

export default async (id, rebook): Promise<PureAppointment> => {
  const apiInstance = await getApiInstance();
  return apiInstance
    .post(`AppointmentBook/Rebook/${id}`, rebook)
    .then(({ data: { response } }) => response);
};
