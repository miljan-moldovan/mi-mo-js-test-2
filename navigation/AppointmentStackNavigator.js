// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import AppointmentScreen from '../screens/AppointmentsScreen.js';
import NewAppointmentScreen from '../screens/NewAppointmentScreen.js';
import ProvidersScreen from '../screens/providersScreen';
import NewClientScreen from '../screens/NewClientScreen';
import PromotionsScreen from '../screens/promotionsScreen';
import ServicesScreen from '../screens/servicesScreen';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';

const AppointmentStackNavigator = StackNavigator(
  {
    Appointments: {
      screen: AppointmentScreen,
    },
    NewAppointment: {
      screen: NewAppointmentScreen
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
  },
  {
    navigationOptions: {
      // headerStyle: {
      //   backgroundColor: 'transparent',
      //   paddingLeft: 10,
      //   paddingRight: 10,
      // },
      // header: props => <ImageHeader {...props} />,
      // headerTitleStyle: {
      //   fontFamily: 'OpenSans-Regular',
      //   fontSize: 20,
      //   color: '#fff',
      // },
      drawerLabel: props => (
        <SideMenuItem
          {...props}
          title="Appointments"
          icon={require('../assets/images/sidemenu/icon_appoint_menu.png')} />
      ),
    },
  },
);
export default AppointmentStackNavigator;
