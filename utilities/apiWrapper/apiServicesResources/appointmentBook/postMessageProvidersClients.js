import { getApiInstance } from '../../api';

export default async (date, employeeId, messageText) => {
  const apiInstance = await getApiInstance();
  return apiInstance.post(`AppointmentBook/${date}/Employee/${employeeId}/MessageClients`, {
    messageText,
  }).then(({ data: { response } }) => response);
};
