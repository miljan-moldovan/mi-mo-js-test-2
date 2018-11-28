import moment from 'moment';

import {
  Maybe,
  Employee,
  QueueItem,
  GroupColor,
  CombiningClient,
  Groups,
  ModalsState,
  Provider,
  ProvidersForMerge,
  FormulaType,
  Formula,
  NoteType,
  Note,
  EmployeesForDD,
  Coords,
  ServiceCategories,
  CellCoords,
  ReqUpdateEmpl,
  AppointmentCard,
  AppointmentBookAnother,
  ProductCategories,
  AppointmentEmployee,
  ErrorState,
  ErrorApi,
  EmployeesStats,
  Settings,
  ResourceAppointment,
  Client,
  Service,
  Subservice,
  AppointmentGridSettingsInStore,
  DayStats,
  Resource,
  EmployeeSchedule,
  BookApptContextMenuData,
  AvailabilityItem,
  BlockTimeCard,
  Room,
  RoomAppointment,
  CellSelection,
  ClientAppointment,
  AppointmentGridEmployeeFilters,
  PrintOutlet,
  SessionInfo,
  ReqUpdateServ,
  Confirmation,
  Conflict,
  StoreScheduleException,
  Store, PureProvider, TooltipState
} from '@/models';

export interface EmployeesState {
  loading: boolean;
  error: any;
  employees: Employee[];
  employeesDD: EmployeesForDD[];
  newEmployeeSet: boolean;
  employeesForDD: boolean;
  isOpenDD: boolean;
  employeeQuickStaff: Employee | null;
  isOpenQuickStaff: boolean;
  coordsQuicStaff: Coords;
  dropDownData: {
    coords: Coords
    req: ReqUpdateEmpl
  };
  employeeStats: EmployeesStats[];
  selectedEmployeeIdDD: number | null;
  statesOfEmployees: {
    [key: number]: string;
  };
  otherWorkTypes: {
    [key: number]: string
  };
  weeklySchedule: EmployeeSchedule[];
  useFirstAvailableOnDD: boolean;
  allEmployees: PureProvider[];
  allEmployeesAreLoading: boolean;
}

export interface ProviderState {
  loading: boolean;
  error: any;
  providers: Provider[];
  providersForMerge?: ProvidersForMerge[];
}

export interface ClientState {
  loading: boolean;
  error: any;
  clientAppointments: ClientAppointment[];
}

export interface ProductState {
  loading: boolean;
  error: Error | ErrorApi | null;
  products: ProductCategories[];
}

export interface MainState {
  activeView: string;
  clients: any;
  isLoadingClients: boolean;
}
export interface MoveInServiceQueueStatus {
  mailNeedCheck?: boolean;
  FANeedSpecify?: boolean;
  mergeNeed?: boolean;
  busyEmployeeNeedCheck?: boolean;
  needPrint?: boolean;
  employeeClockInNeedCheck?: boolean;
}
export interface ItemsForManualAssignFA {
  deletedIds: number[];
  serviceProvider: {
    serviceEmployeeId: number,
    serviceId: number,
    employeeId: number,
    isRequested: boolean

  }[];
}
export interface QueueState {
  loading: boolean;
  showLoader: boolean;
  stopAutoReload: boolean;
  isCookie: boolean;
  error: any;
  totalClients: number;
  queueLength: number;
  expandedRow: QueueItem | null;
  waitingQueue: QueueItem[];
  serviceQueue: QueueItem[];
  combining: boolean;
  combiningColor: GroupColor;
  combiningClients: CombiningClient[];
  groups: Groups;
  lastGroupId: number;
  updatedGroups: number[];
  queueItem: any;
  timer: number[];
  globalFilter: string;
  mergeableClients: any;
  itemToMoveInServiceQueue: {
    status: MoveInServiceQueueStatus;
    item: QueueItem;
    manualAssignFA: ItemsForManualAssignFA;
  };
  waitTime: Maybe<number>;
}

export interface FormulasState {
  loading: boolean;
  error: any;
  formulasTypes: FormulaType[];
  notesTypes: NoteType[];
  formulas: Formula[] | null;
  originalFormulas: Formula[] | null;
  notes: Note[] | null;
  wereChanges: boolean;
  submitSuccess: boolean;
  originalNotes: Note[] | null;
}

export interface AppointmentEmployeeState {
  providers: AppointmentEmployee[];
  isLoading: boolean;
}

export interface AppointmentState {
  apptGrid: AppointmentGridSettingsInStore;
  apptCards: AppointmentCardsState;
  apptEmployees: AppointmentEmployeeState;
  apptRemarks: string;
  resourcesAppts: ResourceAppointmentsState;
  roomsAppts: RoomsAppointmentsState;
  employeeStats: DayStats;
  bookAnother: AppointmentBookAnother;
  availability: AppointmentAvailabilityState;
  apptBlockCards: BlockTimeCardsState;
  selections: AppointmentGridSelectionState;
  filters: AppointmentGridFiltersState;
  newAppointmentForm: NewAppointmentFormState;
  tooltip: TooltipState;
}

export interface AppointmentGridFiltersState {
  employeesFilters: AppointmentGridEmployeeFilters;
}

export interface AppointmentGridSelectionState {
  cellSelections: CellSelection[];
  focusedCellSelection: CellSelection;
}

export interface AppointmentAvailabilityState {
  entities: AvailabilityItem[];
}

