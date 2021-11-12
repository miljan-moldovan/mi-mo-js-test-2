import { Moment } from 'moment';
import { Employee, ProviderSchedule } from '../common';
import { ApptGridSettings } from './apptGridSettings';
import { RoomFromApi } from './rooms';

export interface BoardProps {
  columns: any[],
  apptGridSettings: ApptGridSettings,
  showRoomAssignments: boolean,
  showAssistantAssignments: boolean,
  cellWidth: number,
  selectedFilter: string,
  providerSchedule: ProviderSchedule[],
  selectedProvider: string | Employee,
  startTime: Moment | string,
  displayMode: string,
  startDate: Moment | string,
  createAlert: Function,
  hideAlert: Function,
  rooms: RoomFromApi[],
  storeScheduleExceptions: ProviderSchedule[],
}
