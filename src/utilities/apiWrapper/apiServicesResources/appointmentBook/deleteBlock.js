import {getApiInstance} from '../../api';

export default async blockTimeId => {
  const apiInstance = await getApiInstance ();
  return apiInstance
    .delete (`AppointmentBook/BlockTime/${blockTimeId}/Cancel`)
    .then (({data: {response}}) => response);
};
