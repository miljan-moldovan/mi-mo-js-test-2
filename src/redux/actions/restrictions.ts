import { Tasks } from '@/constants/Tasks';
import { getRestrictionsHelper, restrictionsHelper } from '@/utilities/helpers/restrictions';

export const SET_RESTRICTION = 'restrictions/SET_RESTRICTION';


export const getRestrictions = (tasksArray): any => async (dispatch) => {
  await getRestrictionsHelper(tasksArray, dispatch);
};

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

export const checkRestrictionsModifyAppt = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_ModifyAppt, callback, dispatch, getState);
};

export const checkRestrictionsCancelAppt = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_Cancel, callback, dispatch, getState);
};

export const checkRestrictionsAddService = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_MultiServiceAppt, callback, dispatch, getState);
};

export const checkRestrictionsBookAppt = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_ApptBook, callback, dispatch, getState);
};

export const checkRestrictionsLongPress = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_EnterAppt, callback, dispatch, getState);
};

export const checkRestrictionsDragDrop = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Appt_DragDrop, callback, dispatch, getState);
};

export const checkRestrictionsClientInfo = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Clients_Info, callback, dispatch, getState);
};

export const checkRestrictionsClientMaintenance = (callback): any => async (dispatch, getState) => {
  await restrictionsHelper(Tasks.Clients_Maintain, callback, dispatch, getState);
};
