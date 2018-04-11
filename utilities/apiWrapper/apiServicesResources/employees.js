import apiConstants from '../apiConstants';

const resources = {
  getEmployees: {
    path: 'Employees',
    method: 'get',
    expiration: apiConstants.expiration,
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
    disableCache: true,
  },
};

export default {
  resources,
};
