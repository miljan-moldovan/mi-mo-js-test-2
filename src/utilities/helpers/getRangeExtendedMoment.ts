import moment from 'moment';
import { Moment } from 'moment';
import { extendMoment, MomentRange } from 'moment-range';

const extendedMoment = extendMoment(moment);

export const getRangeExtendedMoment = (): MomentRange & Moment => extendedMoment;

export default extendedMoment;
