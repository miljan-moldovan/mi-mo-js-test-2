import apiConstants from '../apiConstants';

const resources = {
  getRooms: {
    path: 'Salon/Rooms',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getResources: {
    path: 'Salon/Resources',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default { resources };
