// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import AppointmentScreen from '../screens/AppointmentsScreen.js';
import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';

const AppointmentStackNavigator = StackNavigator(
  {
    Main: {
      screen: AppointmentScreen,
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'transparent',
        paddingLeft: 10,
        paddingRight: 10,
      },
      header: props => <ImageHeader {...props} />,
      headerTitleStyle: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        color: '#fff',
      },
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
