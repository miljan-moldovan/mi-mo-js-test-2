// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';

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

export const MainNavigator = StackNavigator(
  {
    Main: {
      screen: QueueScreen,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    ApptBookSetEmployeeOrder: {
      screen: apptBookSetEmployeeOrder,
      navigationOptions: { tabBarVisible: false },
    },
    ApptBookViewOptions: {
      screen: apptBookViewOptions,
      navigationOptions: { tabBarVisible: false },
    },
    Products: {
      screen: ProductsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Services: {
      screen: ServicesScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Appointment: {
      screen: AppointmentScreen,
    },
    NewClient: {
      screen: NewClientScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientNotes: {
      screen: ClientNotes,
      navigationOptions: { tabBarVisible: false },
    },
    ClientFormulas: {
      screen: ClientFormulas,
      navigationOptions: { tabBarVisible: false },
    },
    ClientNote: {
      screen: ClientNote,
      navigationOptions: { tabBarVisible: false },
    },
    ClientFormula: {
      screen: ClientFormula,
      navigationOptions: { tabBarVisible: false },
    },
    ClientCopyFormula: {
      screen: ClientCopyFormulaScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Service: {
      screen: ModifyServiceScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Product: {
      screen: ModifyProductScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Recommendations: {
      screen: RecommendationsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    RebookDialog: {
      screen: RebookDialogScreen,
      navigationOptions: { tabBarVisible: false },
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
    },
    QueueDetail: {
      screen: QueueDetailScreen,
      navigationOptions: { tabBarVisible: false },
    },
    QueueCombine: {
      screen: QueueCombineScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientMerge: {
      screen: ClientMergeScreen,
      navigationOptions: { tabBarVisible: false },
    },
    WalkIn: {
      screen: WalkInScreen,
      navigationOptions: rootProps => ({
        headerTitle: <WalkInHeader rootProps={rootProps} />,
        headerLeft: HeaderLeftText({
          ...rootProps,
          handlePress: () => rootProps.navigation.goBack(),
        }),
        tabBarVisible: false,
      }),
    },
    Providers: {
      screen: ProvidersScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Promotions: {
      screen: PromotionsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    TurnAway: {
      screen: TurnAwayScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientInfo: {
      screen: ClientInfoScreen,
      navigationOptions: {
        tabBarVisible: false,
        headerMode: 'screen',
        gesturesEnabled: false,
      },
    },
    Settings: { screen: SettingsScreen },
    RemovalReasonTypes: {
      screen: RemovalReasonTypesScreen,
      navigationOptions: {
        tabBarVisible: false,
      },
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#115ECD',
        paddingHorizontal: 10,
        paddingVertical: 14,
        paddingTop: 20,
        borderWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        justifyContent: 'center',
      },
      headerTitleStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        color: '#fff',
        fontWeight: '500',
        height: '100%',
      },
    },
  },
);

const SlideFromRight = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 1, 1],
  });

  const slideFromRight = { transform: [{ translateX }] };
  return slideFromRight;
};

const SlideFromBottom = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0],
  });

  const slideFromBottom = { transform: [{ translateY }] };
  return slideFromBottom;
};

const TransitionConfiguration = () => ({
  transitionSpec: {
    duration: 400,
    useNativeDriver: true,
  },
  screenInterpolator: (sceneProps) => {
    const { layout, position, scene } = sceneProps;
    const height = layout.initHeight;
    const width = layout.initWidth;
    const { index, route } = scene;
    const params = route.params || {};
    const transition = params.transition || 'default';
    return {
      SlideFromBottom: SlideFromBottom(index, position, height),
      default: SlideFromBottom(index, position, width),
    }[transition];
  },
});

export default (QueueStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainNavigator,
      navigationOptions: { headerMode: 'none', header: null },
    },
    /** MODAL SCREENS GO HERE * */
    ModalServices: {
      screen: ServicesScreen,
      navigationOptions: {
        tabBarVisible: false,
        headerMode: 'screen',
        gesturesEnabled: false,
      },
    },
    ModalProviders: {
      screen: ProvidersScreen,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#115ECD',
          paddingHorizontal: 10,
          paddingTop: 18,
          borderWidth: 0,
          shadowColor: 'transparent',
          justifyContent: 'center',
        },
        tabBarVisible: false,
        headerMode: 'screen',
        gesturesEnabled: false,
      },
    },
    ModalClients: {
      screen: ClientsScreen,
      navigationOptions: { tabBarVisible: false, headerMode: 'screen', gesturesEnabled: false },
    },
    ModalNewClient: {
      screen: NewClientScreen,
      navigationOptions: { tabBarVisible: false, gesturesEnabled: false },
    },
    ModalWalkIn: {
      screen: WalkInScreen,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#115ECD',
          paddingBottom: 10,
          paddingHorizontal: 10,
        },
        tabBarVisible: false,
        headerMode: 'screen',
        gesturesEnabled: false,
      },
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#115ECD',
        paddingLeft: 10,
        paddingRight: 10,
        height: 44,
        borderWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        color: '#fff',
      },
    },
    transitionConfig: TransitionConfiguration,
    mode: 'modal', // Remember to set the root navigator to display modally.
    //  headerMode: 'none', // This ensures we don't get two top bars.
  },
));
