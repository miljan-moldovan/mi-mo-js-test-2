import { getApiInstance } from '../../api';

export default async (turnAway) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('TurnAway', turnAway).then(({ data: { response } }) => response);
};
