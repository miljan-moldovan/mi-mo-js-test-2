import { getApiInstance } from '../../api';
import { ClientEditResponse } from '@/models';

export default async (id, client): Promise<ClientEditResponse> => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Clients/${id}`, client).then(({ data: { response } }) => response);
};
