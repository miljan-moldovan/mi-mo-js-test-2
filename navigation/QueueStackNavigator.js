// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';
import SalonSearchBar from '../components/SalonSearchBar';

import QueueScreen from './../screens/QueueScreen';
import QueueCombineScreen from './../screens/QueueCombineScreen';
import ClientMergeScreen from './../screens/ClientMergeScreen';
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

// import AppointmentDetailsScreen from '../screens/appointmentDetailsScreen/AppointmentDetailsScreen';
import ModifyServiceScreen from '../screens/modifyServiceScreen';

import AppointmentDetailsScreen from './../screens/appointmentDetailsScreen/AppointmentDetailsScreen';
import AppoinmentNotes from './../screens/appointmentDetailsScreen/components/appointmentNotes';
import AppointmentFormula from './../screens/appointmentDetailsScreen/components/appointmentFormulas/AppointmentFormula';
import NewAppointmentScreen from '../screens/NewAppointmentScreen.js';
import AppointmentNoteScreen from './../screens/appointmentNote';
import AppointmentNoteHeader from '../screens/appointmentNote/components/appointmentNoteHeader';


import ProductsScreen from './../screens/productsScreen';

const QueueStackNavigator = StackNavigator(
  {
    // Products: {
    //   screen: ProductsScreen,
    //   navigationOptions: rootProps => ({
    //     header: props => (<View />),
    //   }),
    // },
    Main: {
      screen: QueueScreen,
      navigationOptions: {
        headerTitle: 'Queue',
      },
    },
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
    },
    Service: {
      screen: ModifyServiceScreen,
    },
    Walkout: {
      screen: WalkOutScreen,
      navigationOptions: {
        headerTitle: 'Walkout',
      },
    },
    AppointmentFormula: {
      screen: AppointmentFormula,
    },
    AppointmentNotes: {
      screen: AppoinmentNotes,
    },
    AppointmentNote: {
      screen: AppointmentNoteScreen,
      navigationOptions: {
        headerMode: 'none',
        gesturesEnabled: false,
        header: props => (<View />),
      },
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
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
    ClientMerge: {
      screen: ClientMergeScreen,
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
        headerLeft: HeaderLateral({
          key: Math.random().toString(),
          navigationParams: rootProps.navigation.state.params,
          handlePress: () => { rootProps.navigation.goBack(); },
          button: (
            <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  }}
            >
              <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Cancel</Text>
            </View>
          ),
        }),
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
      headerTitleStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        color: '#fff',
        fontWeight: '500',
        // backgroundColor: 'red',
        height: '100%',
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
//
//
// const QueueStackNavigator = StackNavigator({
//   Main: { screen: MainStack },
//   AppointmentNote: {
//     screen: AppointmentNoteScreen,
//     navigationOptions: {
//       gesturesEnabled: false,
//       headerStyle: {
//         backgroundColor: 'transparent',
//         borderBottomWidth: 0,
//       },
//     },
//   },
// }, {
//   mode: 'modal',
//   headerMode: 'none',
//
// });
export default QueueStackNavigator;
