// @flow
import {
  SETTINGS_BY_NAME,
  SETTINGS_BY_NAME_SUCCESS,
  SETTINGS_BY_NAME_FAILED,
  SETTINGS,
  SETTINGS_SUCCESS,
  SETTINGS_FAILED,
  SET_SETTINGS_SUCCESS,
} from '../actions/settings';
import { Dictionary, SettingItem, Maybe } from '@/models';

const initialState: SettingsReducer = {
  isLoading: false,
  error: null,
  data: {},
  settings: [],
  walkinClient: null,
};

export interface SettingsReducer {
  isLoading: boolean;
  data: Dictionary<SettingItem<any>>;
  settings: SettingItem<any>[];
  walkinClient: Maybe<any>;
  error: Maybe<any>;
}

export default function settingsReducer(state: SettingsReducer = initialState, action): SettingsReducer {
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
    case SET_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: data.settings,
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
      };

    default:
      return state;
  }
}
