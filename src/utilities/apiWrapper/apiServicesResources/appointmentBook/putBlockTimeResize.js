import { getApiInstance } from '../../api';

export default async (id, { newLength }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`AppointmentBook/BlockTime/${id}/Resize`, { newLength }).then(({ data: { response } }) => response);
};
