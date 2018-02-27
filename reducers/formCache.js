// @flow
import {
  STORE_FORM, PURGE_FORM
} from '../actions/constants';

const initialState = {
};

export default (state: Object = initialState, action: Object) => {
  const {type, data, error} = action;
  console.log('***** formCache.reducer', type, data, error);

  switch(type) {
    case STORE_FORM:
      return {
        ...state,
        [data.formIdentifier]: {
          ...state.formIdentifier,
          [data.itemIdentifier]: data.formState
        }
      };
    case PURGE_FORM:
      return {
        ...state,
        [data.formIdentifier]: {
          ...state.formIdentifier,
          [data.itemIdentifier]: undefined
        }
      };
    default:
      return state;
  }

}
