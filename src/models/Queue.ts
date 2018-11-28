// @flow
import  {
  Client,
} from './Client';

import  {
  ServiceQueue
} from './ServiceQueue';

export type QueueItem = {
  checkedIn: boolean;
  client: Client;
  date: Date;
  elapsed: string;
  groupId: string;
  isGroupLeader: boolean;
  enteredTime: number;
  finishService: number;
  length: string;
  level: number;
  needStylist: boolean;
  id: number;
  serviced: boolean;
  servicedTime: string;
  services: ServiceQueue[];
  status: number;
  store_id: number;
  tZone: string;
  type: string;
  background: string;
  processTime: string | 0;
  progressTime: string;
  progressMaxTime: string;
  estimatedTime: number;
  completed: number;
  startTime: string;
  expectedStartTime: number;
  attributes: any;
  birthday: boolean;
  newGlobal: boolean;
  newLocal: boolean;
  online: boolean;
  membership: boolean;
  enteredTimeAt: string;
  finishServiceTimeAt: string;
  servicedTimeAt: string;
  queueType: number;
  totalPrice: number;
  badgeData ?: any;
}
