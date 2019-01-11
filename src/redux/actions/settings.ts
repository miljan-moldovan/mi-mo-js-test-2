import { Settings, Client } from '../../utilities/apiWrapper';

export const SETTINGS_BY_NAME = 'services/SETTINGS_BY_NAME';
export const SETTINGS_BY_NAME_SUCCESS = 'services/SETTINGS_BY_NAME_SUCCESS';
export const SETTINGS_BY_NAME_FAILED = 'services/SETTINGS_BY_NAME_FAILED';

export const SETTINGS = 'services/SETTINGS';
export const SETTINGS_SUCCESS = 'services/SETTINGS_SUCCESS';
export const SET_SETTINGS_SUCCESS = 'services/SET_SETTINGS_SUCCESS';
export const SETTINGS_FAILED = 'services/SETTINGS_FAILED';

export const getSettingsSuccess = ({ settings, walkinClient }) => ({
  type: SETTINGS_SUCCESS,
  data: { settings, walkinClient },
});

export const setSettings = (settings) => ({
  type: SET_SETTINGS_SUCCESS,
  data: { settings },
});

const getSettingsFailed = error => ({
  type: SETTINGS_FAILED,
  data: { error },
});

const getSettings = (callback?: (...args: any) => any) => dispatch => {
  dispatch({ type: SETTINGS });
  return Promise.all([Settings.getSettings(), Client.getClient(1)])
    .then(([settings, walkinClient]) => {
      if(callback) {
        callback(true);
      }
      return dispatch(getSettingsSuccess({ settings, walkinClient }));
    })
    .catch(error => {
      dispatch(getSettingsFailed(error));
      if(callback) {
        callback(false, error.message);
      }
    });
};

const getSettingsByNameSuccess = settings => ({
  type: SETTINGS_BY_NAME_SUCCESS,
  data: { settings },
});

const getSettingsByNameFailed = error => ({
  type: SETTINGS_BY_NAME_FAILED,
  data: { error },
});

const getSettingsByName = (name: string, callback?: (...args: any) => any) => (
  dispatch,
) => {
  dispatch({ type: SETTINGS_BY_NAME });
  Settings.getSettingsByName(name)
    .then(response => {
      dispatch(getSettingsByNameSuccess(response));
      callback(true, response);
    })
    .catch(error => {
      dispatch(getSettingsByNameFailed(error));
      callback(false, error.message);
    });
};

const settingsActions = {
  getSettingsByName,
  getSettings,
};

export default settingsActions;
