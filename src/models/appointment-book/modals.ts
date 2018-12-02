import {
  Maybe,
  Provider,
  Client,
  Note,
  AppointmentCard,
  AppointmentEmployee,
  Resource,
  Room,
  Conflict,
  StoreSchedule,
  PureProvider
} from '@/models';

export enum futureAppointmentsListMode {
  today = 0,
  future = 1,
}
export enum ClientAges {
  NULL = -1,
  Child = 1,
  Adult = 2,
  Senior = 3
}
export interface ShowAppointmentResizeModalParams {
  cardId: number;
  newLength: number;
}
export interface BlockTimeModalParams {
  date: string;
  employee: Maybe<Provider>;
  time: {
    startTime: string;
    endTime: string;
  };
  reason?: {
    name: string;
    id: number;
  };
  notes?: string;
  scheduleBlockId?: number;
  bookedByEmployeeId?: number;
}

export interface AppointmentConflictModalState {
  isOpened: boolean;
  payload: {
    nameBtn: string;
    nameAction: string;
    payload: any;
  };
  conflicts: Conflict[];
}

export interface MoveAppointmentModalState {
  isOpen: boolean;
  data: MoveAppointmentData;
}

export interface AppointmentNotesModalState {
  notes: Note[];
  isLoading: boolean;
  error: any;
}

export interface FutureAppointmentsListModalState {
  isOpen: boolean;
  client: Client;
  mode: futureAppointmentsListMode;
  date: string;
}

export interface CancelAppointmentModalState {
  isOpen: boolean;
  appointmentIds: number[];
}

export interface RejectAppointmentModalState {
  isOpen: boolean;
  appointmentId: number;
}

export interface AcceptAppointmentModalState {
  isOpen: boolean;
  appointmentId: number;
}

export interface CancelBlockTimeModalState {
  isOpen: boolean;
  blockTimeId: number;
}

export interface ResizeAppointmentModalState {
  isOpen: boolean;
  data: ShowAppointmentResizeModalParams;
}

export interface ResizeBlockTimeModalState {
  isOpen: boolean;
  data: ShowAppointmentResizeModalParams;
}

export interface AppointmentRemindersModal {
  time: string;
}

export interface AppointmentBlockTime {
  modifying: boolean;
  isOpen: boolean;
  data: Maybe<BlockTimeModalParams>;
}

export interface RoomAssignmentModal {
  isOpen: boolean;
  data?: DataRoomAssignModal;
}

export interface DataRoomAssignModal {
  date: string;
  employee: AppointmentEmployee;
  storeSchedule: StoreSchedule;
}

export interface DataUpdateRoomAssign {
  date: string;
  fromTime: string;
  toTime: string;
  roomOrdinal: number;
  roomId: number;
}

export interface MoveAppointmentData {
  appointment: AppointmentCard;
  employee: Maybe<PureProvider>;
  room: Maybe<Room>;
  resource: Maybe<Resource>;
  ordinal: Maybe<number>;
  fromTime: string;
  newDate: string;
}

export interface NewClientModalSettings {
  requireClientGender: boolean;
  trackClientAge: boolean;
  forceAgeInput: boolean;
  forceAdultBirthday: boolean;
  forceChildBirthday: boolean;
  maxAdultAge: Maybe<number>;
  maxChildAge: Maybe<number>;
  isLargeForm: boolean;
}

export interface RoomTimeForAddonModal {
  toTime: string;
  fromTime: string;
  roomId: Maybe<number>;
  roomOrdinal: Maybe<number>;
}
