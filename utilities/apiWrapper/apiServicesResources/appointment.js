import apiConstants from '../apiConstants';

const resources = {
  getAppointmentsByDate: {
    path: 'Appointments/ByDate/:date',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getEmployeesAppointmentOrder: {
    path: 'Employees/AppointmentOrder',
    method: 'get',
    expiration: apiConstants.expiration,
  },

  postEmployeesAppointmentOrder: {
    path: 'Employees/AppointmentOrder',
    method: 'post',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
