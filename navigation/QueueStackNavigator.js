// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';

import QueueScreen from './../screens/QueueScreen';
import QueueCombineScreen from './../screens/QueueCombineScreen';
import ClientMergeScreen from './../screens/ClientMergeScreen';
import QueueDetailScreen from './../screens/QueueDetailScreen';

import WalkInScreen from '../screens/walkinScreen';
import WalkInHeader from '../screens/walkinScreen/components/WalkInHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';

import ClientsScreen from './../screens/clientsScreen';
import ClientDetailsScreen from '../screens/clientDetailsScreen';

import ProvidersScreen from '../screens/providersScreen';
import NewClientScreen from '../screens/NewClientScreen';
import PromotionsScreen from '../screens/promotionsScreen';
import ServicesScreen from '../screens/servicesScreen';
import TurnAwayScreen from '../screens/turnAwayScreen';
import WalkOutScreen from '../screens/walkOutScreen';

import HeaderLateral from '../components/HeaderLateral';
import HeaderLeftText from '../components/HeaderLeftText';
import SalonSearchHeader from '../components/SalonSearchHeader';

import ModifyServiceScreen from '../screens/modifyServiceScreen';
import ModifyProductScreen from '../screens/modifyProductScreen';
import RecommendationsScreen from '../screens/recommendationsScreen';

import AppointmentDetailsScreen from './../screens/appointmentDetailsScreen/';
import AppoinmentNotes from './../screens/appointmentDetailsScreen/components/appointmentNotes';
import AppointmentFormula from './../screens/appointmentDetailsScreen/components/appointmentFormulas/AppointmentFormula';
import NewAppointmentScreen from '../screens/newAppointmentScreen';
import AppointmentNoteScreen from './../screens/appointmentNote';

import ProductsScreen from './../screens/productsScreen';
import RebookDialogScreen from './../screens/rebookDialogScreen';
import SalonCalendar from './../components/SalonCalendar';
import AppointmentCalendarScreen from './../screens/appointmentCalendarScreen';

import AppointmentScreen from '../screens/AppointmentsScreen.js';
import apptBookSetEmployeeOrder from './../screens/apptBookSetEmployeeOrder';
import apptBookViewOptions from './../screens/apptBookViewOptions';

import SettingsScreen from './../screens/SettingsScreen';

const MainNavigator = StackNavigator(
  {
    Main: {
      screen: QueueScreen,
      navigationOptions: {
        headerTitle: 'Queue',
      },
    },
    SalonCalendar: {
      screen: AppointmentCalendarScreen,
    },
    ApptBookSetEmployeeOrder: {
      screen: apptBookSetEmployeeOrder,
      navigationOptions: { tabBarVisible: false },
    },
    ApptBookViewOptions: {
      screen: apptBookViewOptions,
      navigationOptions: { tabBarVisible: false },
    },
    Products: {
      screen: ProductsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Services: {
      screen: ServicesScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Appointment: {
      screen: AppointmentScreen,
    },
    // Service: {
    //   screen: ModifyServiceScreen,
    // },
    Walkout: {
      screen: WalkOutScreen,
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    AppointmentFormula: {
      screen: AppointmentFormula,
      navigationOptions: { tabBarVisible: false },
    },
    AppointmentNotes: {
      screen: AppoinmentNotes,
      navigationOptions: { tabBarVisible: false },
    },
    Service: {
      screen: ModifyServiceScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Product: {
      screen: ModifyProductScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Recommendations: {
      screen: RecommendationsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    RebookDialog: {
      screen: RebookDialogScreen,
      navigationOptions: {
        headerMode: 'none',
        gesturesEnabled: false,
        header: props => (<View />),
      },
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      navigationOptions: {
        headerTitle: 'Details',
      },
    },
    QueueDetail: {
      screen: QueueDetailScreen,
      navigationOptions: { tabBarVisible: false },
    },
    QueueCombine: {
      screen: QueueCombineScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientMerge: {
      screen: ClientMergeScreen,
      navigationOptions: { tabBarVisible: false },
    },
    WalkIn: {
      screen: WalkInScreen,
      navigationOptions: rootProps => ({
        headerTitle: <WalkInHeader rootProps={rootProps} />,
        headerLeft: HeaderLeftText({
          ...rootProps,
          handlePress: () => rootProps.navigation.goBack(),
        }),
      }),
      navigationOptions: { tabBarVisible: false },
    },
    Providers: {
      screen: ProvidersScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Promotions: {
      screen: PromotionsScreen,
      navigationOptions: rootProps => ({
        headerTitle: <WalkInStepHeader dataName="selectedPromotion" rootProps={rootProps} />,
        header: props => (
          <ImageHeader
            {...props}
            {...rootProps}
          />),
      }),
      navigationOptions: { tabBarVisible: false },
    },
    Clients: {
      screen: ClientsScreen,
    },
    NewClient: {
      screen: NewClientScreen,
      navigationOptions: {
        headerTitle: 'Create New Client',
        headerLeft: <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Cancel</Text>,
        headerRight: <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Save</Text>,
      },
    },
    TurnAway: {
      screen: TurnAwayScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Settings: { screen: SettingsScreen },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#115ECD',
        paddingHorizontal: 10,
        paddingVertical: 14,
        paddingTop: 20,
        // height: 44,
        // height: 35,
        borderWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        justifyContent: 'center',
        // alignItems: 'center'
      },
      headerTitleStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        color: '#fff',
        fontWeight: '500',
        // backgroundColor: 'red',
        height: '100%',
      },
      drawerLabel: props => (
        <SideMenuItem
          {...props}
          title="Queue"
          icon={require('../assets/images/sidemenu/icon_queue_menu.png')}
        />
      ),
    },
  },
);


export default QueueStackNavigator = StackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: { headerMode: 'none' },
  },

  /** MODAL SCREENS GO HERE * */
  ModalServices: {
    screen: ServicesScreen,
    navigationOptions: {

      tabBarVisible: false,
      headerMode: 'screen',
      gesturesEnabled: false,
    },
  },
  ModalProviders: {
    screen: ProvidersScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#115ECD',
        paddingHorizontal: 10,
        paddingVertical: 14,
        paddingTop: 20,
        borderWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        justifyContent: 'center',
      },
      tabBarVisible: false,
      headerMode: 'screen',
      gesturesEnabled: false,
    },
  },
  ModalClients: {
    screen: ClientsScreen,
    navigationOptions: { tabBarVisible: false, headerMode: 'screen', gesturesEnabled: false },
  },
  AppointmentNote: {
    screen: AppointmentNoteScreen,
    navigationOptions: {
      tabBarVisible: false, headerMode: 'screen', gesturesEnabled: false,
    },
  },
}, {
  mode: 'modal', // Remember to set the root navigator to display modally.
//  headerMode: 'none', // This ensures we don't get two top bars.
});
