import { getApiInstance } from '../../api';

export default async (rebook) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('AppointmentBook/Rebook/Multi', rebook).then(({ data: { response } }) => response);
};
