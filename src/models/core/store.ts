import { AuthReducer } from "@/redux/reducers/auth";
import { SettingsReducer } from "@/redux/reducers/settings";
import { QueueReducer } from "@/redux/reducers/queue";
import { WalkInReducer } from "@/redux/reducers/walkIn";
import { ClientsReducer } from "@/redux/reducers/clients";
import { ApptNotesReducer } from "@/redux/reducers/appointmentNotes";
import { SalonSearchHeaderReducer } from "@/redux/reducers/searchHeader";
import { CheckInReducer } from "@/redux/reducers/checkin";
import { ServicesReducer } from "@/redux/reducers/service";
import { ProvidersReducer } from "@/redux/reducers/providers";
import { ProductsReducer } from "@/redux/reducers/products";
import { AppointmentReducer } from "@/redux/reducers/appointment";
import { ApptBookReducer } from "@/redux/reducers/appointmentBook";
import { EmployeeOrderReducer } from "@/redux/reducers/apptBookSetEmployeeOrder";
import { NewAppointmentReducer } from "@/redux/reducers/newAppointment";
import { RoomAssignmentReducer } from "@/redux/reducers/roomAssignment";
import { EmployeeScheduleReducer } from "@/redux/reducers/employeeSchedule";
import { TurnAwayReducer } from "@/redux/reducers/turnAway";
import { BlockTimeReducer } from "@/redux/reducers/blockTime";
import { BlockTimeReasonsReducer } from "@/redux/reducers/blockTimesReasons";
import { TurnAwayReasonsReducer } from "@/redux/reducers/turnAwayReasons";
import { ClientNotesReducer } from "@/redux/reducers/clientNotes";
import { ClientFormulasReducer } from "@/redux/reducers/clientFormulas";
import { ClientInfoReducer } from "@/redux/reducers/clientInfo";
import { ClientApptReducer } from "@/redux/reducers/clientAppointments";
import { UserInfoReducer } from "@/redux/reducers/userInfo";
import { StoreReducer } from "@/redux/reducers/store";
import { RootDrawerNavigatorReducer } from "@/redux/reducers/rootDrawerNavigator";
import { RebookReducer } from "@/redux/reducers/rebookDialog";
import { QueueDetailReducer } from "@/redux/reducers/queueDetail";
import { PromotionsReducer } from "@/redux/reducers/promotions";
import { RemovalReasonTypesReducer } from "@/redux/reducers/removalReasonTypes";
import { ScheduleReducer } from "@/redux/reducers/schedule";
import { NavigationReducer } from "@/redux/reducers/navigation";

export interface AppStore {
  auth: AuthReducer,
  settingsReducer: SettingsReducer,
  queue: QueueReducer,
  walkInReducer: WalkInReducer,
  clientsReducer: ClientsReducer,
  formCache: any,
  appointmentNotesReducer: ApptNotesReducer,
  salonSearchHeaderReducer: SalonSearchHeaderReducer,
  checkinReducer: CheckInReducer,
  serviceReducer: ServicesReducer,
  providersReducer: ProvidersReducer,
  productsReducer: ProductsReducer,
  appointmentReducer: AppointmentReducer,
  appointmentBookReducer: ApptBookReducer,
  apptBookViewOptionsReducer: any,
  apptBookSetEmployeeOrderReducer: EmployeeOrderReducer,
  newAppointmentReducer: NewAppointmentReducer,
  modifyApptReducer: any,
  formulasAndNotesReducer: any,
  roomAssignmentReducer: RoomAssignmentReducer,
  employeeScheduleReducer: EmployeeScheduleReducer,
  turnAwayReducer: TurnAwayReducer,
  blockTimeReducer: BlockTimeReducer,
  blockTimesReasonsReducer: BlockTimeReasonsReducer,
  turnAwayReasonsReducer: TurnAwayReasonsReducer,
  clientNotesReducer: ClientNotesReducer,
  clientFormulasReducer: ClientFormulasReducer,
  clientInfoReducer: ClientInfoReducer,
  clientAppointmentsReducer: ClientApptReducer,
  userInfoReducer: UserInfoReducer,
  storeReducer: StoreReducer,
  rootDrawerNavigator: RootDrawerNavigatorReducer,
  rebookReducer: RebookReducer,
  queueDetailReducer: QueueDetailReducer,
  promotionsReducer: PromotionsReducer,
  removalReasonTypesReducer: RemovalReasonTypesReducer,
  scheduleReducer: ScheduleReducer,
  navigationReducer: NavigationReducer,
}