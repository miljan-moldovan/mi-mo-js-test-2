// @flow
import React from 'react';
import { Image, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';
import SalonSearchBar from '../components/SalonSearchBar';

import ClientsScreen from './../screens/clientsScreen';
import ClientsHeader from '../screens/clientsScreen/components/ClientsHeader';
import HeaderLateral from '../components/HeaderLateral';

const ClientsStackNavigator = StackNavigator(
  {
    Clients: {
      screen: ClientsScreen,
      navigationOptions: rootProps => ({
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        header: props => (
          <ImageHeader
            hideHeader
            {...props}
            params={rootProps.navigation.state.params}
            searchBar={searchProps => (
              <SalonSearchBar
                {...searchProps}
                marginTop={30}
                placeHolderText="Search"
                placeholderTextColor="#FFFFFF"
                searchIconPosition="left"
                iconsColor="#FFFFFF"
                fontColor="#FFFFFF"
                borderColor="transparent"
                backgroundColor="#0C4699"
                showCancel
              />

            )}
          />),
      }),
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

export default ClientsStackNavigator;
