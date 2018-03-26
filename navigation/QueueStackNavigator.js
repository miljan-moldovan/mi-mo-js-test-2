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

import AppointmentDetailsScreen from './../screens/appointmentDetailsScreen/AppointmentDetailsScreen';
import AppoinmentNotes from './../screens/appointmentDetailsScreen/components/appointmentNotes';
import AppointmentFormula from './../screens/appointmentDetailsScreen/components/appointmentFormulas/AppointmentFormula';
import NewAppointmentScreen from '../screens/NewAppointmentScreen';
import AppointmentNoteScreen from './../screens/appointmentNote';

import ProductsScreen from './../screens/productsScreen';
import RebookDialogScreen from './../screens/rebookDialogScreen';

import AppointmentScreen from '../screens/AppointmentsScreen.js';


import apptBookViewOptions from './../screens/apptBookViewOptions';


import apptBookSetEmployeeOrder from './../screens/apptBookSetEmployeeOrder';

const QueueStackNavigator = StackNavigator(
  {
    Main: {
      screen: QueueScreen,
      navigationOptions: {
        headerTitle: 'Queue',
      },
    },
    ApptBookSetEmployeeOrder: {
      screen: apptBookSetEmployeeOrder,
    },
    Products: {
      screen: ProductsScreen,
    },
    Services: {
      screen: ServicesScreen,
    },
    ApptBookViewOptions: {
      screen: apptBookViewOptions,
    },
    Appointment: {
      screen: AppointmentScreen,
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
    },
    Service: {
      screen: ModifyServiceScreen,
    },
    Walkout: {
      screen: WalkOutScreen,
      navigationOptions: {
        headerTitle: 'Walkout',
      },
    },
    AppointmentFormula: {
      screen: AppointmentFormula,
    },
    AppointmentNotes: {
      screen: AppoinmentNotes,
    },
    AppointmentNote: {
      screen: AppointmentNoteScreen,
      navigationOptions: {
        headerMode: 'none',
        gesturesEnabled: false,
        header: props => (<View />),
      },
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
    },
    QueueCombine: {
      screen: QueueCombineScreen,
    },
    ClientMerge: {
      screen: ClientMergeScreen,
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
    },
    Providers: {
      screen: ProvidersScreen,
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
      navigationOptions: rootProps => ({
        headerTitle: 'Turn Away',
        headerLeft: HeaderLeftText({
          ...rootProps,
          handlePress: () => rootProps.navigation.goBack(),
        }),
        headerRight: <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Done</Text>,
      }),
    },
  },
  {
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
export default QueueStackNavigator;
