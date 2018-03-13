import apiConstants from '../apiConstants';

const resources = {
  getEmployees: {
    path: 'Employees',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getEmployeePhoto: {
    path: 'Employees/:id/Photo',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
