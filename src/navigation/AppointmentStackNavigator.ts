import { get } from 'lodash';
import { createStackNavigator } from 'react-navigation';

import NewAppointmentScreen from '../screens/newAppointmentScreen';
import ProvidersScreen from '../screens/providersScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ClientsScreen from '../screens/clientsScreen';
import ClientNotes from '../screens/clientInfoScreen/components/clientNotes';
import ClientFormulas from '../screens/clientInfoScreen/components/clientFormulas';
import ClientNote from '../screens/clientInfoScreen/components/clientNote';
import ClientFormula from '../screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from '../screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '../screens/clientInfoScreen';
import ClientDetailsScreen from '../screens/clientInfoScreen/components/clientDetails';
import NewClientScreen from '../screens/newClientScreen';
import AppointmentCalendarScreen from '../screens/appointmentCalendarScreen';
import apptBookSetEmployeeOrder from '../screens/apptBookSetEmployeeOrder';
import apptBookViewOptions from '../screens/apptBookViewOptions';
import ModifyApptServiceScreen from '../screens/apptBookModifyService';
import FilterOptionsScreen from '../screens/filterOptionsScreen';
import FilterByPositionScreen from '../screens/filterByPositionScreen';
import FilterByCompanyScreen from '../screens/filterByCompanyScreen';
import ServiceCheckScreen from '../screens/serviceCheckScreen';
import ServiceCheckResultScreen from '../screens/serviceCheckResultScreen';
import EndsOnScreen from '../screens/endsOnScreen';
import EditScheduleScreen from '../screens/editScheduleScreen';
import BlockTimeScreen from '../screens/blockTimeScreen';
import BlockTimesReasonsScreen from '../screens/blockTimesReasons';
import TurnAwayScreen from '../screens/turnAwayScreen';
import RepeatsOnScreen from '../screens/repeatsOnScreen';
import ConflictsScreen from '../screens/conflictsScreen';
import AddonServicesScreen from '../screens/addonServicesScreen';
import RecommendedServicesScreen from '../screens/recommendedServicesScreen';
import RequiredServicesScreen from '../screens/requiredServicesScreen';
import ProductsScreen from '../screens/productsScreen';
import RecommendProductScreen from '../screens/recommendProductScreen';
import RoomAssignmentScreen from '../screens/roomAssignmentScreen';
import ChangeDateTimeScreen from '../screens/newAppointmentScreen/components/ChangeDateTimeScreen';
import CancelAppointmentScreen from '../screens/cancelAppointment';
import ShowApptScreen from '../screens/showAppointmentsScreen';
import RebookDialogScreen from '../screens/rebookDialogScreen';
import SelectRoomScreen from '../screens/SelectRoomScreen';
import SelectResourceScreen from '../screens/SelectResourceScreen';
import TransitionConfiguration from './transitionConfiguration';

const AppointmentStackNavigator = createStackNavigator(
  {
    SalonCalendar: {
      screen: AppointmentCalendarScreen,
    },
    ApptBookSetEmployeeOrder: {
      screen: apptBookSetEmployeeOrder,
    },
    ApptBookViewOptions: {
      screen: apptBookViewOptions,
    },
    ApptBookProducts: {
      screen: ProductsScreen,
    },
    EndsOn: {
      screen: EndsOnScreen,
    },
    EditSchedule: {
      screen: EditScheduleScreen,
    },
    RecommendProduct: {
      screen: RecommendProductScreen,
    },
    BlockTime: {
      screen: BlockTimeScreen,
    },
    BlockTimesReasons: {
      screen: BlockTimesReasonsScreen,
    },
    TurnAway: {
      screen: TurnAwayScreen,
    },
    ModifyApptService: {
      screen: ModifyApptServiceScreen,
    },
    AddonServices: {
      screen: AddonServicesScreen,
    },
    RecommendedServices: {
      screen: RecommendedServicesScreen,
    },
    RequiredServices: {
      screen: RequiredServicesScreen,
    },
    RepeatsOn: {
      screen: RepeatsOnScreen,
    },
    FilterOptions: {
      screen: FilterOptionsScreen,
    },
    FilterByPosition: {
      screen: FilterByPositionScreen,
    },
    FilterByCompany: {
      screen: FilterByCompanyScreen,
    },
    ServiceCheck: {
      screen: ServiceCheckScreen,
    },
    ServiceCheckResult: {
      screen: ServiceCheckResultScreen,
    },
    RebookDialog: {
      screen: RebookDialogScreen,
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
    },
    Conflicts: {
      screen: ConflictsScreen,
    },
    ChangeNewApptDateTime: {
      screen: ChangeDateTimeScreen,
    },
    RoomAssignment: {
      screen: RoomAssignmentScreen,
    },
    ApptBookClient: {
      screen: ClientsScreen,
    },
    ReferredClients: {
      screen: ClientsScreen,
    },
    ApptBookService: {
      screen: ServicesScreen,
    },
    ApptBookProvider: {
      screen: ProvidersScreen,
    },
    SelectRoom: {
      screen: SelectRoomScreen,
    },
    SelectResource: {
      screen: SelectResourceScreen,
    },
    ClientNotes: {
      screen: ClientNotes,
    },
    ClientFormulas: {
      screen: ClientFormulas,
    },
    ClientNote: {
      screen: ClientNote,
    },
    ClientFormula: {
      screen: ClientFormula,
    },
    ClientCopyFormula: {
      screen: ClientCopyFormulaScreen,
    },
    ClientInfo: {
      screen: ClientInfoScreen,
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
    },
    NewClient: {
      screen: NewClientScreen,
    },
    Services: {
      screen: ServicesScreen,
    },
    Providers: {
      screen: ProvidersScreen,
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    CancelAppointmentScreen: {
      screen: CancelAppointmentScreen,
    },
    ShowApptScreen: {
      screen: ShowApptScreen,
    },
  },
  {
    initialRouteName: 'SalonCalendar',
    headerMode: 'float',
    transitionConfig: TransitionConfiguration,
  },
);

AppointmentStackNavigator.navigationOptions = ({ navigation }) => {
  const { state } = navigation;
  let tabBarVisible = true;
  const routes = get(state, 'routes[0].routes', []);
  if (state.index > 0 || routes.length > 1) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};
export default AppointmentStackNavigator;
