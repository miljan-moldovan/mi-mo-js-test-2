// @flow

import {
  SETTINGS_BY_NAME_RECEIVED,
  SETTINGS_BY_NAME_FAILED,
} from './constants';
import { Settings } from '../utilities/apiWrapper';

export const getSettingsByName = (name: string) => async (dispatch: Object => void) => {
  // dispatch({type: QUEUE});
  try {
    let data = await Settings.getSettingsByName(name);
    dispatch({type: SETTINGS_BY_NAME_RECEIVED, data });
  } catch (error) {
    dispatch({type: SETTINGS_BY_NAME_FAILED, error});
  }
}
