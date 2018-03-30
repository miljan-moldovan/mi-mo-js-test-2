import apiConstants from '../apiConstants';

const resources = {
  getAppointmentsByDate: {
    path: 'Appointment/:date',
    method: 'get',
    // expiration: apiConstants.expiration,
    disableCache: true,
  },
};

export default {
  resources,
};
