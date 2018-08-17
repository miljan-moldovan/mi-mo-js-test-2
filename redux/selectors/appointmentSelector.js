import { createSelector } from 'reselect';
import { groupBy, filter, flatten } from 'lodash';
import filterOptionsSelector from './filterOptionsSelector';

import groupedAvailableProvidersSelector from './providersSelector';

const appointmentSelector = state => state.appointmentBookReducer.appointments;

const selectedApptId = (state, props) => props.appointmentId;

const appoinmentGroupedByProvider = createSelector(
  appointmentSelector,
  appts => groupBy(appts, appt => (appt.employee ? appt.employee.id : 0)),
);

export const getVisibleAppointmentsDataSource = createSelector(
  [appoinmentGroupedByProvider, groupedAvailableProvidersSelector, filterOptionsSelector],
  (groupedAppts, groupedAvailableProviders, filterOptions) =>
    filter(flatten(filter(groupedAppts, (appts, index) =>
      (groupedAvailableProviders[index] ? appts : null))), (appt) => {
      if (!filterOptions.showFirstAvailable) {
        return !appt.isFirstAvailable ? appt : null;
      }
      return appt;
    }),
);

export const getSelectedAppt = createSelector(
  [appointmentSelector, selectedApptId],
  (appointments, selectedId) => appointments.find(appt => appt.id === selectedId),
);

export default { getVisibleAppointmentsDataSource, getSelectedAppt };
