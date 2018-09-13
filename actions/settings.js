import { Settings } from '../utilities/apiWrapper';

export const SETTINGS_BY_NAME = 'services/SETTINGS_BY_NAME';
export const SETTINGS_BY_NAME_SUCCESS = 'services/SETTINGS_BY_NAME_SUCCESS';
export const SETTINGS_BY_NAME_FAILED = 'services/SETTINGS_BY_NAME_FAILED';

export const SETTINGS = 'services/SETTINGS';
export const SETTINGS_SUCCESS = 'services/SETTINGS_SUCCESS';
export const SETTINGS_FAILED = 'services/SETTINGS_FAILED';


const getSettingsSuccess = settings => ({
  type: SETTINGS_SUCCESS,
  data: { settings },
});

const getSettingsFailed = error => ({
  type: SETTINGS_FAILED,
  data: { error },
});

const getSettings = (callback = () => {}) => (dispatch, getState) => {
  dispatch({ type: SETTINGS });
  return Settings.getSettings()
    .then((response) => { dispatch(getSettingsSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getSettingsFailed(error)); callback(false, error.message); });
};

const getSettingsByNameSuccess = settings => ({
  type: SETTINGS_BY_NAME_SUCCESS,
  data: { settings },
});

const getSettingsByNameFailed = error => ({
  type: SETTINGS_BY_NAME_FAILED,
  data: { error },
});

const getSettingsByName = name => (dispatch, getState) => {
  dispatch({ type: SETTINGS_BY_NAME });
  return Settings.getSettingsByName(name)
    .then(response => dispatch(getSettingsByNameSuccess(response)))
    .catch(error => dispatch(getSettingsByNameFailed(error)));
};

const settingsActions = {
  getSettingsByName,
  getSettings,
};

export default settingsActions;
