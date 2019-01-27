import { getApiInstance } from '../../api';

export default async (id) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Appointment/${id}/CheckOut`)
  .then(({ data: { response } }) => response);
};
