import { intersectionWith } from 'lodash';
import { createSelector } from 'reselect';

const receptionistsSelector = state => state.providersReducer.receptionists;
const employeesByServiceSelector = state => state.providersReducer.employeesByService;
const selectedServiceSelector = state => state.providersReducer.selectedService;
// const settingsSelector = state => state.settingsReducer.settings;

const receptionistListSelector = createSelector(
  receptionistsSelector,
  employeesByServiceSelector,
  selectedServiceSelector,
  // settingsSelector,
  (
    receptionists,
    employeesByService,
    selectedService,
    // settings,
  ) => {
    // const showOnlyAvailable = find(settings, { settingName: 'ShowOnlyClockedInEmployeesInClientQueue' });
    const list = receptionists;
    // if (selectedService) {
    //   list = intersectionWith(
    //     receptionists, employeesByService,
    //     (queue, srv) => queue.id === srv.id,
    //   );
    // }
    // if (get(showOnlyAvailable, 'settingValue', false)) {
    //   list = filter(
    //     list,
    //     item => item.state.isClockedIn === true,
    //   );
    // }
    return list;
  },
);
export default receptionistListSelector;
