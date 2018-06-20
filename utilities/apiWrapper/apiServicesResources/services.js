import apiConstants from '../apiConstants';

const resources = {
  getServices: {
    path: 'Services',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getServiceTree: {
    path: 'Services/Tree',
    method: 'get',
    disableCache: true,
    expiration: apiConstants.expiration,
  },
  getService: {
    path: 'Services/:id',
    method: 'get',
    expiration: apiConstants.expiration,
    disableCache: true,
  },
  getServiceEmployeeCheck: {
    path: 'Services/:serviceId/Check/Employee/:employeeId',
    method: 'get',
    disableCache: true,
  },
  getEmployeesByService: {
    path: 'Services/:serviceId/Employees',
    method: 'get',
    disableCache: true,
  },
};

export default { resources };
