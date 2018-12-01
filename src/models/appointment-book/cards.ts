import { Resource, Room, Maybe, Service, Client, PureProvider, Provider } from '@/models';
import { QueueStatus } from '@/constants';
import { Duration, Moment } from 'moment';

export interface PureAppointment {
  employee: PureProvider;
  isFirstAvailable: boolean;
  client: Client;
  service: Service;
  room: Maybe<Room>;
  resource: Maybe<Resource>;
  roomOrdinal: number;
  resourceOrdinal: number;
  gapTime: string;
  afterTime: string;
  fromTime: string;
  toTime: string;
  bookBetween: boolean;
  clientType: number;
  remarks: Maybe<string>;
  displayColor: Maybe<string>;
  date: string;
  assignmentPriority: Maybe<number>;
  isMultipleProviders: boolean;
  updateStamp: number;
  isDeleted: boolean;
  queueStatus: QueueStatus;
  confirmationStatus: number;
  mainServiceColor: number;
  requested: boolean;
  appointmentGroupId: number;
  status: AppointmentStatus;
  badgeData: {
    queueStatus: QueueStatusForApptCard;
    clientBirthday: boolean;
    clientHasMembership: boolean;
    clientIsNew: boolean;
    clientIsNewLocally: boolean;
    isCashedOut: boolean;
    isFinished: boolean;
    isInService: boolean;
    isNoShow: boolean;
    isOnlineBooking: boolean;
    isParty: boolean;
    isRebooked: boolean;
    isRecurring: boolean;
    isReturning: boolean;
    isWaiting: boolean;
    primaryClient: {
      id: number;
      name: string;
    };
  };
  id: number;
}

export enum QueueStatusForApptCard {
  NULL = -1,
  // <summary> The CheckedIn state means that the client has arrived at the salon
  // and is now waiting for their service to start. Walk-Ins entered at the salon start in this state. </summary>
  CheckedIn = 0,
  // <summary> The NotArrived state means that the client is in the wait-list or
  // has an appointment, and has not yet arrived. </summary>
  NotArrived = 1,
  // <summary> The CheckedOut state means that the client has finished
  // paying for their service and is no longer on the wait list. </summary>
  CheckedOut = 2,
  // <summary> The NoShow state means that a client had an appointment
  // but never arrived for their service. </summary>
  NoShow = 3,
  // <summary> The WalkOut state means that a client arrived for a walk-in service,
  // but then left the salon without receiving any service. </summary>
  WalkOut = 4,
  // <summary> The ReturningLater state menas that a client has arrived at
  // the salon for their service, but then went off-site while waiting
  // for their service to start, and intends to return. </summary>
  ReturningLater = 5,
  // <summary> The InService state means that a client is currently receiving their service. </summary>
  InService = 6,
  // <summary> The Finished state menas that all services
  // for this client are complete, but the client has not yet finished paying. </summary>
  Finished = 7,
  // <summary> The Removed state means that this record was
  // removed from the client queue, but it was neither a no-show nor a walk-out. </summary>
  Removed = 8
}
export interface AppointmentCard extends PureAppointment {
  isBlockTime: boolean;
  duration: number; // in minutes
  clientName: string;
  clientId: number;
  serviceName: string;
  isGroupLeader?: boolean;
  bookedByEmployee?: Provider;
  primaryAppointmentId?: number;
  fromTimeMoment: Moment;
  toTimeMoment: Moment;
  gapStartTimeMoment: Moment;
  gapEndTimeMoment: Moment;
  gapStartTime: string;
  gapEndTime: string;
  afterTimeMomentDuration: Duration;
  gapTimeMomentDuration: Duration;
}

export interface PureBlockTime {
  date: string;
  fromTime: string;
  toTime: string;
  notes: Maybe<string>;
  employee: PureProvider;
  bookedByEmployeeId: number;
  reason: {
    name: string;
    id: number;
  };
  countInProductivity: boolean;
  color: number;
  id: number;
}

export interface BlockTimeCard extends PureBlockTime {
  isBlockTime: boolean;
  duration: number;
  fromTimeMoment: Moment;
  toTimeMoment: Moment;
}

export interface CommonCard extends AppointmentCard, BlockTimeCard { }

export enum AppointmentStatus {
  Regular = 1,
  NewRequest = 2,
  AcceptedRequest = 3,
  RejectedRequest = 4,
}
