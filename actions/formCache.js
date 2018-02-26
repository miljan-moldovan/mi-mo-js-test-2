// @flow
import {
  STORE_FORM, PURGE_FORM
} from './constants';

export function storeForm (formIdentifier: string, itemIdentifier: string, formState: Object) {
  return {
    type: STORE_FORM,
    data: {
      formIdentifier, itemIdentifier, formState, updated: Date.now()
    }
  }
}
export function purgeForm (formIdentifier: string, itemIdentifier: string) {
  return {
    type: PURGE_FORM,
    data: {
      formIdentifier, itemIdentifier
    }
  }
}
