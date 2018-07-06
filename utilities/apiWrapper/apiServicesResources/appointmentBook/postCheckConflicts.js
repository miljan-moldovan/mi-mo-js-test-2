import { getApiInstance } from '../../api';

export default async (conflictData) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('AppointmentBook/Conflicts', conflictData).then(({ data: { response } }) => response);
};
