import apiConstants from '../apiConstants';

const resources = {
  getClients: {
    path: 'Clients',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
