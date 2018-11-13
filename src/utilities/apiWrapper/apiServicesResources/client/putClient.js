import { getApiInstance } from '../../api';

export default async (id, client) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Clients/${id}`, client).then(({ data: { response } }) => response);
};
