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
  {},
);

export default ClientsStackNavigator;
