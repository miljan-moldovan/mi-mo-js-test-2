import { getApiInstance } from '../../api';

export default async ({ clientId, id }, formula) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Clients/${clientId}/Formulas/${id}`, formula).then(({ data: { response } }) => response);
};
