import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Icon from '../components/UI/Icon';
import headerStyles from '../constants/headerStyles';

import AppointmentScreen from '../screens/AppointmentsScreen';
import NewAppointmentScreen from '../screens/newAppointmentScreen';
import ProvidersScreen from '../screens/providersScreen';
import ServicesScreen from '../screens/servicesScreen';

import ImageHeader from '../components/ImageHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';
import HeaderLeftText from '../components/HeaderLeftText';

import HeaderLateral from '../components/HeaderLateral';
import SalonSearchBar from '../components/SalonSearchBar';
import ClientsScreen from './../screens/clientsScreen';
import ClientNotes from './../screens/clientInfoScreen/components/clientNotes';
import ClientFormulas from './../screens/clientInfoScreen/components/clientFormulas';
import ClientNote from './../screens/clientInfoScreen/components/clientNote';
import ClientFormula from './../screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from './../screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '../screens/clientInfoScreen';
import ClientDetailsScreen from '../screens/clientInfoScreen/components/clientDetails';
import NewClientScreen from '../screens/newClientScreen';

import AppointmentCalendarScreen from './../screens/appointmentCalendarScreen';
import apptBookSetEmployeeOrder from './../screens/apptBookSetEmployeeOrder';
import apptBookViewOptions from './../screens/apptBookViewOptions';

import ModifyApptServiceScreen from './../screens/apptBookModifyService';
import FilterOptionsScreen from './../screens/filterOptionsScreen';
import FilterByPositionScreen from './../screens/filterByPositionScreen';
import FilterByCompanyScreen from './../screens/filterByCompanyScreen';
import ServiceCheckScreen from './../screens/serviceCheckScreen';
import ServiceCheckResultScreen from './../screens/serviceCheckResultScreen';
import EndsOnScreen from './../screens/endsOnScreen';
import EditScheduleScreen from './../screens/editScheduleScreen';
import BlockTimeScreen from './../screens/blockTimeScreen';
import BlockTimesReasonsScreen from './../screens/blockTimesReasons';
import TurnAwayScreen from './../screens/turnAwayScreen';
import RepeatsOnScreen from './../screens/repeatsOnScreen';
import ConflictsScreen from '../screens/conflictsScreen';
import AddonServicesScreen from '../screens/addonServicesScreen';
import RecommendedServicesScreen from '../screens/recommendedServicesScreen';
import RequiredServicesScreen from '../screens/requiredServicesScreen';
import ProductsScreen from './../screens/productsScreen';
import RecommendProductScreen from '../screens/recommendProductScreen';
import RecommendProductHeader from '../screens/recommendProductScreen/components/RecommendProductHeader';

import SelectRoomScreen from '../screens/apptBookSelectRoom';
import SelectResourceScreen from '../screens/apptBookSelectResource';

import RoomAssignmentScreen from '../screens/roomAssignmentScreen';
import ChangeDateTimeScreen from '../screens/newAppointmentScreen/components/ChangeDateTimeScreen';
import CancelAppointmentScreen from '../screens/cancelAppointment';
import ShowApptScreen from '../screens/showAppointmentsScreen';

import RebookDialogScreen from './../screens/rebookDialogScreen';
import TransitionConfiguration from './transitionConfiguration';


import styles from './styles';

const AppointmentStackNavigator = createStackNavigator(
  {
    Main: {
      screen: AppointmentCalendarScreen,
    },
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
      // navigationOptions: { tabBarVisible: false },
    },
    RecommendProduct: {
      screen: RecommendProductScreen,
      // navigationOptions: rootProps => ({
      //   headerTitle: <RecommendProductHeader rootProps={rootProps} />,
      //   tabBarVisible: false,
      // }),
    },
    BlockTime: {
      screen: BlockTimeScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    BlockTimesReasons: {
      screen: BlockTimesReasonsScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    TurnAway: {
      screen: TurnAwayScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ModifyApptService: {
      screen: ModifyApptServiceScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    AddonServices: {
      screen: AddonServicesScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    RecommendedServices: {
      screen: RecommendedServicesScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    RequiredServices: {
      screen: RequiredServicesScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    RepeatsOn: {
      screen: RepeatsOnScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    FilterOptions: {
      screen: FilterOptionsScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    FilterByPosition: {
      screen: FilterByPositionScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    FilterByCompany: {
      screen: FilterByCompanyScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ServiceCheck: {
      screen: ServiceCheckScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ServiceCheckResult: {
      screen: ServiceCheckResultScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    Appointments: {
      screen: AppointmentScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    RebookDialog: {
      screen: RebookDialogScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    Conflicts: {
      screen: ConflictsScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ChangeNewApptDateTime: {
      screen: ChangeDateTimeScreen,
    },
    RoomAssignment: {
      screen: RoomAssignmentScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ApptBookClient: {
      screen: ClientsScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ApptBookService: {
      screen: ServicesScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ApptBookProvider: {
      screen: ProvidersScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    SelectRoom: {
      screen: SelectRoomScreen,
    },
    SelectResource: {
      screen: SelectResourceScreen,
    },
    ClientNotes: {
      screen: ClientNotes,
      // navigationOptions: { tabBarVisible: false },
    },
    ClientFormulas: {
      screen: ClientFormulas,
      // navigationOptions: { tabBarVisible: false },
    },
    ClientNote: {
      screen: ClientNote,
      // navigationOptions: { tabBarVisible: false },
    },
    ClientFormula: {
      screen: ClientFormula,
      // navigationOptions: { tabBarVisible: false },
    },
    ClientCopyFormula: {
      screen: ClientCopyFormulaScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ClientInfo: {
      screen: ClientInfoScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    NewClient: {
      screen: NewClientScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    Services: {
      screen: ServicesScreen,
      navigationOptions: rootProps => ({
        headerTitle: <WalkInStepHeader dataName="selectedService" rootProps={rootProps} />,
      }),
    },
    Providers: {
      screen: ProvidersScreen,
      navigationOptions: rootProps => ({
        headerLeft: HeaderLeftText({ handlePress: () => rootProps.navigation.goBack() }),
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitle: <WalkInStepHeader dataName="selectedProvider" rootProps={rootProps} />,
        header: props => (
          <ImageHeader
            {...props}
          />),
      }),
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    CancelAppointmentScreen: {
      screen: CancelAppointmentScreen,
      // navigationOptions: { tabBarVisible: false },
    },
    ShowApptScreen: {
      screen: ShowApptScreen,
    },
  },
  {
    transitionConfig: TransitionConfiguration,
    headerMode: 'float',
  },
);

AppointmentStackNavigator.navigationOptions = ({ navigation }) => {
  const { state } = navigation;

  let tabBarVisible = true;


  const hideTabBar = state.routes[state.routes.length - 1].params ?
    state.routes[state.routes.length - 1].params.hideTabBar : false;

  if (state.index > 1 || hideTabBar) {
    tabBarVisible = false;
  }

  return {
    ...headerStyles,
    tabBarVisible,
  };
};

export default AppointmentStackNavigator;
