import axios from 'axios';
import qs from 'qs';
import { get, keyBy } from 'lodash';
import cancelRequest from '../../../helpers/cancelRequest';
import { getApiInstance } from '../../api';
import getEmployeesScheduleDates from '../employees/getEmployeesScheduleDates';

let cancellationToken = null;

export default async (date, filterOptions) => {
  const apiInstance = await getApiInstance();
  cancelRequest(cancellationToken);
  const queryString = qs.stringify(filterOptions);
  return apiInstance.get(`AppointmentBook/${date}/Employees?${queryString}`, {
    cancelToken: new axios.CancelToken((c) => {
      cancellationToken = c;
    }),
  }).then(({ data: { response } }) => getEmployeesScheduleDates({ startDate: date, endDate: date, ids: response.map(item => item.id) })
    .then((scheduleResponse) => {
      const scheduleDictionary = keyBy(scheduleResponse, 'key');
      return response.map((item) => {
        const employeeSchedule = get(scheduleDictionary, [item.id, 'value', 0], null);
        return Object.assign({}, item, {
          roomAssignments: employeeSchedule.roomAssignment,
          assistantAssignment: employeeSchedule.assistantAssignment,
        });
      });
    }));
};
