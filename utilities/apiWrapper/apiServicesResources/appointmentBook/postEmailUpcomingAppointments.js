import { getApiInstance } from '../../api';

export default async () => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('AppointmentBook/EmailUpcomingAppointments').then(({ data: { response } }) => response);
};
