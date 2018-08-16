import { getApiInstance } from '../../api';

export default async () => {
  const apiInstance = await getApiInstance();
  return apiInstance.get('Session/Info').then(({ data: { response } }) => response);
};
