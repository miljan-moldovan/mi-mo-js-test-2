import { orderBy } from 'lodash';
import moment from 'moment';

export const sortCardsForBoard = (cards = []) => orderBy(cards, [item => moment.duration(item.fromTime).asMinutes(), 'duration'], 'desc');

export default sortCardsForBoard;
