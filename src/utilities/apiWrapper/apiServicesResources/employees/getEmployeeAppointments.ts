import axios from 'axios';
import { cancelRequest } from '@/utilities/helpers/cancelRequest';
import { getApiInstance } from '../../api';
import { AppointmentCard } from '@/models';

let cancellationToken = null;

export default async ({ dateFrom, dateTo, id }): Promise<AppointmentCard[]> => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  return apiInstance
    .get(`AppointmentBook/${dateFrom}/${dateTo}/Employee/${id}/Appointments`, {
      cancelToken: new axios.CancelToken(c => {
        cancellationToken = c;
      }),
    })
    .then(({ data: { response } }) => response);
};
