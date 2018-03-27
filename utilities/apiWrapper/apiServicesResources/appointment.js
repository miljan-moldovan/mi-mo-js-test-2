import apiConstants from '../apiConstants';

const resources = {
  getAppointmentsByDate: {
    path: 'Appointment/:date',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
