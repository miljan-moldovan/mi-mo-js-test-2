import { createSelector } from 'reselect';
import moment from 'moment';
import { groupBy, filter, flatten } from 'lodash';
import filterOptionsSelector from './filterOptionsSelector';
import DateTime from '../../constants/DateTime';

import groupedAvailableProvidersSelector from './providersSelector';

const appointmentSelector = state => state.appointmentBookReducer.appointments;

const selectedApptId = (state, props) => props.appointmentId;

const appoinmentGroupedByProvider = createSelector(
  appointmentSelector,
  appts => groupBy(appts, appt => (appt.employee ? appt.employee.id : 0)),
);

const getGridView = state => ({
  selectedProvider: state.appointmentBookReducer.selectedProvider,
  pickerMode: state.appointmentBookReducer.pickerMode,
  selectedFilter: state.appointmentBookReducer.selectedFilter,
  startDate: state.appointmentBookReducer.startDate,
});

export const getVisibleAppointmentsDataSource = createSelector(
  [appoinmentGroupedByProvider, groupedAvailableProvidersSelector, filterOptionsSelector, getGridView],
  (groupedAppts, groupedAvailableProviders, filterOptions, gridView) => {
    if (gridView.selectedFilter === 'providers' && gridView.selectedProvider !== 'all') {
      if (gridView.pickerMode === 'week') {
        return filter(flatten(groupedAppts[gridView.selectedProvider.id]), (appt) => {
          if (!filterOptions.showFirstAvailable) {
            return !appt.isFirstAvailable ? appt : null;
          }
          return appt;
        });
      }
      return filter(flatten(groupedAppts[gridView.selectedProvider.id]), (appt) => {
        if (moment(appt.date, DateTime.date).isSame(gridView.startDate, 'day')) {
          if (!filterOptions.showFirstAvailable) {
            return !appt.isFirstAvailable ? appt : null;
          }
          return appt;
        }
        return null;
      });
    }
    return filter(flatten(filter(groupedAppts, (appts, index) =>
      (groupedAvailableProviders[index] ? appts : null))), (appt) => {
      if (!filterOptions.showFirstAvailable) {
        return !appt.isFirstAvailable ? appt : null;
      }
      return appt;
    });
  },
);

export const getSelectedAppt = createSelector(
  [appointmentSelector, selectedApptId],
  (appointments, selectedId) => appointments.find(appt => appt.id === selectedId),
);

export default { getVisibleAppointmentsDataSource, getSelectedAppt };
