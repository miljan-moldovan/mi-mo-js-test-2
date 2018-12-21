import { createSelector } from 'reselect';
import { get } from 'lodash';
import moment from 'moment';
import { getRangeExtendedMoment } from '@/utilities/helpers';

const extendedMoment = getRangeExtendedMoment();

const serviceItemsSelector = state => state.newAppointmentReducer.serviceItems;

const clientSelector = state => state.newAppointmentReducer.client;

const bookedByEmployeeSelector = state =>
  state.newAppointmentReducer.bookedByEmployee;

const mainEmployeeSelector = state => state.newAppointmentReducer.mainEmployee;

const dateSelector = state => state.newAppointmentReducer.date;

const startTimeSelector = state => state.newAppointmentReducer.startTime;

const guestsSelector = state => state.newAppointmentReducer.guests;

const isBookingQuickApptSelector = state =>
  state.newAppointmentReducer.isBookingQuickAppt;

const isQuickRequestedSelector = state =>
  state.newAppointmentReducer.isQuickApptRequested;

const remarksSelector = state => state.newAppointmentReducer.remarks;

const loadingStateSelector = state => ({
  isLoading: state.newAppointmentReducer.isLoading,
  isBooking: state.newAppointmentReducer.isBooking,
});

const conflictsSelector = state => state.newAppointmentReducer.conflicts;

const editTypeSelector = state => state.newAppointmentReducer.editType;

const deletedIdsSelector = state => state.newAppointmentReducer.deletedIds;

const rebookedSelector = state => state.newAppointmentReducer.rebooked;

const newAppointmentInfoSelector = createSelector(
  [
    dateSelector,
    startTimeSelector,
    clientSelector,
    guestsSelector,
    bookedByEmployeeSelector,
    mainEmployeeSelector,
    serviceItemsSelector,
    isBookingQuickApptSelector,
    isQuickRequestedSelector,
    conflictsSelector,
    editTypeSelector,
    deletedIdsSelector,
    remarksSelector,
    rebookedSelector,
  ],
  (
    date,
    startTime,
    client,
    guests,
    bookedByEmployee,
    mainEmployee,
    serviceItems,
    isQuickBooking,
    isQuickApptRequested,
    conflicts,
    editType,
    deletedIds,
    remarks,
    rebooked,
  ) => ({
    date,
    startTime,
    client,
    guests,
    bookedByEmployee,
    mainEmployee,
    serviceItems,
    isQuickBooking,
    isQuickApptRequested,
    conflicts,
    editType,
    deletedIds,
    remarks,
    rebooked,
  }),
);

const getGuestServices = (guestId, serviceItems) =>
  serviceItems.filter(item => item.guestId === guestId && !item.parentId);

const validateGuests = (guests, serviceItems) => {
  if (guests.length) {
    for (let i = 0; i < guests.length; i += 1) {
      const guest = guests[i];
      if (
        !guest.client ||
        !getGuestServices(guest.guestId, serviceItems).length
      ) {
        return false;
      }
    }
  }

  return true;
};

const validateAppointment = ({
                               isLoading,
                               isBooking,
                               date,
                               bookedByEmployee,
                               mainEmployee,
                               client,
                               serviceItems,
                               conflicts,
                               guests,
                             }) =>
  date &&
  bookedByEmployee !== null &&
  mainEmployee !== null &&
  client !== null &&
  serviceItems.length > 0 &&
  !conflicts.length &&
  !isLoading &&
  !isBooking &&
  validateGuests(guests, serviceItems);

const isValidAppointment = createSelector(
  [loadingStateSelector, newAppointmentInfoSelector],
  (
    { isLoading, isBooking },
    {
      date,
      bookedByEmployee,
      mainEmployee,
      client,
      serviceItems,
      conflicts,
      guests,
    },
  ) => {
    const filteredConflicts = conflicts.filter((conflict) => !conflict.canBeSkipped);

    return validateAppointment({
      isLoading,
      isBooking,
      date,
      bookedByEmployee,
      mainEmployee,
      client,
      serviceItems,
      conflicts: filteredConflicts,
      guests,
    });
  },
);

