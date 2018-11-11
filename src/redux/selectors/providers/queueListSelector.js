import { get, find, filter, intersectionWith } from 'lodash';
import { createSelector } from 'reselect';

const queueEmployeesSelector = state => state.providersReducer.queueEmployees;
const employeesByServiceSelector = state => state.providersReducer.employeesByService;
const selectedServiceSelector = state => state.providersReducer.selectedService;
const settingsSelector = state => state.settingsReducer.settings;

const queueListSelector = createSelector(
  queueEmployeesSelector,
  employeesByServiceSelector,
  selectedServiceSelector,
  settingsSelector,
  (
    queueEmployees,
    employeesByService,
    selectedService,
    settings,
  ) => {
    const showOnlyAvailable = find(settings, { settingName: 'ShowOnlyClockedInEmployeesInClientQueue' });
    let list = queueEmployees;
    if (selectedService) {
      list = intersectionWith(
        queueEmployees, employeesByService,
        (queue, srv) => queue.id === srv.id,
      );
    }
    if (get(showOnlyAvailable, 'settingValue', false)) {
      list = filter(
        list,
        item => item.state.isClockedIn === true,
      );
    }
    return list;
  },
);
export default queueListSelector;
