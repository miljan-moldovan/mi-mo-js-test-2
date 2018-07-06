import apiConstants from '../apiConstants';

const resources = {
  postNewAppointment: {
    path: 'Appointment',
    method: 'post',
    disableCache: true,
  },
  getAppointmentsByDate: {
    path: 'Appointment/:date',
    method: 'get',
    // expiration: apiConstants.expiration,
    disableCache: true,
  },
  getAppointmentsById: {
    path: 'Appointment/:id',
    method: 'get',
    // expiration: apiConstants.expiration,
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
    // expiration: apiConstants.expiration,
    disableCache: true,
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
  getApptAudit: {
    path: 'Appointment/:id/Audit',
    method: 'get',
    disableCache: true,
  },
};

export default {
  resources,
};
