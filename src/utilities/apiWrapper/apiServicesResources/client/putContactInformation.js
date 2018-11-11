import { getApiInstance } from '../../api';

export default async (id, contact) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Clients/${id}/ContactInformation`, contact).then(({ data: { response } }) => response);
};
