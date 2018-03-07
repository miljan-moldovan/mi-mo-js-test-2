// @flow

import {
  SETTINGS_BY_NAME_RECEIVED,
  SETTINGS_BY_NAME_FAILED,
} from './constants';
import apiWrapper from '../utilities/apiWrapper';

export const getSettingsByName = (name: string) => async (dispatch: Object => void) => {
  // dispatch({type: QUEUE});
  console.log('getSettingsByName begin');
  try {
    let data = await apiWrapper.doRequest('getSettingsByName', { path: { name } });
    console.log('receiveSettingsByName', data);
    dispatch({type: SETTINGS_BY_NAME_RECEIVED, data });
  } catch (error) {
    console.log('receiveQueue error', JSON.stringify(error, null, 2));
    dispatch({type: SETTINGS_BY_NAME_FAILED, error});
  }
}
