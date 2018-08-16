import { getApiInstance } from '../../api';

export default async (recommend) => {
  const apiInstance = await getApiInstance();
  return apiInstance
    .post('RecommendationSystem/Recommend', recommend)
    .then(({ data: { response } }) => response);
};
