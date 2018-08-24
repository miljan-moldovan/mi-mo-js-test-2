export const LOAD_STORE_INFO_SUCCESS = 'store/LOAD_STORE_INFO_SUCCESS';
export const LOAD_SCHEDULE_EXCEPTIONS_SUCCESS = 'store/LOAD_SCHEDULE_EXCEPTIONS_SUCCESS';

const loadStoreInfoSuccess = storeInfo => ({
  type: LOAD_STORE_INFO_SUCCESS,
  data: { storeInfo },
});

const loadScheduleExceptionsSuccess = scheduleExceptions => ({
  type: LOAD_SCHEDULE_EXCEPTIONS_SUCCESS,
  data: { scheduleExceptions },
});

const storeActions = {
  loadStoreInfoSuccess,
  loadScheduleExceptionsSuccess,
};

export default storeActions;
