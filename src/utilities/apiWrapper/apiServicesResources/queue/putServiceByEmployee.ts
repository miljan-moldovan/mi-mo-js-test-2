import { getApiInstance } from '../../api';

export default async (serviceId, changeServiceEmployees) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Queue/Service/ByEmployee/${serviceId}`, changeServiceEmployees).then(({ data: { response } }) => response);
};
