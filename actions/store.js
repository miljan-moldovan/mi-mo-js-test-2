import { AsyncStorage } from 'react-native';
import { JWTKEY } from '../utilities/apiWrapper/api';
import { Store } from '../utilities/apiWrapper';


export const LOAD_STORE_INFO_SUCCESS = 'store/LOAD_STORE_INFO_SUCCESS';
export const LOAD_SCHEDULE_EXCEPTIONS_SUCCESS = 'store/LOAD_SCHEDULE_EXCEPTIONS_SUCCESS';
export const SET_MAIN_STORE = 'store/SET_MAIN_STORE';
export const SET_MAIN_STORE_SUCCESS = 'store/SET_MAIN_STORE_SUCCESS';
export const SET_MAIN_STORE_FAILURE = 'store/SET_MAIN_STORE_FAILURE';

const loadStoreInfoSuccess = storeInfo => ({
  type: LOAD_STORE_INFO_SUCCESS,
  data: { storeInfo },
});

const loadScheduleExceptionsSuccess = scheduleExceptions => ({
  type: LOAD_SCHEDULE_EXCEPTIONS_SUCCESS,
  data: { scheduleExceptions },
});

const setStore = (storeId, callback) => async (dispatch) => {
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

const storeActions = {
  loadStoreInfoSuccess,
  loadScheduleExceptionsSuccess,
  setStore,
};

export default storeActions;
