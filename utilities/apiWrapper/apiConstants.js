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
  cleanCache: ['postQueue', 'postQueueGroup', 'deleteQueueGroup', 'postClientNote'],
  // Must clean these Dependencies cache after doing these requests
  cacheCleaningDependencies: {
    postQueue: ['getQueue'],
    postQueueGroup: ['getQueue', 'getQueueGroups'],
    deleteQueueGroup: ['getQueue', 'getQueueGroups'],
    postClientNote: ['getClientNotes'],
  },
  // Global expiration time
  expiration: 5 * 60 * 1000,
};
