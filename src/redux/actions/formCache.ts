// @flow
import {STORE_FORM, PURGE_FORM} from './constants';

export function storeForm (formIdentifier, itemIdentifier, formState) {
  return {
    type: STORE_FORM,
    data: {
      formIdentifier,
      itemIdentifier,
      formState,
      updated: Date.now (),
    },
  };
}
export function purgeForm (formIdentifier, itemIdentifier) {
  return {
    type: PURGE_FORM,
    data: {
      formIdentifier,
      itemIdentifier,
    },
  };
}
