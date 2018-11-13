import { getApiInstance } from '../../api';

export default async (blockTime) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post('AppointmentBook/BlockTime', blockTime).then(({ data: { response } }) => response);
};
