import apiConstants from '../apiConstants';


const resources = {
  getSettings: {
    path: 'Settings',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getSettingsByName: {
    path: 'Settings/ByName/:name',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
