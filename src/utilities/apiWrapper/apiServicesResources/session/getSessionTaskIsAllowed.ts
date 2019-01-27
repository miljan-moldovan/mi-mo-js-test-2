import { getApiInstance } from '../../api';

export default async (TaskName): Promise<any> => {
  const apiInstance = await getApiInstance();
  return apiInstance.get(`Session/Task/${TaskName}/IsAllowed`)
    .then(({ data: { response: { data: responseData } } }) => responseData);
};
