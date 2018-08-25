import { getApiInstance } from '../../api';

export default async ({ appointmentIds, appointmentCancellation }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Appointment/CancelBulk', { appointmentIds, appointmentCancellation }).then(({ data: { response } }) => response);
};
