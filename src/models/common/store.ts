import { WeeklySchedule } from 'models/index';

export interface Store {
  id: number;
  name: string;
  timeZone: string;
  weeklySchedules: WeeklySchedule[];
}