export interface AppointmentCardsState {
  entities: AppointmentCard[];
}

export interface BlockTimeCardsState {
  entities: BlockTimeCard[];
}

export interface ResourceAppointmentsState {
  resources: Resource[];
  resourcesAppointments: ResourceAppointment[];
}

export interface RoomsAppointmentsState {
  rooms: Room[];
  roomsAppointments: RoomAppointment[];
}

export interface CellContextMenuData {
  time: { startTime: string; endTime: string; };
  date: string;
  employee: Maybe<AppointmentEmployee>;
  resource: Maybe<Resource>;
  room: Maybe<Room>;
  ordinal: Maybe<number>;
  isActiveEmployee: boolean;
  isAvailabilityColumn: boolean;
}

export interface CellContextMenuState {
  isOpened: boolean;
  coords: Coords;
  cellCoords: CellCoords;
  data: CellContextMenuData;
}

export interface AppointmentContextMenuState {
  isOpened: boolean;
  coords: Coords;
  appointmentId: number;
  cardCoords: CellCoords;
}

export interface BlockTimeContextMenuState {
  isOpened: boolean;
  coords: Coords;
  blockTimeId: number;
  cardCoords: CellCoords;
}

export interface BookApptContextMenuState {
  isOpened: boolean;
  coords: Coords;
  cellCoords: CellCoords;
  initialData: BookApptContextMenuData;
  conflicts: Conflict[];
  isSubmitting: boolean;
}

export interface ContextMenuState {
  cellContextMenu: CellContextMenuState;
  appointmentContextMenu: AppointmentContextMenuState;
  bookApptContextMenu: BookApptContextMenuState;
  blockTimeContextMenu: BlockTimeContextMenuState;
}

export interface MoveBarState {
  isOpen: boolean;
  items: AppointmentCard[];
  isConfirmModalOpen: boolean;
  moveAllClientsAppointmentsConfirmModal: MoveAllClientsAppointmentsConfirmModal;
  movePartyAppointmentsConfirmModal: MovePartyAppointmentsConfirmModal;
}

export interface MovePartyAppointmentsConfirmModal {
  isOpen: boolean;
  appointments: AppointmentCard[];
  initialAppointment: AppointmentCard;
  stateMachineResult: AppointmentCard[];
  confirmationModalText: string;
}

export interface MoveAllClientsAppointmentsConfirmModal {
  isOpen: boolean;
  appointments: AppointmentCard[];
  initialAppointment: AppointmentCard;
  stateMachineResult: AppointmentCard[];
}

export interface NewAppointmentFormInitialDataBase {
  rebooked: boolean;
  service: Maybe<Service>;
  client: Maybe<Client>;
  subservices: Subservice[];
  provider: Maybe<Provider>;
  bookedByProvider: Maybe<Provider>;
  date: string;
  startTime: string;
  isProviderRequested: boolean;
  resource: Maybe<Resource>;
  room: Maybe<Room>;
  ordinal: Maybe<number>;
  gapTime: Maybe<string>;
  afterTime: Maybe<string>;
}

export interface NewAppointmentFormInitialData extends NewAppointmentFormInitialDataBase {
  appointments: AppointmentCard[];
}

export interface NewAppointmentFormState {
  isOpen: boolean;
  initialData: NewAppointmentFormInitialData;
  selectedProviders: Provider[];
}

export interface RootState {
  main: MainState;
  queue: QueueState;
  employees: EmployeesState;
  providers: ProviderState;
  modals: ModalsState;
  services: ServiceState;
  formulas: FormulasState;
  appointment: AppointmentState;
  error: ErrorState;
  contextMenu: ContextMenuState;
  products: ProductState;
  settings: Settings;
  moveBar: MoveBarState;
  clients: ClientState;
  core: CoreState;
  common: CommonState;
  session: SessionState;
  confirmation: ConfirmationState;
  tooltip: TooltipState;
}

export interface StoreScheduleInterval {
  startsAt: moment.Duration;
  endsAt: moment.Duration;
}

export interface StoreScheduleDuration {
  step: moment.Duration;
  intervals: StoreScheduleInterval[];
}

export interface CoreState {
  print: PrintState;
}

export interface PrintState {
  activeOutlet: Maybe<PrintOutlet>;
}

export interface SessionState {
  loading: boolean;
  error: any;
  sessionInfo: SessionInfo;
  appVersion: string;
  isOldVersion: boolean;
}

export interface ServiceState {
  services: ServiceCategories[];
  servicesDD: Service[];
  isOpenDD: boolean;
  loading: boolean;
  isLoadingServices: boolean;
  newServiceSet: boolean;
  dropDownData: {
    coords: Coords;
    req: ReqUpdateServ;
  };
  error: any;
  selectedServiceIdDD: number | null;
}

export interface ConfirmationState {
  isOpenConfirmationModal: boolean;
  data: Confirmation;
}

export interface ScheduleExceptionsState {
  entities: StoreScheduleException[];
}

export interface StoreInfoState {
  data: Maybe<Store>;
}

export interface StoreState {
  scheduleExceptions: ScheduleExceptionsState;
  info: StoreInfoState;
}

export interface CommonState {
  store: StoreState;
}

export interface ReduxWindowSizeState {
  height: Maybe<number>;
  heightMax: Maybe<number>;
  width: Maybe<number>;
  widthMax: Maybe<number>;
}
