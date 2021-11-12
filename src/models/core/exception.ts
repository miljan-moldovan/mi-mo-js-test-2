export enum PeriodType {
  NULL = -1,
  days = 1,
  weeks = 2,
  daysOfMonth = 3
}

export enum Weekday {
  NULL = -1,
  monday = 1,
  tuesday = 2,
  wednesday = 3,
  thursday = 4,
  friday = 5,
  saturday = 6,
  sunday = 7
}

export enum ScheduleType {
  Regular = 1,
  Personal = 2,
  Vacation = 3,
  OutSick = 4
}

export enum OffType {
  NULL = -1,
  notOff = 1,
  regularSchedule = 2,
  needsReview = 3,
  paid = 4,
  unpaid = 5
}

export interface EmployeeScheduleException {
  startDate: string;
  endDate: string;
  start1: string;
  end1: string;
  start2: string;
  end2: string;
  period: number;
  periodType: PeriodType;
  weekday: Weekday;
  comments: string;
  scheduleType: ScheduleType;
  offType?: OffType;
}

export interface EmployeeScheduleExceptionUpdate extends EmployeeScheduleException {
  existingExceptionId: number;
}

export interface EmployeeScheduleExceptionGet extends EmployeeScheduleException {
  id: number;
  employeeId: number;
  exceptionDates: {
    id: number;
    date: string;
  }[];
}

export interface SchedulingExceptionModalInitialData {
  employeeId: number;
  date: string;
}

export interface ErrorApiResponse extends Error {
  generatedAt: string | null;
  result: number | null;
  systemErrorDetail: string | null;
  systemErrorStack: string | null;
  systemErrorType: string | null;
  userMessage: string | null;
  [key: string]: any;
}

export interface ErrorApi {
  response?: ErrorApiResponse;
}

export interface ErrorState {
  errorData: ErrorApi;
  isError: boolean;
}
