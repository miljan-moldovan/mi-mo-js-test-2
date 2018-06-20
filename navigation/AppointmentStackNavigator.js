// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

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
// import ClientNotes from './../screens/clientNotes';

import AppointmentCalendarScreen from './../screens/appointmentCalendarScreen';
import apptBookSetEmployeeOrder from './../screens/apptBookSetEmployeeOrder';
import apptBookViewOptions from './../screens/apptBookViewOptions';

import AppoinmentNotes from './../screens/appointmentDetailsScreen/components/appointmentNotes';
import AppointmentFormula from './../screens/appointmentDetailsScreen/components/appointmentFormulas/AppointmentFormula';

import ModifyApptServiceScreen from './../screens/apptBookModifyService';
import FilterOptionsScreen from './../screens/filterOptionsScreen';
import FilterByPositionScreen from './../screens/filterByPositionScreen';
import FilterByCompanyScreen from './../screens/filterByCompanyScreen';
import ServiceCheckScreen from './../screens/serviceCheckScreen';
import ServiceCheckResultScreen from './../screens/serviceCheckResultScreen';
import EndsOnScreen from './../screens/endsOnScreen';
import RepeatsOnScreen from './../screens/repeatsOnScreen';
import ModifyAppointmentScreen from '../screens/modifyAppointmentScreen';
import ConflictsScreen from '../screens/conflictsScreen';
import AddonServicesScreen from '../screens/addonServicesScreen';
import RecommendedServicesScreen from '../screens/recommendedServicesScreen';
import RequiredServicesScreen from '../screens/requiredServicesScreen';

import SelectRoomScreen from '../screens/apptBookSelectRoom';

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
    EndsOn: {
      screen: EndsOnScreen,
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
    AppointmentFormula: {
      screen: AppointmentFormula,
    },
    AppointmentNotes: {
      screen: AppoinmentNotes,
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
    // ModifyService2: {
    //   screen: ModifyServiceScreen,
    // },
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
    // ClientNotes: {
    //   screen: ClientNotes,
    // },
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
