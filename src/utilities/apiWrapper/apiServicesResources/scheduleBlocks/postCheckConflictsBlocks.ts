import { getApiInstance } from '../../api';

export default async (conflictData) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('ScheduleBlocks/Conflicts', conflictData).then(({ data: { response } }) => response);
};
