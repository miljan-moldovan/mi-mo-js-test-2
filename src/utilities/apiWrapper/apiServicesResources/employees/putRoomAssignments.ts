import { getApiInstance } from '../../api';

export default async (id, date, assignments) => {
  const apiInstance = await getApiInstance();
  return apiInstance.put(`Employees/${id}/RoomAssignments/${date}`, assignments).then(({ data: { response } }) => response);
};
