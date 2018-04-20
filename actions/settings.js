// @flow

import {
  SETTINGS_BY_NAME_RECEIVED,
  SETTINGS_BY_NAME_FAILED,
} from './constants';
import apiWrapper from '../utilities/apiWrapper';

export const getSettingsByName = (name: string) => async (dispatch: Object => void) => {
  // dispatch({type: QUEUE});
  try {
    let data = await apiWrapper.doRequest('getSettingsByName', { path: { name } });
    dispatch({type: SETTINGS_BY_NAME_RECEIVED, data });
  } catch (error) {
    dispatch({type: SETTINGS_BY_NAME_FAILED, error});
  }
}
