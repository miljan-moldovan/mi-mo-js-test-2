// @flow
import {
  SETTINGS_BY_NAME_RECEIVED,
  SETTINGS_BY_NAME_FAILED,
} from '../actions/constants';

const initialState = {
  loading: false,
  data: {}
};

export default (state = initialState, action) => {
  const {type, data, error} = action;

  switch(type) {
    case SETTINGS_BY_NAME_RECEIVED:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [data.settingName]: data.settingValue
        }
      };
    case SETTINGS_BY_NAME_RECEIVED:
      return {
        ...state,
        loading: false,
        error: data.error
      };
    default:
      return state;
  }
}
