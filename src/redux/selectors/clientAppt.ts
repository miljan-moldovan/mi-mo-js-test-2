import {createSelector} from 'reselect';
import moment from 'moment';

const clientApptSelector = state =>
  state.clientAppointmentsReducer.appointments;

const getAppointmentsLength = createSelector (
  clientApptSelector,
  appts => appts.length
);

const dateFormater = date => {
  const today = moment ();
  const todayFormated = today.format ('YYYY-MM-DD');
  const dateMoment = moment (date, 'YYYY-MM-DD');
  const dateFormated = dateMoment.format ('YYYY-MM-DD');
  if (todayFormated === dateFormated) {
    return `Today, ${dateMoment.format ('MMMM DD')}`;
  } else if (
    dateMoment.startOf ('day').diff (today.startOf ('day'), 'days') === 1
  ) {
    return `Tomorrow, ${dateMoment.format ('MMMM DD')}`;
  }
  return dateMoment.format ('dddd, MMMM DD');
};

const groupApptByDateSelector = createSelector (clientApptSelector, appts =>
  _.chain (appts)
    .groupBy (item => dateFormater (item ? item.date : ''))
    .map ((currentItem, date) => ({
      title: date,
      data: currentItem,
    }))
    .value ()
);

export default {groupApptByDateSelector, getAppointmentsLength};
