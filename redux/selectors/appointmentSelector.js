import { createSelector } from 'reselect';
import { groupBy, filter, flatten } from 'lodash';

import groupedAvailableProvidersSelector from './providersSelector';

const appointmentSelector = state => state.appointmentScreenReducer.appointments;

const appoinmentGroupedByProvider = createSelector(
  appointmentSelector,
  appts => groupBy(appts, appt => appt.employee.id),
);

const getVisibleAppointmentsDataSource = createSelector(
  [appoinmentGroupedByProvider, groupedAvailableProvidersSelector],
  (groupedAppts, groupedAvailableProviders) => flatten(filter(groupedAppts, appts =>
    (groupedAvailableProviders[appts[0].employee.id] ? appts : null))),
);

export default getVisibleAppointmentsDataSource;
