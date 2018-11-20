import { Maybe } from 'models';

export interface StoreSchedule {
  comments: Maybe<string>;
  date: Maybe<string>;
  isException: boolean;
  isOff: boolean;
  scheduleType: number;
  scheduledIntervals: Interval[];
}

export interface WeeklySchedule {
  weekday: number;
  start1: Maybe<string>;
  end1: Maybe<string>;
  start2: Maybe<string>;
  end2: Maybe<string>;
}

export interface Interval {
  start: string;
  end: string;
}

export interface EmployeeScheduledInterval {
  comment: string;
  duration: string;
  end: string;
  exceptionId: number;
  isException: boolean;
  isOff: boolean;
  scheduleType: number;
  start: string;
}

export interface StoreScheduleException {
  id: number;
  startDate: string;
  endDate: string;
  start1: Maybe<string>;
  end1: Maybe<string>;
  start2: Maybe<string>;
  end2: Maybe<string>;
  comments: Maybe<string>;
  period: number;
  weekday: number;
  scheduleType: number;
  periodType: number;
  exceptionDates: null;
}
