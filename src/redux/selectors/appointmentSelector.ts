import { createSelector } from 'reselect';
import moment from 'moment';
import { groupBy, filter, flatten } from 'lodash';
import filterOptionsSelector from './filterOptionsSelector';
import DateTime from '../../constants/DateTime';
import groupedAvailableProvidersSelector from './providersSelector';
import {
  TYPE_FILTER_PROVIDERS,
  TYPE_FILTER_DESK_STAFF,
  TYPE_PROVIDER,
  PICKER_MODE_WEEK,
  TYPE_FILTTER_RESOURCES,
} from '@/constants/filterTypes';

const appointmentSelector = state => state.appointmentBookReducer.appointments;

const blockTimeSelector = state => state.appointmentBookReducer.blockTimes;

const getProps = (state, props) => props;

const appoinmentGroupedByProvider = createSelector(
  appointmentSelector,
  appts => groupBy(appts, appt => (appt.employee ? appt.employee.id : 0))
);

const getGridView = state => ({
  selectedProvider: state.appointmentBookReducer.selectedProvider,
  pickerMode: state.appointmentBookReducer.pickerMode,
  selectedFilter: state.appointmentBookReducer.selectedFilter,
  startDate: state.appointmentBookReducer.startDate,
});

export const getVisibleAppointmentsDataSource = createSelector(
  [
    appoinmentGroupedByProvider,
    groupedAvailableProvidersSelector,
    filterOptionsSelector,
    getGridView,
  ],
  (groupedAppts, groupedAvailableProviders, filterOptions, gridView) => {
    if (isCanBeUserAndTypeIsNotProvide(gridView)) {
      return checkPickerMode(gridView, groupedAppts, filterOptions);
    }

    if (gridView.selectedFilter === TYPE_FILTTER_RESOURCES) {
      return fiterForFilterEquivalentResources(gridView, groupedAppts, groupedAvailableProviders);
    }

    return filterForOtherCase(groupedAppts, groupedAvailableProviders, filterOptions);
  },
);

const isCanBeUserAndTypeIsNotProvide = (gridView) => {
  const isCanBeOnlyUser = gridView.selectedFilter === TYPE_FILTER_PROVIDERS
    || gridView.selectedFilter === TYPE_FILTER_DESK_STAFF;

  return isCanBeOnlyUser && gridView.selectedProvider !== TYPE_PROVIDER;
};

const checkPickerMode = (gridView, groupedAppts, filterOptions) => {
  if (gridView.pickerMode === PICKER_MODE_WEEK) {
    return filterForPickerModeEquivalentWeek(gridView, groupedAppts, filterOptions);
  }

  return filterForPickerModeNotEquivalentWeek(gridView, groupedAppts, filterOptions);
};

const filterForPickerModeEquivalentWeek = (gridView, groupedAppts, filterOptions) => {
  return filter(
    flatten(groupedAppts[gridView.selectedProvider.id]),
    appt => apptIsFirstAvailable(filterOptions, appt),
  );
};

const filterForPickerModeNotEquivalentWeek = (gridView, groupedAppts, filterOptions) => {
  return filter(
    flatten(groupedAppts[gridView.selectedProvider.id]),
    appt => {
      if (moment(appt.date, DateTime.date).isSame(gridView.startDate, 'day')) {
        return apptIsFirstAvailable(filterOptions, appt);
      }
      return null;
    },
  );
};

const fiterForFilterEquivalentResources = (gridView, groupedAppts, groupedAvailableProviders) => {
  return filter(
    flatten(
      filter(
        groupedAppts,
        (appts, index) => (groupedAvailableProviders[index] ? appts : null),
      ),
    ),
    appt => {
      return appt;
    },
  );
};

const filterForOtherCase = (groupedAppts, groupedAvailableProviders, filterOptions) => {
  return filter(
    flatten(
      filter(
        groupedAppts,
        (appts, index) => (groupedAvailableProviders[index] ? appts : null),
      ),
    ),
    appt => apptIsFirstAvailable(filterOptions, appt),
  );
};

const apptIsFirstAvailable = (filterOptions, appt) => {
  if (!filterOptions.showFirstAvailable) {
    return !appt.isFirstAvailable ? appt : null;
  }
  return appt;
};

export const getSelectedAppt = createSelector(
  [appointmentSelector, blockTimeSelector, getProps],
  (appointments, blockTimes, props) =>
    props.isBlockTime
      ? blockTimes.find(appt => appt.id === props.appointmentId)
      : appointments.find(appt => appt.id === props.appointmentId),
);

export default { getVisibleAppointmentsDataSource, getSelectedAppt };
