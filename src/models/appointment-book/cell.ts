import { Maybe } from 'models';

export interface CellSelection {
  fromTime: string;
  toTime: string;
  gapTime?: string;
  afterTime?: string;
  employeeId?: Maybe<number>;
  resourceId?: Maybe<number>;
  roomId?: Maybe<number>;
  ordinal?: Maybe<number>;
  date: string;
  id?: number;
}
