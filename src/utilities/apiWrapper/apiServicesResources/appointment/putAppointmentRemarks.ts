import { getApiInstance } from '../../api';

export default async (id, remarks) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Appointment/${id}/Remarks`, { remarks }).then(({ data }) => data);
};
