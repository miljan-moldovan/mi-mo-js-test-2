import apiConstants from '../apiConstants';

const resources = {
  getProducts: {
    path: 'Products',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
