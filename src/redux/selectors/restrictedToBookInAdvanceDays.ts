import { createSelector } from 'reselect';
import { get } from 'lodash';
import groupedSettingsSelector from './settingsSelector';

const getRestrictedToBookInAdvanceDays = createSelector(
  groupedSettingsSelector,
  (settings) => {
    const enableAppointmentRestrictions = get(settings, "EnableAppointmentRestrictions", false);
    if (enableAppointmentRestrictions) {
      const appointmentRestrictionsDays = get(settings, "AppointmentRestrictionsDays", 0);
      return get(appointmentRestrictionsDays, "[0].settingValue", 0);;
    }

    return null;
  }
);

export default getRestrictedToBookInAdvanceDays;
