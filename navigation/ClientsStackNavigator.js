// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import ImageHeader from '../components/ImageHeader';

import ClientsScreen from './../screens/clientsScreen';
import NewClientScreen from '../screens/newClientScreen';
import ClientInfoScreen from '../screens/clientInfoScreen';

const ClientsStackNavigator = StackNavigator(
  {
    ClientsMain: {
      screen: ClientsScreen,
    },
    NewClient: {
      screen: NewClientScreen,
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    ClientInfo: {
      screen: ClientInfoScreen,
      navigationOptions: { tabBarVisible: false },
    },
  },
  {},
);

export default ClientsStackNavigator;
