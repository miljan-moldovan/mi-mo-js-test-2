import apiConstants from '../apiConstants';

const resources = {
  postAppointmentBookRebook: {
    path: 'AppointmentBook/Rebook/:appointmentId',
    method: 'post',
    expiration: apiConstants.expiration,
  },
  getAppointmentBookEmployees: {
    path: 'AppointmentBook/:date/Employees',
    method: 'get',
    disableCache: true,
  },
  getAppointmentBookAvailability: {
    path: 'AppointmentBook/:date/Availability',
    method: 'get',
    disableCache: true,
  },
  getStoreSchedule: {
    path: 'Store/Schedule/:date',
    method: 'get',
    disableCache: true,
  },
  getRoomAppointments: {
    path: 'AppointmentBook/:date/Rooms/Appointments',
    method: 'get',
    disableCache: true,
  },
  getResourceAppointments: {
    path: 'AppointmentBook/:date/Resources/Appointments',
    method: 'get',
    disableCache: true,
  },
};

export default {
  resources,
};
