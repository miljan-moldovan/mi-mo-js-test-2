import { getApiInstance } from '../../api';
import { PureAppointment } from '@/models';

export default async (id, resize): Promise<PureAppointment> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Appointment/${id}/Resize`, resize).then(({ data: { response } }) => response);
};
