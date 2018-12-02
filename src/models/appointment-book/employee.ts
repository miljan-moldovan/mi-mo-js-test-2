import { Maybe, EmployeeScheduledInterval, PureProvider } from '@/models';

export interface AppointmentEmployee extends PureProvider {
  roomAssignments: RoomAssignment[];
  assistantAssignment: AssistantAssignment;
  scheduledIntervals: EmployeeScheduledInterval[];
  isOff: boolean;
  isDeleted: boolean;
  isTerminated: boolean;
  inAppointmentBook: boolean;
  imagePath: string;
  imageName: string;
  firstName?: string;
}

export interface AssistantAssignment {
  id: number;
  isDeleted: boolean;
  name: string;
  timeIntervals: {
    start: string;
    end: string
    duration: string
  }[];
}

export interface RoomAssignment {
  date: string;
  roomId: number;
  roomOrdinal: number;
  fromTime: string;
  toTime: string;
}

export interface EmployeesStats {
  totalTime: string;
  totalTimeForEmployee: string;
  employeeId: number;
  totalSales: number;
  productivityPercent: number;
}

export interface EmployeeSchedule {
  scheduledIntervals: EmployeeScheduledInterval[];
  roomAssignment: RoomAssignment[];
  assistantAssignment: AssistantAssignment;
  isException: boolean;
  scheduleType: number;
  comments: Maybe<string>;
  date: string;
  weekday: number;
  isOff: boolean;
}

export interface EmployeesStatsDaily {
  totalTime: string;
  totalTimeForEmployee: string;
  employeeId: number;
  totalSales: number;
  productivityPercent: number;
}
