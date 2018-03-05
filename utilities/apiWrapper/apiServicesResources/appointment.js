import apiConstants from '../apiConstants';

const resources = {
  getAppointmentsByDate: {
    path: 'Appointments/ByDate/:date',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
