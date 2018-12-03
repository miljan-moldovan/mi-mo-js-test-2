import moment from 'moment';

import {AsyncStorage} from 'react-native';
import {JWTKEY} from '../../utilities/apiWrapper/api';
import {Store} from '../../utilities/apiWrapper';

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

const getScheduleForDate = date => (dispatch, getState) => {
  const {storeReducer: {isLoading}} = getState ();
  if (isLoading) {
    return;
  }
  dispatch ({
    type: GET_SCHEDULE_FOR_DATE,
    data: {date},
  });
  Store.getSchedule (date)
    .then (({scheduledIntervals: schedule = []}) =>
      dispatch ({
        type: GET_SCHEDULE_FOR_DATE_SUCCESS,
        data: {schedule},
      })
    )
    .catch (() => dispatch ({type: GET_SCHEDULE_FOR_DATE_FAILED}));
};

const loadStoreInfoSuccess = storeInfo => ({
  type: LOAD_STORE_INFO_SUCCESS,
  data: {storeInfo},
});

const loadScheduleExceptionsSuccess = scheduleExceptions => ({
  type: LOAD_SCHEDULE_EXCEPTIONS_SUCCESS,
  data: {scheduleExceptions},
});

const setStore = (storeId, callback) => async dispatch => {
  dispatch ({
    type: SET_MAIN_STORE,
  });

  const data = await Store.postSetStore (storeId);

  if (data.result !== 1) {
    callback (false, data.userMessage);
    dispatch ({
      type: SET_MAIN_STORE_FAILURE,
      data: data.userMessage,
    });
    // console.log('blabla', 'setStore', data);
  } else {
    // TODO: Add proper saving for new JWT key
    AsyncStorage.setItem (JWTKEY, data.response);
    dispatch ({
      type: SET_MAIN_STORE_SUCCESS,
      data: {storeId},
    });
  }
};

const reselectMainStore = () => ({
  type: RESELECT_MAIN_STORE,
});

const cancelSelectStore = () => ({
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
export default storeActions;
