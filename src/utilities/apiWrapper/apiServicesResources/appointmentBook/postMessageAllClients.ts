import { getApiInstance } from '../../api';

export default async (date, messageText) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`AppointmentBook/${date}/MessageAllClients`, {
    messageText,
  }).then(({ data: { response } }) => response);
};
