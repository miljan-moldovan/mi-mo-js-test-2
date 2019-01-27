import moment from 'moment';

export interface TimeRange {
  from: moment.Duration | any;
  to: moment.Duration | any;
}

export interface TimeInterval {
  startsAt: moment.Duration;
  endsAt: moment.Duration;
}

export interface TimeSuggestion {
  value: any;
  label: string;
  searchTokens: string[];
  special?: boolean;
}

export interface TimeSpecialValue {
  value: any;
  label: string;
}
