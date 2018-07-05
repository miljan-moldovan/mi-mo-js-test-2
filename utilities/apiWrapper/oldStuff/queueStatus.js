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
  putNoShow: {
    path: 'QueueStatus/NoShow/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
  putReturnLater: {
    path: 'QueueStatus/ReturnLater/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
  putReturned: {
    path: 'QueueStatus/Returned/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
  putToWaiting: {
    path: 'QueueStatus/ToWaiting/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
  putFinish: {
    path: 'QueueStatus/Finish/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
  putUndoFinish: {
    path: 'QueueStatus/UndoFinish/:clientQueueItemId',
    method: 'put',
    disableCache: true,
  },
};

export default {
  resources,
};
