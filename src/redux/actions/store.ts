import moment from 'moment';

import { AsyncStorage } from 'react-native';
import { JWTKEY } from '../../utilities/apiWrapper/api';
import { Store } from '../../utilities/apiWrapper';
import { Maybe, Store as StoreModel, StoreScheduleException } from '@/models';

export const GET_SCHEDULE_FOR_DATE = 'store/GET_SCHEDULE_FOR_DATE';
export const GET_SCHEDULE_FOR_DATE_SUCCESS =
  'store/GET_SCHEDULE_FOR_DATE_SUCCESS';
export const GET_SCHEDULE_FOR_DATE_FAILED =
  'store/GET_SCHEDULE_FOR_DATE_FAILED';
export const LOAD_STORE_INFO_SUCCESS = 'store/LOAD_STORE_INFO_SUCCESS';
export const LOAD_SCHEDULE_EXCEPTIONS_SUCCESS =
  'store/LOAD_SCHEDULE_EXCEPTIONS_SUCCESS';
export const SET_MAIN_STORE = 'store/SET_MAIN_STORE';
export const SET_MAIN_STORE_SUCCESS = 'store/SET_MAIN_STORE_SUCCESS';
export const SET_MAIN_STORE_FAILURE = 'store/SET_MAIN_STORE_FAILURE';
export const RESELECT_MAIN_STORE = 'store/RESELECT_MAIN_STORE';
export const CANCEL_SELECT_MAIN_STORE = 'store/CANCEL_SELECT_MAIN_STORE';

const getScheduleForDate = (date: string): any => (dispatch, getState) => {
  const { storeReducer: { isLoading } } = getState();
  if (isLoading) {
    return;
  }
  dispatch({
    type: GET_SCHEDULE_FOR_DATE,
    data: { date },
  });
  Store.getSchedule(date)
    .then(({ scheduledIntervals: schedule = [] }) =>
      dispatch({
        type: GET_SCHEDULE_FOR_DATE_SUCCESS,
        data: { schedule },
      })
    )
    .catch(() => dispatch({ type: GET_SCHEDULE_FOR_DATE_FAILED }));
};

const loadStoreInfoSuccess = (storeInfo: Maybe<StoreModel>): any => ({
  type: LOAD_STORE_INFO_SUCCESS,
  data: { storeInfo },
});

const loadScheduleExceptionsSuccess = (scheduleExceptions: StoreScheduleException[]): any => ({
  type: LOAD_SCHEDULE_EXCEPTIONS_SUCCESS,
  data: { scheduleExceptions },
});

const setStore = (storeId: number, callback: Maybe<Function>): any => async dispatch => {
  dispatch({
    type: SET_MAIN_STORE,
  });

  const data = await Store.postSetStore(storeId);

  if (data.result !== 1) {
    callback(false, data.userMessage);
    dispatch({
      type: SET_MAIN_STORE_FAILURE,
      data: data.userMessage,
    });
    // console.log('blabla', 'setStore', data);
  } else {
    // TODO: Add proper saving for new JWT key
    AsyncStorage.setItem(JWTKEY, data.response);
    dispatch({
      type: SET_MAIN_STORE_SUCCESS,
      data: { storeId },
    });
  }
};

const reselectMainStore = (): any => ({
  type: RESELECT_MAIN_STORE,
});

const cancelSelectStore = (): any => ({
  type: CANCEL_SELECT_MAIN_STORE,
});

const storeActions = {
  getScheduleForDate,
  loadStoreInfoSuccess,
  loadScheduleExceptionsSuccess,
  setStore,
  reselectMainStore,
  cancelSelectStore,
};

export interface StoreActions {
  getScheduleForDate: typeof getScheduleForDate;
  loadStoreInfoSuccess: typeof loadStoreInfoSuccess;
  loadScheduleExceptionsSuccess: typeof loadScheduleExceptionsSuccess;
  setStore: typeof setStore;
  reselectMainStore: typeof reselectMainStore;
  cancelSelectStore: typeof cancelSelectStore;
}
export default storeActions;
