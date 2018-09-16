import moment from 'moment';
import { extendMoment } from 'moment-range';

const extendedMoment = extendMoment(moment);

export const getRangeExtendedMoment = () => extendedMoment;

export default extendedMoment;
