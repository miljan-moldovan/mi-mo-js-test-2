// @flow
import {
  STORE_FORM, PURGE_FORM,
} from '../actions/constants';

const initialState = {
};

export default (state: Object = initialState, action: Object) => {
  const { type, data, error } = action;

  switch (type) {
    case STORE_FORM:
      return {
        ...state,
        [data.formIdentifier]: {
          ...state[data.formIdentifier],
          [data.itemIdentifier]: data.formState,
        },
      };
    case PURGE_FORM:
      return {
        ...state,
        [data.formIdentifier]: {
          ...state[data.formIdentifier],
          [data.itemIdentifier]: undefined,
        },
      };
    default:
      return state;
  }
};
