import { Moment } from 'moment';

export type AppointmentOptionsActions = {
  type: string
  data?: any;
  error?: any;
};

export interface TimeCell {
  startTime: Moment;
  endTime: Moment;
  startTimeString: string;
  endTimeString: string;
  startTimeDisplayString: string;
  isFlatTime: boolean;
}
