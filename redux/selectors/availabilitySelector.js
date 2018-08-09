import { createSelector } from 'reselect';
import { times } from 'lodash';
import moment from 'moment';

import apptGridSettingsSelector from './apptGridSettingsSelector';

const availabiltiySelector = state => state.appointmentBookReducer.availability;

const getAvailabilityWithGaps = createSelector(
  [availabiltiySelector, apptGridSettingsSelector],
  (availability, apptGridSettings) => {
    const newAvailability = [];
    if (availability) {
      let currentTime = moment(apptGridSettings.minStartTime, 'HH:mm');
      let count = 0;
      times(apptGridSettings.numOfRow, () => {
        const availableData = availability[count];
        if (availableData && availableData.startTime === currentTime.format('HH:mm:ss')) {
          count += 1;
          newAvailability.push(availableData);
        } else {
          newAvailability.push(null);
        }
        currentTime = currentTime.add(apptGridSettings.step, 'm');
      });
    }

    return newAvailability;
  },
);


export default getAvailabilityWithGaps;
