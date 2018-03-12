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
    expiration: apiConstants.expiration,
  },
};

export default { resources };
