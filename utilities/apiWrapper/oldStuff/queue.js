import apiConstants from '../apiConstants';


const resources = {
  getQueue: {
    path: 'Queue',
    method: 'get',
    // expiration: apiConstants.expiration,
    disableCache: true,
  },
  getQueueById: {
    path: 'Queue/:id/',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getQueueGroups: {
    path: 'Queue/Group',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getQueueEmployeeServices: {
    path: 'Queue/:id/Employee/:idEmployee/Services',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getQueueServiceEmployees: {
    path: 'Queue/:id/Service/:idService/Employees',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getQueueClientsToday: {
    path: 'Queue/ClientsToday',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  putQueue: {
    path: 'Queue/:queueId',
    method: 'put',
    disableCache: true,
  },
  postQueueGroup: {
    path: 'Queue/Group',
    method: 'post',
    disableCache: true,
  },
  deleteQueueGroup: {
    path: 'Queue/Group/:groupId',
    method: 'delete',
    disableCache: true,
  },
  putQueueGroupLeader: {
    path: 'Queue/Group/:groupId/Leader/:clientQueueId',
    method: 'put',
    disableCache: true,
  },
  postQueueWalkinWalkin: {
    path: 'Queue/WalkinWalkin',
    method: 'post',
    disableCache: true,
  },
  postQueueWalkinClient: {
    path: 'Queue/WalkinClient',
    method: 'post',
    disableCache: true,
  },
  putServiceByEmployee: {
    path: 'Queue/Service/ByEmployee/:serviceId',
    method: 'put',
    disableCache: true,
  },
  putQueueEmployeeService: {
    path: 'Queue/:queueItemId/Employee/:employeeId/Service/:serviceId/Service',
    method: 'put',
    disableCache: true,
  },
  putQueueEmployeeServiceEmployee: {
    path: 'Queue/:queueItemId/Employee/:employeeId/Service/:serviceId/Employee',
    method: 'put',
    disableCache: true,
  },
};

export default {
  resources,
};
