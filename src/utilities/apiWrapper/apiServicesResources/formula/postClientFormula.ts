import { getApiInstance } from '../../api';

export default async (clientId, formula) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Clients/${clientId}/Formulas`, formula)
    .then(({ data: { response } }) => response);
};
