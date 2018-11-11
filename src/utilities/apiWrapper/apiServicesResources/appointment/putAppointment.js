import { getApiInstance } from '../../api';

export default async (id, appt) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Appointment/${id}`, appt).then(({ data: { response } }) => response);
};
