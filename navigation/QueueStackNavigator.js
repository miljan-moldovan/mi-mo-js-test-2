// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import SideMenuItem from '../components/SideMenuItem';
import ImageHeader from '../components/ImageHeader';
import SearchBar from '../components/searchBar';

import QueueScreen from './../screens/QueueScreen';
import QueueDetailScreen from './../screens/QueueDetailScreen';

import WalkInScreen from '../screens/walkinScreen';
import WalkInHeader from '../screens/walkinScreen/components/WalkInHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';

import ClientsSearchScreen from './../screens/clientsSearchScreen';
import ClientsSearchHeader from '../screens/clientsSearchScreen/components/ClientsSearchHeader';
import ClientDetailsScreen from '../screens/clientDetailsScreen';

import ProvidersScreen from '../screens/providersScreen';
import NewClientScreen from '../screens/NewClientScreen';
import PromotionsScreen from '../screens/promotionsScreen';
import ServicesScreen from '../screens/servicesScreen';
import ChangeServicesScreen from '../screens/servicesScreen';

import HeaderMiddle from '../components/HeaderMiddle';
import HeaderLateral from '../components/HeaderLateral';
import HeaderLeftText from '../components/HeaderLeftText';

const QueueStackNavigator = StackNavigator(
  {
    Main: {
      screen: QueueScreen,
      navigationOptions: {
        headerTitle: 'Queue',
      },
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

    ClientsSearch: {
      screen: ClientsSearchScreen,
      navigationOptions: rootProps => ({
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitle: <ClientsSearchHeader rootProps={rootProps} />,
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
                source={require('../assets/images/clientsSearch/icon_arrow_left_w.png')}
              />
              <Text style={{
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontFamily: 'OpenSans-Bold',
                        backgroundColor: 'transparent',
                        }}
              >Back
              </Text>
            </View>
          ),
        }),
        headerRight: HeaderLateral({
          handlePress: () => console.log('pressed right header button'),
          button: (
            <Text style={{
                      color: '#FFFFFF',
                      fontSize: 16,
                      width: 50,
                      fontFamily: 'OpenSans-Bold',
                      backgroundColor: 'transparent',
                      alignSelf: 'center',
                      alignItems: 'center',
                    }}
            >New Client
            </Text>),
        }),
        header: props => (
          <ImageHeader
            {...props}
            params={rootProps.navigation.state.params}
            searchBar={searchProps => (
              <SearchBar
                {...searchProps}
                placeHolder="Search by name, phone or email"
                searchIconPosition="right"
              />)}
          />),
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
