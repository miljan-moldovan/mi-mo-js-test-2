import { createSelector } from 'reselect';
import moment from 'moment';

const clientApptSelector = state => state.clientAppointmentsReducer.appointments;

const getAppointmentsLength = createSelector(
  clientApptSelector,
  appts => appts.length,
);

const dateFormater = (date) => {
  const today = moment();
  const todayFormated = today.format('YYYY-MM-DD');
  const dateMoment = moment(date, 'YYYY-MM-DD');
  const dateFormated = dateMoment.format('YYYY-MM-DD');
  if (todayFormated === dateFormated) {
    return `Today, ${dateMoment.format('MM YYYY')}`;
  } else if (dateMoment.diff(today) === 1) {
    return `Tomorrow, ${dateMoment.format('MM YYYY')}`;
  }
  return dateMoment.format(('dddd, MMMM DD'));
};

const groupApptByDateSelector = createSelector(
  clientApptSelector,
  appts => _.chain(appts).groupBy(item => dateFormater(item ? item.date : '')).map((currentItem, date) => ({
    title: date,
    data: currentItem,
  })).value(),
);

export default { groupApptByDateSelector, getAppointmentsLength };
