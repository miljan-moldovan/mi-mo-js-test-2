import * as momentObj from 'moment';
import { extendMoment } from 'moment-range';

const extendedMoment = extendMoment(momentObj);

export const getRangeExtendedMoment = () => extendedMoment;

export default extendedMoment;
