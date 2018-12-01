import { getApiInstance } from '../../api';
import { Conflict } from '@/models';

export default async (conflictData): Promise<Conflict[]> => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('AppointmentBook/Conflicts', conflictData).then(({ data: { response } }) => response);
};
