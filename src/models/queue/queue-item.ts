import {
  Client,
  ServiceQueue,
  QueueItemProduct
} from '@/models';
import { number } from 'prop-types';

export interface QueueItem {
  badgeData: {
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
  checkedIn: boolean;
  client: Client;
  date: Date;
  elapsed: string;
  groupId: string;
  isGroupLeader: boolean;
  enteredTime: any;
  // enteredTime: string | number;
  finishService: number;
  length: string;
  level: number;
  needStylist: boolean;
  id: number;
  serviced: boolean;
  servicedTime: string;
  services: ServiceQueue[];
  serviceEmployeeClientQueues: ServiceQueue[];
  status: Status;
  store_id: number;
  tZone: string;
  type: string;
  background: string;
  processTime: string | 0;
  progressTime: string;
  progressMaxTime: string;
  estimatedTime: string;
  hasFormulas: boolean;
  hasNotes: boolean;
  isLate: boolean;
  completed: number;
  startTime: string;
  expectedStartTime: string;
  attributes: any;
  birthday: boolean;
  newGlobal: boolean;
  newLocal: boolean;
  online: boolean;
  membership: boolean;
  enteredTimeAt: string;
  finishServiceTimeAt: string;
  servicedTimeAt: string;
  queueType: QueueTypes;
  totalPrice: number;
  updateStamp: number;
  waitTimeDebugInfo: null;
  waitTime: string;
  products: QueueItemProduct[];
}

export enum Status {
  checkedIn = 0,
  notArrived = 1,
  checkedOut = 2,
  noShow = 3,
  walkOut = 4,
  returningLater = 5,
  inService = 6,
  finished = 7,
  removed = 8
}

export enum QueueTypes {
  // <summary> If the ClientQueue is created from an appointment, this value should be used. </summary>
  PosAppointment = 1,
  // <summary> If the ClientQueue is created from inside SU by adding a walk-in, this value should be used. </summary>
  PosWalkIn = 2,
  // <summary> If the ClientQueue is created from the web-interface of bookedby, this value should be used. </summary>
  BookedbyWeb = 3,
  // <summary> If the ClientQueue is created through the self-check-in native app
  // via the bookedby api, this value should be used. </summary>
  BookedbyApp = 4,
  // <summary> If the ClientQueue is created through the in-store self-check-in kiosk, this value should be used. </summary>
  KioskWalkIn = 5
}

export interface QueueClientsToday {
  amount: number;
}

export interface QueueState {
  debugInfo: string;
  guestWaitMins: number;
  todayClients: QueueClientsToday;
}