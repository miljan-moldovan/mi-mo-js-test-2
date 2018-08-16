// @flow
import React from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Icon from '../components/UI/Icon';

import AppointmentScreen from '../screens/AppointmentsScreen';
import NewAppointmentScreen from '../screens/newAppointmentScreen';
import ProvidersScreen from '../screens/providersScreen';
import ServicesScreen from '../screens/servicesScreen';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';
import HeaderLeftText from '../components/HeaderLeftText';

import HeaderLateral from '../components/HeaderLateral';
import SalonSearchBar from '../components/SalonSearchBar';
import ClientsScreen from './../screens/clientsScreen';
import ClientNotes from './../screens/clientNotes';
import ClientFormulas from './../screens/clientInfoScreen/components/clientFormulas';
import ClientNote from './../screens/clientInfoScreen/components/clientNote';
import ClientFormula from './../screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from './../screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '../screens/clientInfoScreen';
import ClientDetailsScreen from '../screens/clientInfoScreen/components/clientDetails';

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
import ApptBookTurnAwayScreen from './../screens/apptBookTurnAwayScreen';
import RepeatsOnScreen from './../screens/repeatsOnScreen';
import ModifyAppointmentScreen from '../screens/modifyAppointmentScreen';
import ConflictsScreen from '../screens/conflictsScreen';
import AddonServicesScreen from '../screens/addonServicesScreen';
import RecommendedServicesScreen from '../screens/recommendedServicesScreen';
import RequiredServicesScreen from '../screens/requiredServicesScreen';
import ProductsScreen from './../screens/productsScreen';

import SelectRoomScreen from '../screens/apptBookSelectRoom';
import SelectResourceScreen from '../screens/apptBookSelectResource';

import RoomAssignmentScreen from '../screens/roomAssignmentScreen';
import ChangeDateTimeScreen from '../screens/newAppointmentScreen/components/ChangeDateTimeScreen';
import CancelAppointmentScreen from '../screens/cancelAppointment';
import ShowApptScreen from '../screens/showAppointmentsScreen';

const AppointmentStackNavigator = StackNavigator(
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
      navigationOptions: { tabBarVisible: false },
    },
    BlockTime: {
      screen: BlockTimeScreen,
      navigationOptions: { tabBarVisible: false },
    },
    BlockTimesReasons: {
      screen: BlockTimesReasonsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ApptBookTurnAway: {
      screen: ApptBookTurnAwayScreen,
      navigationOptions: { tabBarVisible: false },
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
    Appointments: {
      screen: AppointmentScreen,
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
    },
    ModifyAppointment: {
      screen: ModifyAppointmentScreen,
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
      navigationOptions: { tabBarVisible: false },
    },
    ClientFormulas: {
      screen: ClientFormulas,
      navigationOptions: { tabBarVisible: false },
    },
    ClientNote: {
      screen: ClientNote,
      navigationOptions: { tabBarVisible: false },
    },
    ClientFormula: {
      screen: ClientFormula,
      navigationOptions: { tabBarVisible: false },
    },
    ClientCopyFormula: {
      screen: ClientCopyFormulaScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientInfo: {
      screen: ClientInfoScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      navigationOptions: { tabBarVisible: false },
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
      navigationOptions: rootProps => ({
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitle: 'Clients',
        headerLeft: HeaderLateral({
          handlePress: () => rootProps.navigation.goBack(),
          button: (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                name="angleLeft"
                type="regular"
                size={22}
                color="white"
              />
            </View>
          ),
        }),
        //       headerRight: HeaderLateral({
        //         handlePress: () => rootProps.params.handlePress(),
        //         params: rootProps.navigation.state.params,
        //         button:
        //         <View style={{
        //           flex: 1,
        //           flexDirection: 'row',
        //           alignItems: 'center',
        //           justifyContent: 'center',
        //           }}
        //         >
        //   <Image
        //     style={{
        //             width: 24,
        //             height: 24,
        //           }}
        //     source={require('../assets/images/icons/icon_filter.png')}
        //   />
        // </View>,
        //       }),
        header: props => (
          <ImageHeader
            {...props}
            params={rootProps.navigation.state.params}
            searchBar={searchProps => (
              <SalonSearchBar
                {...searchProps}
                placeholder="Search by name, phone or email"
                searchIconPosition="right"
              />)}
          />),
      }),
    },
    CancelAppointmentScreen: {
      screen: CancelAppointmentScreen,
    },
    ShowApptScreen: {
      screen: ShowApptScreen,
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#115ECD',
        paddingLeft: 10,
        paddingRight: 10,
        height: 44,
        borderWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,

      },
      headerTitleStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        color: '#fff',
      },
      drawerLabel: props => (
        <SideMenuItem
          {...props}
          title="Appointments"
          icon={require('../assets/images/sidemenu/icon_appoint_menu.png')}
        />
      ),
    },
  },
);
export default AppointmentStackNavigator;
