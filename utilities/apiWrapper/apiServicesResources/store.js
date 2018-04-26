import apiConstants from '../apiConstants';

const resources = {
  getStoreWeeklySchedule: {
    path: 'Store/WeeklySchedule',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
