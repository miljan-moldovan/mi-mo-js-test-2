import moment from 'moment';
import { times } from 'lodash';
import Colors from '@/constants/Colors';

export default function getCalendarMarksForWeekends(date: moment.Moment) {
  const marks = {};
  times(date.daysInMonth(), day => {
    const weekday = moment(date).startOf('month').add(day, 'days');
    if (weekday.format('dddd') === 'Saturday' || weekday.format('dddd') === 'Sunday') {
      marks[weekday.format('YYYY-MM-DD')] = {
        customStyles: {
          text: { color: Colors.defaultGrey },
        },
      };
    }
  });
  return marks;
}
