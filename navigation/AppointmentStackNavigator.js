// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import AppointmentScreen from '../screens/AppointmentsScreen.js';
import NewAppointmentScreen from '../screens/NewAppointmentScreen.js';
import ProvidersScreen from '../screens/providersScreen';
import NewClientScreen from '../screens/NewClientScreen';
import PromotionsScreen from '../screens/promotionsScreen';
import ServicesScreen from '../screens/servicesScreen';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';
import HeaderLeftText from '../components/HeaderLeftText';

import HeaderLateral from '../components/HeaderLateral';
import SearchBar from '../components/searchBar';
import ClientsScreen from './../screens/clientsScreen';
import ClientsHeader from '../screens/clientsScreen/components/ClientsHeader';

import AppointmentDetailsScreen from './../screens/appointmentDetailsScreen/AppointmentDetailsScreen';
import AppoinmentNotes from './../screens/appointmentDetailsScreen/components/appointmentNotes';

import NewAppointmentNoteScreen from './../screens/newAppointmentNote';
import NewAppointmentNoteHeader from '../screens/newAppointmentNote/components/newAppointmentNoteHeader';

const AppointmentStackNavigator = StackNavigator(
  {
    AppointmentDetails: {
      screen: AppointmentDetailsScreen,
    },
    Appointments: {
      screen: AppoinmentNotes,
    },
    NewAppointmentNote: {
      screen: NewAppointmentNoteScreen,
      navigationOptions: rootProps => ({
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitle: <NewAppointmentNoteHeader rootProps={rootProps} />,
        headerLeft: HeaderLateral({
          key: Math.random().toString(),
          ...rootProps,
          handlePress: () => rootProps.navigation.goBack(),
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
        headerRight: HeaderLateral({
          key: Math.random().toString(),
          params: rootProps.navigation.state.params,
          button: (
            <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  }}
            >
              <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'OpenSans-Regular' }}>Done</Text>
            </View>
          ),
        }),
        header: props => (
          <ImageHeader
            {...props}
            params={rootProps.navigation.state.params}
          />),
      }),
    },
    NewAppointment: {
      screen: NewAppointmentScreen,
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
    ChangeClient: {
      screen: ClientsScreen,
      navigationOptions: rootProps => ({
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitle: <ClientsHeader rootProps={rootProps} />,
        headerLeft: HeaderLateral({
          handlePress: () => rootProps.navigation.goBack(),
          button: (
            <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  }}
            >
              <Image
                style={{
                      width: 15,
                      height: 15,
                    }}
                source={require('../assets/images/icons/icon_menu.png')}
              />
            </View>
          ),
        }),
        headerRight: HeaderLateral({
          handlePress: () => rootProps.params.handlePress(),
          params: rootProps.navigation.state.params,
          button:
  <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            }}
  >
    <Image
      style={{
              width: 24,
              height: 24,
            }}
      source={require('../assets/images/icons/icon_filter.png')}
    />
  </View>,
        }),
        header: props => (
          <ImageHeader
            {...props}
            params={rootProps.navigation.state.params}
            searchBar={searchProps => (
              <SearchBar
                {...searchProps}
                placeholder="Search by name, phone or email"
                searchIconPosition="right"
              />)}
          />),
      }),
    },
  },
  {
    navigationOptions: {
      // headerStyle: {
      //   backgroundColor: 'transparent',
      //   paddingLeft: 10,
      //   paddingRight: 10,
      // },
      // header: props => <ImageHeader {...props} />,
      // headerTitleStyle: {
      //   fontFamily: 'OpenSans-Regular',
      //   fontSize: 20,
      //   color: '#fff',
      // },
      drawerLabel: props => (
        <SideMenuItem
          {...props}
          title="Appointments"
          icon={require('../assets/images/sidemenu/icon_appoint_menu.png')}
        />
      ),
    },
  },
);
export default AppointmentStackNavigator;
