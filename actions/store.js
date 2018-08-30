import moment from 'moment';
import { Store } from '../utilities/apiWrapper';
import apptGridSettingsSelector from '../redux/selectors/apptGridSettingsSelector';

export const GET_SCHEDULE_FOR_DATE = 'store/GET_SCHEDULE_FOR_DATE';
export const GET_SCHEDULE_FOR_DATE_SUCCESS = 'store/GET_SCHEDULE_FOR_DATE_SUCCESS';
export const GET_SCHEDULE_FOR_DATE_FAILED = 'store/GET_SCHEDULE_FOR_DATE_FAILED';
export const LOAD_STORE_INFO_SUCCESS = 'store/LOAD_STORE_INFO_SUCCESS';
export const LOAD_SCHEDULE_EXCEPTIONS_SUCCESS = 'store/LOAD_SCHEDULE_EXCEPTIONS_SUCCESS';

const getScheduleForDate = date => (dispatch, getState) => {
  const { storeReducer: { isLoading } } = getState();
  if (isLoading) {
    return;
  }
  dispatch({
    type: GET_SCHEDULE_FOR_DATE,
    data: { date },
  });
  Store.getSchedule(date)
    .then(({ scheduledIntervals: schedule = [] }) => dispatch({
      type: GET_SCHEDULE_FOR_DATE_SUCCESS,
      data: { schedule },
    }))
    .catch(() => dispatch({ type: GET_SCHEDULE_FOR_DATE_FAILED }));
};

const loadStoreInfoSuccess = storeInfo => ({
  type: LOAD_STORE_INFO_SUCCESS,
  data: { storeInfo },
});

const loadScheduleExceptionsSuccess = scheduleExceptions => ({
  type: LOAD_SCHEDULE_EXCEPTIONS_SUCCESS,
  data: { scheduleExceptions },
});

const storeActions = {
  getScheduleForDate,
  loadStoreInfoSuccess,
  loadScheduleExceptionsSuccess,
};
export default storeActions;
