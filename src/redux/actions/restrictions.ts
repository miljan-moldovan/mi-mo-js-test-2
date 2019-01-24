import { Tasks } from '@/constants/Tasks';
import { restrictionsHelper } from '@/utilities/helpers/restrictions';

export const SET_RESTRICTION = 'restrictions/SET_RESTRICTION';

export const checkRestrictionsBlockTime = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_EnterBlock, callback, dispatch, getState);
};

export const checkRestrictionsCancelBlockTime = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_CancelBlock, callback, dispatch, getState);
};

export const checkRestrictionsModifyBlockTime = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_ModifyBlock, callback, dispatch, getState);
};

export const checkRestrictionsRoomAssignment = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Salon_RoomAssign, callback, dispatch, getState);
};

export const checkRestrictionsEditSchedule = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Salon_EmployeeEdit, callback, dispatch, getState);
};



