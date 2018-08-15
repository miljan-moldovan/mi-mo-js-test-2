// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { View } from 'react-native';
import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';

import ClientsScreen from './../screens/clientsScreen';
import NewClientScreen from '../screens/newClientScreen';

const ClientsStackNavigator = StackNavigator(
  {
    Clients: {
      screen: ClientsScreen,
    },
    NewClient: {
      screen: NewClientScreen,
      navigationOptions: { tabBarVisible: false },
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'transparent',
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
          title="Queue"
          icon={require('../assets/images/sidemenu/icon_queue_menu.png')}
        />
      ),
    },
  },
);

export default ClientsStackNavigator;
