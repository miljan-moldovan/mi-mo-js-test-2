import { getApiInstance } from '../../api';

export default async (id, resize) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Appointment/${id}/Resize`, resize).then(({ data: { response } }) => response);
};
