import { createSelector } from 'reselect';
import {
  get,
  isNil,
} from 'lodash';
import moment from 'moment';

const serviceItemsSelector = state => state.newAppointmentReducer.serviceItems;

const clientSelector = state => state.newAppointmentReducer.client;

const bookedByEmployeeSelector = state => state.newAppointmentReducer.bookedByEmployee;

const dateSelector = state => state.newAppointmentReducer.date;

const startTimeSelector = state => state.newAppointmentReducer.startTime;

const guestsSelector = state => state.newAppointmentReducer.guests;

const isQuickRequestedSelector = state => state.newAppointmentReducer.isQuickApptRequested;

const newAppointmentInfoSelector = createSelector(
  [
    dateSelector,
    startTimeSelector,
    clientSelector,
    guestsSelector,
    bookedByEmployeeSelector,
    serviceItemsSelector,
    isQuickRequestedSelector,
  ],
  (date, startTime, client, guests, bookedByEmployee, serviceItems, isQuickApptRequested) => ({
    date, startTime, client, guests, bookedByEmployee, serviceItems, isQuickApptRequested,
  }),
);

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

const totalPrice = createSelector(
  serviceItemsSelector,
  (serviceItems) => {
    const price = serviceItems.reduce((currentPrice, serviceItem) => {
      const service = serviceItem.service || { service: null };
      if (service.service && service.service.price) {
        return currentPrice + service.service.price;
      }
      return currentPrice;
    }, 0);
    return price;
  },
);

const getEndTime = createSelector(
  startTimeSelector,
  appointmentLength,
  (startTime, length) => moment(startTime).add(length),
);

const serializeApptItem = (appointment, serviceItem, isQuick = false) => {
  const service = get(serviceItem, 'service', null);
  if (!service) {
    return;
  }
  const isFirstAvailable = get(service.employee, 'isFirstAvailable', false);
  const itemData = {
    clientId: serviceItem.guestId ? get(service.client, 'id') : get(appointment.client, 'id'),
    serviceId: get(service.service, 'id'),
    employeeId: isFirstAvailable ? null : get(service.employee, 'id', null),
    fromTime: moment(service.fromTime, 'HH:mm').format('HH:mm:ss'),
    toTime: moment(service.toTime, 'HH:mm').format('HH:mm:ss'),
    bookBetween: get(service, 'bookBetween', false),
    requested: isQuick ? get(appointment, 'isQuickApptRequested', true) : get(service, 'requested', true),
    isFirstAvailable,
    bookedByEmployeeId: get(appointment.bookedByEmployee, 'id'),
    roomId: get(service.room, 'id', null),
    roomOrdinal: get(service, 'roomOrdinal', null),
    resourceId: get(service.resource, 'id', null),
    resourceOrdinal: get(service, 'resourceOrdinal', null),
  };

  if (!isNil(service.gapTime)) {
    itemData.bookBetween = true;
    itemData.gapTime = moment().startOf('day').add(service.gapTime, 'minutes').format('HH:mm:ss');
    itemData.afterTime = moment().startOf('day').add(service.afterTime, 'minutes').format('HH:mm:ss');
  }

  return itemData;
};

const serializeApptToRequestData = (isQuick = false) => createSelector(
  [
    newAppointmentInfoSelector,
  ],
  appt => ({
    dateRequired: true,
    date: moment(appt.date).format('YYYY-MM-DD'),
    bookedByEmployeeId: get(appt.bookedByEmployee, 'id'),
    rebooked: get(appt, 'rebooked', false),
    remarks: get(appt, 'remarks', ''),
    // displayColor: appt.displayColor,
    clientInfo: {
      id: get(appt.client, 'id'),
      email: get(appt.client, 'email', ''),
      phones: get(appt.client, 'phones', []),
      // confirmationType: appt.client.confirmationType
    },
    items: appt.serviceItems.map(srv => serializeApptItem(appt, srv, isQuick)),
  }),
);

export {
  totalPrice,
  getEndTime,
  appointmentLength,
  serializeApptToRequestData,
};
