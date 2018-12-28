import * as React from 'react';
import { createStackNavigator } from 'react-navigation';
import { get } from 'lodash';

import QueueScreen from '@/screens/queueScreen';
import QueueCombineScreen from '@/screens/queueCombineScreen';
import ClientMergeScreen from '@/screens/clientMergeScreen';
import QueueDetailScreen from '@/screens/queueDetailScreen';
import WalkInScreen from '@/screens/WalkInScreen';
import ClientsScreen from '@/screens/clientsScreen';
import RemovalReasonTypesScreen from '@/screens/removalReasonTypes';
import ProvidersScreen from '@/screens/providersScreen';
import NewClientScreen from '@/screens/newClientScreen';
import PromotionsScreen from '@/screens/promotionsScreen';
import ServicesScreen from '@/screens/ServicesScreen';
import TurnAwayScreen from '@/screens/turnAwayScreen';
import ModifyServiceScreen from '@/screens/modifyServiceScreen';
import ModifyProductScreen from '@/screens/modifyProductScreen';
import RecommendationsScreen from '@/screens/recommendationsScreen';
import AppointmentDetailsScreen from '@/screens/appointmentDetailsScreen/';
import NewAppointmentScreen from '@/screens/newAppointmentScreen';
import ClientNotes from '@/screens/clientInfoScreen/components/clientNotes';
import ClientFormulas from '@/screens/clientInfoScreen/components/clientFormulas';
import ClientNote from '@/screens/clientInfoScreen/components/clientNote';
import ClientFormula from '@/screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from '@/screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '@/screens/clientInfoScreen';
import ClientDetailsScreen from '@/screens/clientInfoScreen/components/clientDetails';
import ProductsScreen from '@/screens/productsScreen';
import RebookDialogScreen from '@/screens/rebookDialogScreen';
import apptBookSetEmployeeOrder from '@/screens/apptBookSetEmployeeOrder';
import apptBookViewOptions from '@/screens/apptBookViewOptions';
import SettingsScreen from '@/screens/SettingsScreen';

import TransitionConfiguration from './transitionConfiguration';

const QueueStackNavigator = createStackNavigator(
  {
    Main: {
      screen: QueueScreen,
    },
    ApptBookSetEmployeeOrder: {
      screen: apptBookSetEmployeeOrder,
    },
    ApptBookViewOptions: {
      screen: apptBookViewOptions,
    },
    Products: {
      screen: ProductsScreen,
    },
    Services: {
      screen: ServicesScreen,
    },
    NewClient: {
      screen: NewClientScreen,
    },
    ClientNotes: {
      screen: ClientNotes,
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
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
    },
    Service: {
      screen: ModifyServiceScreen,
    },
    Product: {
      screen: ModifyProductScreen,
    },
    Recommendations: {
      screen: RecommendationsScreen,
    },
    RebookDialog: {
      screen: RebookDialogScreen,
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
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
    },
    Providers: {
      screen: ProvidersScreen,
    },
    Promotions: {
      screen: PromotionsScreen,
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    TurnAway: {
      screen: TurnAwayScreen,
    },
    ClientInfo: {
      screen: ClientInfoScreen,
    },
    Settings: { screen: SettingsScreen },
    RemovalReasonTypes: {
      screen: RemovalReasonTypesScreen,
    },
    ModalServices: {
      screen: ServicesScreen,
    },
    ModalProviders: {
      screen: ProvidersScreen,
    },
    ModalClients: {
      screen: ClientsScreen,
    },
    ModalNewClient: {
      screen: NewClientScreen,
    },
    ModalWalkIn: {
      screen: WalkInScreen,
    },
  },
  {
    headerMode: 'float',
    initialRouteName: 'Main',
    transitionConfig: TransitionConfiguration,
  },
);

QueueStackNavigator.navigationOptions = ({ navigation }) => {
  const { state } = navigation;
  let tabBarVisible = true;
  const routes = get(state, 'routes[0].routes', []);
  if (state.index > 0 || routes.length > 1) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export default QueueStackNavigator;
