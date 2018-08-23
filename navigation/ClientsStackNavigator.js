// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import ImageHeader from '../components/ImageHeader';

import ClientsScreen from './../screens/clientsScreen';
import NewClientScreen from '../screens/newClientScreen';
import ClientInfoScreen from '../screens/clientInfoScreen';

const ClientsStackNavigator = StackNavigator(
  {
    Clients: {
      screen: ClientsScreen,
    },
    NewClient: {
      screen: NewClientScreen,
    },
    ClientInfo: {
      screen: ClientInfoScreen,
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
    },
  },
);

export default ClientsStackNavigator;
