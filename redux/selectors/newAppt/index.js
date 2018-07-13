import { createSelector } from 'reselect';
import moment from 'moment';

const serviceItemsSelector = state => state.newAppointmentReducer.serviceItems;

const appointmentLength = createSelector(
  serviceItemsSelector,
  (serviceItems) => {
    const duration = serviceItems.reduce((agg, serviceItem) => {
      const service = serviceItem.service || { service: null };
      if (service.service && service.service.maxDuration) {
        return agg.add(service.service.maxDuration);
      }
      return agg;
    }, moment.duration());
    return duration;
  },
);

const startTimeSelector = state => state.newAppointmentReducer.startTime;

const getEndTime = createSelector(
  startTimeSelector,
  appointmentLength,
  (startTime, length) => moment(startTime).add(length),
);
export {
  appointmentLength,
  getEndTime,
};
