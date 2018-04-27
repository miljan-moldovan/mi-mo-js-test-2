import apiConstants from '../apiConstants';

const resources = {
  getStoreWeeklySchedule: {
    path: 'Store/WeeklySchedule',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getRooms: {
    path: 'Store/Rooms',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getResources: {
    path: 'Store/Resources',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
