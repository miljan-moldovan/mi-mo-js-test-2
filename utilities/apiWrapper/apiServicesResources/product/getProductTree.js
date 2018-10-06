import { getApiInstance } from '../../api';

export default async () => {
  const apiInstance = await getApiInstance();
  return apiInstance.get('RecommendationSystem/Products/Tree', {})
    .then(({ data: { response } }) => response);
};
