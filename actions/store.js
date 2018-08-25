import moment from 'moment';
import { Store } from '../utilities/apiWrapper';
import apptGridSettingsSelector from '../redux/selectors/apptGridSettingsSelector';

export const GET_SCHEDULE_FOR_DATE = 'store/GET_SCHEDULE_FOR_DATE';
export const GET_SCHEDULE_FOR_DATE_SUCCESS = 'store/GET_SCHEDULE_FOR_DATE_SUCCESS';
export const GET_SCHEDULE_FOR_DATE_FAILED = 'store/GET_SCHEDULE_FOR_DATE_FAILED';

const getScheduleForDate = date => (dispatch, getState) => {
  dispatch({
    type: GET_SCHEDULE_FOR_DATE,
    data: { date },
  });
  return Store.getSchedule(date)
    .then(({ scheduledIntervals: schedule = [] }) => dispatch({
      type: GET_SCHEDULE_FOR_DATE_SUCCESS,
      data: { schedule },
    }))
    .catch(() => dispatch({ type: GET_SCHEDULE_FOR_DATE_FAILED }));
};

const storeActions = {
  getScheduleForDate,
};
export default storeActions;
