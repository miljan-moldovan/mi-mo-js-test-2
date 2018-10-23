import { getApiInstance } from '../../api';

export default async (walkin) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('Queue/Walkin/Walkin', walkin).then(({ data: { response } }) => response);
};
