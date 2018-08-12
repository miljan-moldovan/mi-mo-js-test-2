import { getApiInstance } from '../../api';

export default async ({ clientId, formulaId }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.delete(`Clients/${clientId}/Formulas/${formulaId}`).then(({ data: { response } }) => response);
};
