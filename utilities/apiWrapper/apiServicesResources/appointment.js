import apiConstants from '../apiConstants';

const resources = {
  getAppointmentsByDate: {
    path: 'Appointment/:date',
    method: 'get',
    expiration: apiConstants.expiration,
    disableCache: true,
  },
  postAppointmentMove: {
    path: 'Appointment/:appointmentId/Move',
    method: 'post',
    disableCache: true,
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
  postAppointmentResize: {
    path: 'Appointment/:appointmentId/Resize',
    method: 'post',
    disableCache: true,
  },
  postAppointmentBookRebook: {
    path: 'AppointmentBook/Rebook/:appointmentId',
    method: 'post',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
