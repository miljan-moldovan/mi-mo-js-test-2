// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { View } from 'react-native';
import ImageHeader from '../components/ImageHeader';

import ClientsScreen from './../screens/clientsScreen';

const ClientsStackNavigator = StackNavigator(
  {
    Clients: {
      screen: ClientsScreen,
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
