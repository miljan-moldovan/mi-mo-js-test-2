// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';
import SalonSearchBar from '../components/SalonSearchBar';

import QueueScreen from './../screens/QueueScreen';
import QueueCombineScreen from './../screens/QueueCombineScreen';
import QueueDetailScreen from './../screens/QueueDetailScreen';

import WalkInScreen from '../screens/walkinScreen';
import WalkInHeader from '../screens/walkinScreen/components/WalkInHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';

import ClientsScreen from './../screens/clientsScreen';
import ClientDetailsScreen from '../screens/clientDetailsScreen';

import ProvidersScreen from '../screens/providersScreen';
import NewClientScreen from '../screens/NewClientScreen';
import PromotionsScreen from '../screens/promotionsScreen';
import ServicesScreen from '../screens/servicesScreen';
import TurnAwayScreen from '../screens/turnAwayScreen';
import WalkOutScreen from '../screens/walkOutScreen';

import HeaderLateral from '../components/HeaderLateral';
import HeaderLeftText from '../components/HeaderLeftText';

import ModifyServiceScreen from '../screens/modifyServiceScreen';

const QueueStackNavigator = StackNavigator(
  {
    Main: {
      // screen: QueueScreen,
      screen: ModifyServiceScreen,
      navigationOptions: {
        headerTitle: 'Queue',
      },
    },
    Walkout: {
      screen: WalkOutScreen,
      navigationOptions: rootProps => ({
        headerTitle: 'Walkout',
        headerLeft: HeaderLeftText({ handlePress: () => rootProps.navigation.goBack() }),
      }),
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      navigationOptions: {
        headerTitle: 'Details',
      },
    },
    QueueDetail: {
      screen: QueueDetailScreen,
    },
    QueueCombine: {
      screen: QueueCombineScreen,
    },
    WalkIn: {
      screen: WalkInScreen,
      navigationOptions: rootProps => ({
        headerTitle: <WalkInHeader rootProps={rootProps} />,
        headerLeft: HeaderLeftText({
          ...rootProps,
          handlePress: () => rootProps.navigation.goBack(),
        }),
      }),
    },
    Services: {
      screen: ServicesScreen,
      navigationOptions: rootProps => ({
        headerTitle: <WalkInStepHeader dataName="selectedService" rootProps={rootProps} />,
      }),
    },
    Providers: {
      screen: ProvidersScreen,
      navigationOptions: rootProps => ({
        headerLeft: HeaderLeftText({ handlePress: () => rootProps.navigation.goBack() }),
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitle: <WalkInStepHeader dataName="selectedProvider" rootProps={rootProps} />,
        header: props => (
          <ImageHeader
            {...props}
          />),
      }),
    },
    Promotions: {
      screen: PromotionsScreen,
      navigationOptions: rootProps => ({
        headerTitle: <WalkInStepHeader dataName="selectedPromotion" rootProps={rootProps} />,
        header: props => (
          <ImageHeader
            {...props}
            {...rootProps}
          />),
      }),
    },
    Clients: {
      screen: ClientsScreen,
      navigationOptions: rootProps => ({
        header: props => (<View />),
      }),
    },
    NewClient: {
      screen: NewClientScreen,
      navigationOptions: {
        headerTitle: 'Create New Client',
        headerLeft: <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Cancel</Text>,
        headerRight: <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Save</Text>,
      },
    },
    TurnAway: {
      screen: TurnAwayScreen,
      navigationOptions: rootProps => ({
        headerTitle: 'Turn Away',
        headerLeft: HeaderLeftText({
          ...rootProps,
          handlePress: () => rootProps.navigation.goBack(),
        }),
        headerRight: <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Done</Text>,
      }),
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
export default QueueStackNavigator;
