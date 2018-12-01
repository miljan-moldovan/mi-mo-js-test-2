import { getApiInstance } from '../../api';

export default async (id) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Appointment/${id}/CheckIn`).then(({ data: { response } }) => response);
};
