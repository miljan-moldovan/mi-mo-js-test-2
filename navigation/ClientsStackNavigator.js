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
