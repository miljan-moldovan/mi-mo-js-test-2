import { getApiInstance } from '../../api';

export default async (id, rebook) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`AppointmentBook/Rebook/${id}`, rebook).then(({ data: { response } }) => response);
};
