import { Moment } from 'moment';

import { ApptGridSettings } from './apptGridSettings';
import { RoomFromApi } from './rooms';
import { Employee, ProviderSchedule } from '../common';

export interface ColumnProps {
  storeScheduleExceptions: ProviderSchedule[],
  cellWidth: number,
  colData: any,
  isDate: boolean,
  startTime: string | Moment,
  selectedFilter: string,
  providerSchedule: ProviderSchedule[],
  apptGridSettings: ApptGridSettings,
  rooms: RoomFromApi[],
  onCellPressed: Function,
  showRoomAssignments: boolean,
  displayMode: string,
  startDate: string | Moment,
  createAlert: Function,
  hideAlert: Function,
}
