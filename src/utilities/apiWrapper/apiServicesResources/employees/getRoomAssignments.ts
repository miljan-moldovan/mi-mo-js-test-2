import qs from 'qs';
import { getApiInstance } from '../../api';

export default async (date, id) => {
  const apiInstance = await getApiInstance();
  const queryString = qs.stringify({ date });
  return apiInstance.get(`Employees/${id}/RoomAssignments?${queryString}`, {})
    .then(({ data: { response } }) => response);
};
