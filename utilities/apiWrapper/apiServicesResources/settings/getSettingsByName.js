import { getApiInstance } from '../../api';

export default async (name) => {
  const apiInstance = await getApiInstance();
  return apiInstance.get(`Settings/ByName/${name}`).then(({ data: { response } }) => response);
};
