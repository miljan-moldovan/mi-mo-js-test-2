import apiConstants from '../apiConstants';

const resources = {
  getAppointmentsByDate: {
    path: 'Appointment/:date',
    method: 'get',
    // expiration: apiConstants.expiration,
    disableCache: true,
  },
  postAppointmentMove: {
    path: 'Appointment/:appointmentId/Move',
    method: 'post',
    disableCache: true,
  },
};

export default {
  resources,
};
