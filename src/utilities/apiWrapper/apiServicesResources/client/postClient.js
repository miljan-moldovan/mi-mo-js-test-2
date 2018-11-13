import { getApiInstance } from '../../api';

export default async (client) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put('Clients', client).then(({ data: { response } }) => response);
};
