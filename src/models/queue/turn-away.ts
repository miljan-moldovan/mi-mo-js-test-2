import { Maybe } from '@/models';
import { AppointmentEmployee } from '@/models';

export interface TurnAwayService {
  fromTime: string;
  toTime: string;
  myServiceId: number;
  myEmployeeId: number;
}

export interface TurnAway {
  date: string;
  reasonCode: string;
  reason: string;
  myClientId: number;
  isAppointmentBookTurnAway: boolean;
  services: TurnAwayService[];
}

export interface TurnAwayModalInitialData {
  date: string;
  startTime: string;
  endTime: string;
  employee: Maybe<AppointmentEmployee>;
}

export interface TurnAwayReason {
  id: number;
  name: string;
}