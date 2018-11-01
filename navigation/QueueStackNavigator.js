// @flow
import React from 'react';
import { Header, StackNavigator, createStackNavigator } from 'react-navigation';
import { get } from 'lodash';

import headerStyles from '../constants/headerStyles';
import QueueScreen from './../screens/queueScreen';
import QueueCombineScreen from './../screens/queueCombineScreen';
import ClientMergeScreen from './../screens/clientMergeScreen';
import QueueDetailScreen from './../screens/queueDetailScreen';

import WalkInScreen from '../screens/walkinScreen';
import WalkInHeader from '../screens/walkinScreen/components/WalkInHeader';

import ClientsScreen from './../screens/clientsScreen';
import RemovalReasonTypesScreen from './../screens/removalReasonTypes';

import ProvidersScreen from '../screens/providersScreen';
import NewClientScreen from '../screens/newClientScreen';
import PromotionsScreen from '../screens/promotionsScreen';
import ServicesScreen from '../screens/servicesScreen';
import TurnAwayScreen from '../screens/turnAwayScreen';

import HeaderLeftText from '../components/HeaderLeftText';

import ModifyServiceScreen from '../screens/modifyServiceScreen';
import ModifyProductScreen from '../screens/modifyProductScreen';
import RecommendationsScreen from '../screens/recommendationsScreen';

import AppointmentDetailsScreen from '../screens/appointmentDetailsScreen/';
import NewAppointmentScreen from '../screens/newAppointmentScreen';

import ClientNotes from './../screens/clientInfoScreen/components/clientNotes';
import ClientFormulas from './../screens/clientInfoScreen/components/clientFormulas';
import ClientNote from './../screens/clientInfoScreen/components/clientNote';
import ClientFormula from './../screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from './../screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '../screens/clientInfoScreen';
import ClientDetailsScreen from '../screens/clientInfoScreen/components/clientDetails';

import ProductsScreen from './../screens/productsScreen';
import RebookDialogScreen from './../screens/rebookDialogScreen';

import AppointmentScreen from '../screens/AppointmentsScreen';
import apptBookSetEmployeeOrder from './../screens/apptBookSetEmployeeOrder';
import apptBookViewOptions from './../screens/apptBookViewOptions';

import SettingsScreen from './../screens/SettingsScreen';


import TransitionConfiguration from './transitionConfiguration';
import QueueHeader from '../screens/queueScreen/queueHeader';

