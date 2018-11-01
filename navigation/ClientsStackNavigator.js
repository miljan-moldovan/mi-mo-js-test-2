// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import ImageHeader from '../components/ImageHeader';

import ClientsScreen from './../screens/clientsScreen';
import NewClientScreen from '../screens/newClientScreen';

import ClientNotes from './../screens/clientInfoScreen/components/clientNotes';
import ClientFormulas from './../screens/clientInfoScreen/components/clientFormulas';
import ClientNote from './../screens/clientInfoScreen/components/clientNote';
import ClientFormula from './../screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from './../screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '../screens/clientInfoScreen';
import ClientDetailsScreen from '../screens/clientInfoScreen/components/clientDetails';
import ProvidersScreen from '../screens/providersScreen';
import ServicesScreen from '../screens/servicesScreen';

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
    ClientNotes: {
      screen: ClientNotes,
      navigationOptions: { tabBarVisible: false },
    },
    ClientNote: {
      screen: ClientNote,

    },
    ClientFormula: {
      screen: ClientFormula,
    },
    ClientCopyFormula: {
      screen: ClientCopyFormulaScreen,
    },
    ClientFormulas: {
      screen: ClientFormulas,
      navigationOptions: { tabBarVisible: false },
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Services: {
      screen: ServicesScreen,
    },
    Providers: {
      screen: ProvidersScreen,
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
