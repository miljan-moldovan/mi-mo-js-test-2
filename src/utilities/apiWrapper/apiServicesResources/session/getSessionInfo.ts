import { getApiInstance } from '../../api';
import { SessionInfo } from '@/models';

export default async (): Promise<SessionInfo> => {
  const apiInstance = await getApiInstance();
  return apiInstance.get('Session/Info').then(({ data: { response } }) => response);
};