export const MainNavigator = createStackNavigator(
  {
    Main: {
      screen: QueueScreen,
    },
    ApptBookSetEmployeeOrder: {
      screen: apptBookSetEmployeeOrder,
    },
    ApptBookViewOptions: {
      screen: apptBookViewOptions,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Products: {
      screen: ProductsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Services: {
      screen: ServicesScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Appointment: {
      screen: AppointmentScreen,
    },
    NewClient: {
      screen: NewClientScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientNotes: {
      screen: ClientNotes,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
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
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Service: {
      screen: ModifyServiceScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Product: {
      screen: ModifyProductScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Recommendations: {
      screen: RecommendationsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    RebookDialog: {
      screen: RebookDialogScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
    },
    QueueDetail: {
      screen: QueueDetailScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    QueueCombine: {
      screen: QueueCombineScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientMerge: {
      screen: ClientMergeScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    WalkIn: {
      screen: WalkInScreen,
      // navigationOptions: rootProps => ({
      //   ...headerStyles,
      //   headerTitle: <WalkInHeader rootProps={rootProps} />,
      //   headerLeft: HeaderLeftText({
      //     ...rootProps,
      //     handlePress: () => rootProps.navigation.goBack(),
      //   }),
      //   tabBarVisible: false,
      // }),
    },
    Providers: {
      screen: ProvidersScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Promotions: {
      screen: PromotionsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    TurnAway: {
      screen: TurnAwayScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientInfo: {
      screen: ClientInfoScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      //   headerMode: 'screen',
      //   gesturesEnabled: false,
      // },
    },
    Settings: { screen: SettingsScreen },
    RemovalReasonTypes: {
      screen: RemovalReasonTypesScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
  },
  {
    transitionConfig: TransitionConfiguration,
    headerMode: 'screen',
  },
);


const QueueStackNavigator = createStackNavigator(
  {
    // Main: {
    //   screen: MainNavigator,
    //   // headerMode: 'none',
    //   // navigationOptions: {
    //   //   headerMode: 'float',
    //   // },
    // },
    Main: {
      screen: QueueScreen,
    },
    ApptBookSetEmployeeOrder: {
      screen: apptBookSetEmployeeOrder,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ApptBookViewOptions: {
      screen: apptBookViewOptions,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Products: {
      screen: ProductsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Services: {
      screen: ServicesScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Appointment: {
      screen: AppointmentScreen,
    },
    NewClient: {
      screen: NewClientScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientNotes: {
      screen: ClientNotes,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
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
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Service: {
      screen: ModifyServiceScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Product: {
      screen: ModifyProductScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Recommendations: {
      screen: RecommendationsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    RebookDialog: {
      screen: RebookDialogScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
    },
    QueueDetail: {
      screen: QueueDetailScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    QueueCombine: {
      screen: QueueCombineScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientMerge: {
      screen: ClientMergeScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    WalkIn: {
      screen: WalkInScreen,
      // navigationOptions: rootProps => ({
      //   headerTitle: <WalkInHeader rootProps={rootProps} />,
      //   headerLeft: HeaderLeftText({
      //     ...rootProps,
      //     handlePress: () => rootProps.navigation.goBack(),
      //   }),
      //   tabBarVisible: false,
      // }),
    },
    Providers: {
      screen: ProvidersScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    Promotions: {
      screen: PromotionsScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    TurnAway: {
      screen: TurnAwayScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    ClientInfo: {
      screen: ClientInfoScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      //   headerMode: 'screen',
      //   gesturesEnabled: false,
      // },
    },
    Settings: { screen: SettingsScreen },
    RemovalReasonTypes: {
      screen: RemovalReasonTypesScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      // },
    },
    /** MODAL SCREENS GO HERE * */
    ModalServices: {
      screen: ServicesScreen,
      // navigationOptions: {
      //   tabBarVisible: false,
      //   headerMode: 'screen',
      //   gesturesEnabled: false,
      // },
    },
    ModalProviders: {
      screen: ProvidersScreen,
      // navigationOptions: {
      //   headerStyle: {
      //     backgroundColor: '#115ECD',
      //     paddingHorizontal: 10,
      //     paddingTop: 18,
      //     borderWidth: 0,
      //     shadowColor: 'transparent',
      //     justifyContent: 'center',
      //   },
      //   tabBarVisible: false,
      //   headerMode: 'screen',
      //   gesturesEnabled: false,
      // },
    },
    ModalClients: {
      screen: ClientsScreen,
      // navigationOptions: { tabBarVisible: false, headerMode: 'screen', gesturesEnabled: false },
    },
    ModalNewClient: {
      screen: NewClientScreen,
      // navigationOptions: { tabBarVisible: false, gesturesEnabled: false },
    },
    ModalWalkIn: {
      screen: WalkInScreen,
      // navigationOptions: {
      //   headerStyle: {
      //     backgroundColor: '#115ECD',
      //     paddingBottom: 10,
      //     paddingHorizontal: 10,
      //   },
      //   tabBarVisible: false,
      //   headerMode: 'screen',
      //   gesturesEnabled: false,
      // },
    },
  },
  {
    transitionConfig: TransitionConfiguration,
    headerMode: 'float', // This ensures we don't get two top bars.
  },
);

// MainNavigator.navigationOptions = ({ navigation }) => {
//   return {
//     header: null,
//   };
// };
QueueStackNavigator.navigationOptions = ({ navigation }) => {
  const { state } = navigation;
  let tabBarVisible = true;
  const routes = get(state, 'routes[0].routes', []);
  if (state.index > 0 || routes.length > 1) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    ...headerStyles,
  };
};

export default QueueStackNavigator;
