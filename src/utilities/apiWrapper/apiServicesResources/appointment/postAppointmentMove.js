import { getApiInstance } from '../../api';

export default async (id, move) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Appointment/${id}/Move`, move).then(({ data: { response } }) => response);
};
