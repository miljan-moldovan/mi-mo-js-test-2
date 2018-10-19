// @flow
import {
  SETTINGS_BY_NAME,
  SETTINGS_BY_NAME_SUCCESS,
  SETTINGS_BY_NAME_FAILED,
  SETTINGS,
  SETTINGS_SUCCESS,
  SETTINGS_FAILED,
} from '../actions/settings';

const initialState = {
  loading: false,
  data: {},
  settings: [],
  walkinClient: null,
};

export default function settingsReducer(state = initialState, action) {
  const { type, data, error } = action;

  switch (type) {
    case SETTINGS:
      return {
        ...state,
        isLoading: true,
      };
    case SETTINGS_SUCCESS:

      return {
        ...state,
        error: null,
        settings: data.settings,
        walkinClient: data.walkinClient,
        isLoading: false,
      };
    case SETTINGS_FAILED:

      return {
        ...state,
        isLoading: false,
        walkinClient: null,
        error: data.error,
        settings: [],
      };


    case SETTINGS_BY_NAME:
      return {
        ...state,
        isLoading: true,
      };
    case SETTINGS_BY_NAME_SUCCESS:
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          [data.settings.settingName]: data.settings.settingValue,
        },
        isLoading: false,
      };
    case SETTINGS_BY_NAME_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        settings: [],
      };

    default:
      return state;
  }
}
