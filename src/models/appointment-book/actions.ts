import {
  TypeView,
  Maybe,
  HeaderViewSwitcherEntity,
  NewAppointmentFormInitialDataBase,
  MoveAppointmentData,
  BookAnotherAppointmentData
} from '@/models';

export interface SetInitialDataForNewAppointmentFormParams extends Partial<NewAppointmentFormInitialDataBase> {
  appointments?: BookAnotherAppointmentData[];
}

export interface ChangeGridViewParams {
  typeView: TypeView;
  employeeForWeekView?: Maybe<HeaderViewSwitcherEntity>;
  previousTypeView?: TypeView;
}

export interface ShowMoveAppointmentModalAction extends MoveAppointmentData { }

export interface MoveAppointmentActionParams {
  id: number;
  data: {
    date: string;
    newTime: string;
    employeeId: number;
    roomId: Maybe<number>;
    roomOrdinal: Maybe<number>;
    resourceId: Maybe<number>;
    resourceOrdinal: Maybe<number>;
    isFirstAvailable?: boolean;
  };
}

export interface AppointmentCardWasReleasedActionParams<T> {
  appointment: T;
  employeeId: Maybe<number>;
  roomId: Maybe<number>;
  resourceId: Maybe<number>;
  fromTime: string;
  ordinal: Maybe<number>;
  newDate: string;
}

export interface RejectAppointmentActionParams {
  appointmentId: number;
  data: {
    employeeId: number;
    reason: string;
  };
}

export interface RejectAppointmentRequestData {
  appointmentId: number;
}

export interface AcceptAppointmentActionParams {
  appointmentId: number;
  data: {
    employeeId: number;
  };
}

export interface AcceptAppointmentRequestData {
  appointmentId: number;
}

export interface CancelAppointmentActionParams {
  appointmentIds: number[];
  data: {
    employeeId: number;
    reason: string;
  };
}

export interface CancelAppointmentRequestData {
  appointmentIds: number[];
  reason: string;
}

export interface CancelBlockTimeRequestData {
  blockTimeId: number;
  data: {
    employeeId: number;
    reason: string;
  };
}
