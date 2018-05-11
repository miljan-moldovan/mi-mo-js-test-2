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
};

export default {
  resources,
};
