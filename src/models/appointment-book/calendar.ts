import { NavigationScreenProp } from 'react-navigation';
import { Employee, ProviderSchedule } from '../common';
import { FilterOptions } from './filterOptions';
import { PureAppointment, PureBlockTime } from './cards';
import { ApptGridSettings } from './apptGridSettings';
import { AvailabilityItem } from './availability-item';
import { RoomFromApi } from './rooms';
import * as moment from 'moment';


export interface CalendarProps {
  appointments: PureAppointment[],
  apptGridSettings: ApptGridSettings,
  availability: AvailabilityItem[],
  blockTimes: PureBlockTime[],
  bufferVisible: boolean,
  checkConflicts: Function,
  checkConflictsBlock: Function,
  displayMode: string,
  filterOptions: FilterOptions,
  headerData: Employee[] | moment.Moment[],
  isLoading: boolean,
  isResource: boolean,
  isRoom: boolean,
  manageBuffer: Function,
  navigation: NavigationScreenProp<any, any>,
  onCellPressed: Function,
  onDrop: Function,
  onDropBlock: Function,
  onResize: Function,
  onResizeBlock: Function,
  providerSchedule: ProviderSchedule[],
  rooms: RoomFromApi[],
  selectedProvider: string | Employee,
  selectedFilter: string,
  setSelectedDay: Function,
  setSelectedProvider: Function,
  startDate: string | moment.Moment,
  storeScheduleExceptions: ProviderSchedule[],
  refsSliderPanel: any,
}

export interface CalendarState {
  activeBlock: any, //TO DO,
  activeCard: any, //TO DO,
  buffer: any[], //TO DO,
  calendarMeasure: any, //TO DO,
  calendarOffset: any, //TO DO,
  isResizeing: boolean,
  overlappingCardsMap: any[], //TO DO,
  pan: any, //TO DO,
  pan2: any, //TO DO
  alert: any,
  groupedAppointments: any,
  groupedBlocks: any,
  cardsArray: any,
}
