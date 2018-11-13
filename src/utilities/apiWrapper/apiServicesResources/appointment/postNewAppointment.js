import { getApiInstance } from '../../api';

export default async (appt) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Appointment', appt)
    .then(({ data: { response } }) => response);
};
