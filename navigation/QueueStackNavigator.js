// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import ImageHeader from '../components/ImageHeader';

import QueueScreen from './../screens/queueScreen';
import QueueCombineScreen from './../screens/queueCombineScreen';
import ClientMergeScreen from './../screens/ClientMergeScreen';
import QueueDetailScreen from './../screens/queueDetailScreen';

import WalkInScreen from '../screens/walkinScreen';
import WalkInHeader from '../screens/walkinScreen/components/WalkInHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';

import ClientsScreen from './../screens/clientsScreen';

import ProvidersScreen from '../screens/providersScreen';
import NewClientScreen from '../screens/newClientScreen';
import PromotionsScreen from '../screens/promotionsScreen/index';
import ServicesScreen from '../screens/servicesScreen';
import TurnAwayScreen from '../screens/turnAwayScreen';
import WalkOutScreen from '../screens/walkOutScreen';

import HeaderLeftText from '../components/HeaderLeftText';

import ModifyServiceScreen from '../screens/modifyServiceScreen';
import ModifyProductScreen from '../screens/modifyProductScreen';
import RecommendationsScreen from '../screens/recommendationsScreen';

import AppointmentDetailsScreen from './../screens/appointmentDetailsScreen/';
import NewAppointmentScreen from '../screens/newAppointmentScreen';

import ClientNotes from './../screens/clientInfoScreen/components/clientNotes';
import ClientFormulas from './../screens/clientInfoScreen/components/clientFormulas';
import ClientNote from './../screens/clientInfoScreen/components/clientNote';
import ClientFormula from './../screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from './../screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '../screens/clientInfoScreen';
import ClientDetailsScreen from '../screens/clientInfoScreen/components/clientDetails';

import ProductsScreen from './../screens/productsScreen';
import RebookDialogScreen from './../screens/rebookDialogScreen';
import AppointmentCalendarScreen from './../screens/appointmentCalendarScreen';

import AppointmentScreen from '../screens/AppointmentsScreen';
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
    NewClient: {
      screen: NewClientScreen,
      navigationOptions: { tabBarVisible: false },
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
    Walkout: {
      screen: WalkOutScreen,
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
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
      navigationOptions: { tabBarVisible: false },
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
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
        header: props => <ImageHeader {...props} {...rootProps} />,
      }),
      navigationOptions: { tabBarVisible: false },
    },
    ChangeClient: {
      screen: ClientsScreen,
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
    },
  },
);

export default (QueueStackNavigator = StackNavigator(
  {
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
  },
  {
    mode: 'modal', // Remember to set the root navigator to display modally.
    //  headerMode: 'none', // This ensures we don't get two top bars.
  },
));
