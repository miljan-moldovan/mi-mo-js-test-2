import apiConstants from '../apiConstants';

const resources = {
  getEmployees: {
    path: 'Employees',
    method: 'get',
    // expiration: apiConstants.expiration,
    disableCache: true,
  },
  getEmployeePhoto: {
    path: 'Employees/:id/Photo',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getEmployeeSchedule: {
    path: 'Employees/Schedule/:date',
    method: 'get',
    expiration: apiConstants.expiration,
    // expiration: apiConstants.expiration,
    disableCache: true,
  },
  getEmployeeAppointments: {
    path: 'AppointmentBook/:dateFrom/:dateTo/Employee/:id/Appointments',
    method: 'get',
    // expiration: apiConstants.expiration,
    disableCache: true,
  },
  getEmployeeScheduleRange: {
    path: 'Employees/:id/Schedule/:startDate/:endDate',
    method: 'get',
    disableCache: true,
  },
  getEmployeePositions: {
    path: 'Employees/Positions',
    method: 'get',
    disableCache: true,
  },
};

export default {
  resources,
};
