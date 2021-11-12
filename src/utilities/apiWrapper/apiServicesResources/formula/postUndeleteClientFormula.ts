import { getApiInstance } from '../../api';

export default async ({ clientId, id }) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Clients/${clientId}/Formulas/${id}/Undelete`).then(({ data: { response } }) => response);
};
