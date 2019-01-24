import { Tasks } from '@/constants/Tasks';
import { restrictionsHelper } from '@/utilities/helpers/restrictions';

export const SET_RESTRICTION = 'restrictions/SET_RESTRICTION';

export const checkRestrictionsBlockTime = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_EnterBlock, callback, dispatch, getState);
};

