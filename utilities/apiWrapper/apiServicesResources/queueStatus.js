import apiConstants from '../apiConstants';


const resources = {
  getReasonTypes: {
    path: 'QueueStatus/RemovalReasonTypes',
    method: 'get',
    disableCache: true,
    //expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
