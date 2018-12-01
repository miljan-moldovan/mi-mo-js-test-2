import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { AvailabilityItem } from '@/models';

let cancellationToken = null;

export default async (date): Promise<{ timeSlots: AvailabilityItem[] }> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`AppointmentBook/${date}/Availability`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
