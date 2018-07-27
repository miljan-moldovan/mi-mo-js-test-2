import { getApiInstance } from '../../api';

export default async (id, assignments) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Employees/${id}/RoomAssignments`, assignments).then(({ data: { response } }) => response);
};
