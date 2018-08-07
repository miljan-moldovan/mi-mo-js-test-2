import { createSelector } from 'reselect';
import { groupBy, filter, flatten } from 'lodash';

import groupedAvailableProvidersSelector from './providersSelector';

const appointmentSelector = state => state.appointmentBookReducer.appointments;

const selectedApptId = (state, props) => props.appointmentId;

const appoinmentGroupedByProvider = createSelector(
  appointmentSelector,
  appts => groupBy(appts, appt => appt.employee.id),
);

export const getVisibleAppointmentsDataSource = createSelector(
  [appoinmentGroupedByProvider, groupedAvailableProvidersSelector],
  (groupedAppts, groupedAvailableProviders) => flatten(filter(groupedAppts, appts =>
    (groupedAvailableProviders[appts[0].employee.id] ? appts : null))),
);

export const getSelectedAppt = createSelector(
  [appointmentSelector, selectedApptId],
  (appointments, selectedId) => appointments.find(appt => appt.id === selectedId),
);

export default { getVisibleAppointmentsDataSource, getSelectedAppt };
