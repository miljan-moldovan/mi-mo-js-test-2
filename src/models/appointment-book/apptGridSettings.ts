import { Moment } from 'moment';

export interface ApptGridSettings {
  minStartTime: Moment,
  maxEndTime: Moment,
  numOfRow: number,
  step: number,
}
