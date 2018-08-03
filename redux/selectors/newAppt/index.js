import { createSelector } from 'reselect';
import {
  get,
  isNil,
} from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import apptGridSettingsSelector from '../apptGridSettingsSelector';

const moment = extendMoment(Moment);

const serviceItemsSelector = state => state.newAppointmentReducer.serviceItems;

const clientSelector = state => state.newAppointmentReducer.client;

const bookedByEmployeeSelector = state => state.newAppointmentReducer.bookedByEmployee;

const dateSelector = state => state.newAppointmentReducer.date;

const startTimeSelector = state => state.newAppointmentReducer.startTime;

const guestsSelector = state => state.newAppointmentReducer.guests;

const isBookingQuickApptSelector = state => state.newAppointmentReducer.isBookingQuickAppt;

const isQuickRequestedSelector = state => state.newAppointmentReducer.isQuickApptRequested;

const loadingStateSelector = state => ({
  isLoading: state.newAppointmentReducer.isLoading,
  isBooking: state.newAppointmentReducer.isBooking,
});

const conflictsSelector = state => state.newAppointmentReducer.conflicts;

const newAppointmentInfoSelector = createSelector(
  [
    dateSelector,
    startTimeSelector,
    clientSelector,
    guestsSelector,
    bookedByEmployeeSelector,
    serviceItemsSelector,
    isBookingQuickApptSelector,
    isQuickRequestedSelector,
    conflictsSelector,
  ],
  (
    date, startTime, client, guests, bookedByEmployee,
    serviceItems, isQuickBooking, isQuickApptRequested, conflicts,
  ) => ({
    date,
    startTime,
    client,
    guests,
    bookedByEmployee,
    serviceItems,
    isQuickBooking,
    isQuickApptRequested,
    conflicts,
  }),
);

const isValidAppointment = createSelector(
  [
    loadingStateSelector,
    newAppointmentInfoSelector,
  ],
  (
    { isLoading, isBooking },
    {
      date, bookedByEmployee, client, serviceItems, conflicts,
    },
  ) => (
      date &&
      bookedByEmployee !== null &&
      client !== null &&
      serviceItems.length > 0 &&
      !conflicts.length > 0 &&
      !isLoading &&
      !isBooking
    ),
);

const appointmentLength = createSelector(
  serviceItemsSelector,
  (serviceItems) => {
    const duration = serviceItems.reduce((agg, serviceItem) => {
      const service = serviceItem.service || { service: null };
      if (service && service.length) {
        return agg + service.length.asMinutes();
      }
      return agg;
    }, 0);
    return moment.duration(duration, 'minutes');
  },
);

const totalPrice = createSelector(
  serviceItemsSelector,
  createSelector(
    state => state,
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
  ),
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

const serializeApptToRequestData = createSelector(
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
    items: appt.serviceItems.map(srv => serializeApptItem(appt, srv, appt.isQuickBooking)),
  }),
);

const employeeScheduledIntervalsSelector = createSelector(
  bookedByEmployeeSelector,
  employee => get(employee, 'scheduledIntervals', null),
);

const employeeScheduleChunkedSelector = createSelector(
  [apptGridSettingsSelector, employeeScheduledIntervalsSelector],
  (settings, intervals) => {
    const reduced = intervals.reduce((agg, schedule) => {
      const { step = 15 } = settings;
      const start = moment(schedule.start, 'HH:mm:ss');
      const end = moment(schedule.end, 'HH:mm:ss');
      const range = moment.range(start, end);
      const chunked = Array.from(range.by('minutes', { step }));
      return [...agg, ...chunked];
    }, []);
    return reduced;
  },
);

export {
  totalPrice,
  getEndTime,
  appointmentLength,
  isValidAppointment,
  serializeApptToRequestData,
  employeeScheduleChunkedSelector,
};