const appointmentLength = createSelector(
  serviceItemsSelector,
  serviceItems => {
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
    serviceItems => {
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
  state => state.appointmentBookReducer.apptGridSettings,
  (startTime, length, { step }) => {
    const addTime = length.asMilliseconds() > 0
      ? length
      : moment.duration(step, 'minute');
    return moment(startTime).add(addTime);
  },
);

const serializeApptItem = (appointment, serviceItem, isQuick = false) => {
  const service = get(serviceItem, 'service', null);
  if (!service) {
    return null;
  }
  const isFirstAvailable = get(service.employee, 'id', 0) === 0;
  const itemData = {
    clientId: serviceItem.guestId
      ? get(service.client, 'id', null)
      : get(appointment.client, 'id', null),
    serviceId: get(service.service, 'id'),
    employeeId: isFirstAvailable ? null : get(service.employee, 'id', null),
    fromTime: moment(service.fromTime, 'HH:mm').format('HH:mm:ss'),
    toTime: moment(service.toTime, 'HH:mm').format('HH:mm:ss'),
    bookBetween: get(service, 'bookBetween', false),
    requested: isQuick
      ? get(appointment, 'isQuickApptRequested', true)
      : get(service, 'requested', true),
    isFirstAvailable,
    bookedByEmployeeId: get(appointment.bookedByEmployee, 'id'),
    roomId: get(service.room, 'id', null),
    roomOrdinal: get(service, 'roomOrdinal', null),
    resourceId: get(service.resource, 'id', null),
    resourceOrdinal: get(service, 'resourceOrdinal', null),
  } as any;
  if (appointment.editType === 'edit') {
    itemData.id = get(serviceItem.service, 'id', null);
  }
  const gapTimeDuration = moment.duration(get(service, 'gapTime', 0));
  const afterTimeDuration = moment.duration(get(service, 'afterTime', 0));
  if (
    moment.isDuration(gapTimeDuration) &&
    gapTimeDuration.asMilliseconds() > 0 &&
    moment.isDuration(afterTimeDuration) &&
    afterTimeDuration.asMilliseconds() > 0 &&
    itemData.bookBetween
  ) {
    itemData.bookBetween = true;
    itemData.gapTime = moment()
      .startOf('day')
      .add(gapTimeDuration)
      .format('HH:mm:ss');
    itemData.afterTime = moment()
      .startOf('day')
      .add(afterTimeDuration)
      .format('HH:mm:ss');
  }

  return itemData;
};

const serializeApptToRequestData = createSelector(
  newAppointmentInfoSelector,
  appt => ({
    dateRequired: true,
    clientId: get(appt.client, 'id', null),
    date: moment(appt.date).format('YYYY-MM-DD'),
    bookedByEmployeeId: get(appt.bookedByEmployee, 'id'),
    rebooked: get(appt, 'rebooked', false),
    remarks: get(appt, 'remarks', ''),
    deletedIds: appt.editType === 'edit' ? appt.deletedIds : null,
    clientInfo: {
      id: get(appt.client, 'id', null),
      email: get(appt.client, 'email', ''),
      phones: get(appt.client, 'phones', []),
      // confirmationType: appt.client.confirmationType
    },
    items: appt.serviceItems.map(srv =>
      serializeApptItem(appt, srv, appt.isQuickBooking),
    ),
  }),
);

const employeeScheduledIntervalsSelector = createSelector(
  mainEmployeeSelector,
  employee => get(employee, 'scheduledIntervals', []),
);

const employeeScheduleChunkedSelector = createSelector(
  [
    state => state.appointmentBookReducer.apptGridSettings,
    employeeScheduledIntervalsSelector,
  ],
  (settings, intervals) => {
    const reduced = intervals.reduce((agg, schedule) => {
      const { step = 15 } = settings;
      const start = moment(schedule.start, 'HH:mm:ss');
      const end = moment(schedule.end, 'HH:mm:ss');
      const range = extendedmoment.range(start, end);
      const chunked = Array.from(range.by('minutes', { step }));
      return [...agg, ...chunked];
    }, []);
    return reduced;
  },
);

const getBookedByEmployee = state => state.userInfoReducer.currentEmployee;

export {
  totalPrice,
  getEndTime,
  appointmentLength,
  isValidAppointment,
  getBookedByEmployee,
  serializeApptToRequestData,
  employeeScheduleChunkedSelector,
};
