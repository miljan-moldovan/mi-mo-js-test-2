import { getApiInstance } from '../../api';

export default async (id, merge) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`Clients/${id}/Merge`, merge).then(({ data: { response } }) => response);
};
