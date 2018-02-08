// @flow
import React from 'react';
import { Image, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';
import SearchBar from '../components/searchBar';

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
                source={require('../assets/images/clients/icon_menu.png')}
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
      source={require('../assets/images/clients/filter_icon.png')}
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
