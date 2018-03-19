const resources = {
  getReasonTypes: {
    path: 'QueueStatus/RemovalReasonTypes',
    method: 'get',
    disableCache: true,
    // ``expiration: apiConstants.expiration,
  },
  putCheckIn: {
    path: 'QueueStatus/CheckIn/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
  putWalkOut: {
    path: 'QueueStatus/WalkOut/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
  putStartService: {
    path: 'QueueStatus/StartService/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
};

export default {
  resources,
};
