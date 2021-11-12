import { Provider, Maybe, TypeView, HeaderViewSwitcherEntity, Service, ProviderPosition, ProviderCompany } from '@/models';

export interface AppointmentGridSettingsInStore extends Pick<AppointmentGrid,
  'selectedDate' |
  'cardIdToScroll' |
  'providersForSelectedProvidersView' |
  'typeView' |
  'previousTypeView' |
  'employeeForWeekView' |
  'displayFirstAvailableAppointments' |
  'isResizing' |
  'isScrolling' |
  'showOnlyApptProviders' |
  'loading' |
  'showLoader' |
  'allowGridReloading' |
  'isDragging' |
  'initialLoading' |
  'isSelectedDateInPast' |
  'cardTypeToScrollIsBlock' |
  'selectedDateDebouncingIsInProgress'
  > { }

export interface AppointmentGrid {
  startTime: string;
  endTime: string;
  step: number;
  fontSize: number;
  widthColumn: number;
  heightRow: number;
  topLineHeight: number;
  clientNameInEachBlock: boolean;
  disableDrag: boolean;
  showAssistant: boolean;
  showRoom: boolean;
  selectedDate: string;
  cardIdToScroll: Maybe<number>;
  providersForSelectedProvidersView: Maybe<Provider>[];
  typeView: TypeView;
  previousTypeView: TypeView;
  employeeForWeekView: Maybe<HeaderViewSwitcherEntity>;
  displayFirstAvailableAppointments: boolean;
  isResizing: boolean;
  isScrolling: boolean;
  showOnlyApptProviders: boolean;
  showApptBookSales: boolean;
  showApptBookProductivity: boolean;
  loading: boolean;
  showLoader: boolean;
  useFirstAvailable: boolean;
  isDragging: boolean;
  restrictedToBookInAdvanceDays: Maybe<number>;
  enableInlineApptForm: boolean;
  allowCashedOutApptModify: boolean;
  allowGridReloading: boolean;
  initialLoading: boolean;
  isSelectedDateInPast: boolean;
  cardTypeToScrollIsBlock: boolean;
  selectedDateDebouncingIsInProgress: boolean;
}

export interface AppointmentGridEmployeeFilters {
  showOffEmployees: boolean;
  service: Maybe<Service>;
  position: Maybe<ProviderPosition>;
  company: Maybe<ProviderCompany>;
}

export type TypeView = 'Employees' | 'Week' | 'SelectedProviders' | 'Rooms' | 'Resources';

export enum ViewTypes {
  Employees = 'employee.id',
  Week = 'date',
  SelectedProviders = 'employee.id',
  Rooms = 'id',
  Resources = 'id'
}

export type AppointmentGridSettingUpdater =
  <T extends keyof AppointmentGridSettingsInStore>(settingName: T, newValue: AppointmentGridSettingsInStore[T]) => void;
