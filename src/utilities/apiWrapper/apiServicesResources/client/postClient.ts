import { getApiInstance } from '../../api';
import { ClientCreateResponse } from '@/models';

export default async (client): Promise<ClientCreateResponse> => {
  const apiInstance = await getApiInstance();
  return apiInstance.put('Clients', client).then(({ data: { response } }) => response);
};
