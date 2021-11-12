export default {
  // Response Codes APIs
  responsesCodes: {
    Success: 1,
    NotAuthenticated: 2,
    NoPermission: 3,
    FailedValidation: 4,
    Exception: 5,
    NotFound: 6,
    NetworkError: 99,
    UnknownError: 100,
  },
  // Must clean cache after doing these requests
  cleanCache: ['getEmployeesAppointmentOrder', 'postQueue', 'postQueueGroup', 'deleteQueueGroup', 'postClientNote',
    'putClientNote', 'postUndeleteClientNote', 'deleteClientNote', 'putQueueGroupLeader', 'postMergeClients'],
  // Must clean these Dependencies cache after doing these requests
  cacheCleaningDependencies: {
    postQueue: ['getQueue'],
    postQueueGroup: ['getQueue', 'getQueueGroups'],
    deleteQueueGroup: ['getQueue', 'getQueueGroups'],
    putQueueGroupLeader: ['getQueue', 'getQueueGroups'],
    postClientNote: ['getClientNotes'],
    putClientNote: ['getClientNotes'],
    postUndeleteClientNote: ['getClientNotes'],
    deleteClientNote: ['getClientNotes'],
    postMergeClients: ['getQueue', 'getQueueGroups', 'getMergeableClients'],
    postEmployeesAppointmentOrder: ['getEmployeesAppointmentOrder'],
  },
  // Global expiration time
  expiration: 5 * 60 * 1000,
};
