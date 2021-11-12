import { getApiInstance } from '../../api';
import { Client } from '@/models';

export default async (id, contact): Promise<Client> => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Clients/${id}/ContactInformation`, contact).then(({ data: { response } }) => response);
};
