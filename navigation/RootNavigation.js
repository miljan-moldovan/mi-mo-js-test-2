// @flow
import React from 'react';
import { View, Image, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginScreen from './../screens/LoginScreen';
import ForgotPasswordScreen from './../screens/ForgotPasswordScreen';

import SalesScreen from './../screens/SalesScreen';
import QueueScreen from './../screens/QueueScreen';
import QueueDetailScreen from './../screens/QueueDetailScreen';
import AppointmentsScreen from './../screens/AppointmentsScreen';
import ClientsScreen from './../screens/ClientsScreen';
import ClientsSearchScreen from './../screens/ClientsSearchScreen';
import ScorecardScreen from './../screens/ScorecardScreen';
import WalkInScreen from '../screens/walkinScreen';
import WalkInHeader from '../screens/walkinScreen/components/WalkInHeader';
import WalkInStepHeader from '../screens/walkinScreen/components/WalkInStepHeader';
import HeaderLeftText from '../components/HeaderLeftText';
import ImageHeader from '../components/ImageHeader';
import HeaderMiddle from '../components/HeaderMiddle';
import HeaderLateral from '../components/HeaderLateral';
import SearchBar from '../components/searchBar';
import ProvidersScreen from '../screens/providersScreen';
import ChangeProviderScreen from '../screens/ChangeProviderScreen';
import NewClientScreen from '../screens/NewClientScreen';
import PromotionsScreen from '../screens/promotionsScreen';
import ServicesScreen from '../screens/servicesScreen';
import SideMenu from './../components/SideMenu';
import SideMenuItem from '../components/SideMenuItem';
import ClientDetailsScreen from '../screens/clientDetailsScreen';
import walkInActions from '../actions/walkIn';
import ClientDescriptionScreen from '../screens/clientDetailsScreen/ClientDetailsScreen';

const LoginStackNavigator = StackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  },
);

const QueueStackNavigator = StackNavigator(
  {
    ClientDetails: {
      screen: ClientDetailsScreen,
      navigationOptions: {
        headerTitle: 'Details',
      },
    },
    Main: {
      screen: ClientDetailsScreen,
      navigationOptions: {
        headerTitle: 'Queue',
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
        headerTitle: HeaderMiddle({
          title: (
            <Text
              style={{
                          fontFamily: 'OpenSans-Regular',
                          color: '#fff',
                          fontSize: 20,
                        }}
            >
                        Search Clients
            </Text>),
        }),
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
            {...rootProps}
            searchBar={searchProps => (
              <SearchBar
                {...searchProps}
                placeHolder=""
                showCancel
                searchIconPosition="left"
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
        backgroundColor: 'transparent',
        paddingLeft: 10,
        paddingRight: 10,
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


const ClientsStackNavigator = StackNavigator(
  {
    Clients: {
      screen: ClientsScreen,
      navigationOptions: rootProps => ({
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitle: HeaderMiddle({
          title: (
            <Text
              style={{
                          fontFamily: 'OpenSans-Regular',
                          color: '#fff',
                          fontSize: 20,
                        }}
            >
                        Clients
            </Text>),
        }),
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

const RootDrawerNavigator = DrawerNavigator(
  {
    Queue: { screen: QueueStackNavigator },
    Clients: { screen: ClientsStackNavigator },
    Sales: { screen: SalesScreen },
    Appointments: { screen: AppointmentsScreen },
    Scorecard: { screen: ScorecardScreen },
  },
  {
    contentComponent: SideMenu,
    // contentOptions: {
    //   itemsContainerStyle: {
    //     backgroundColor: 'red',
    //   },
    //   itemStyle: {
    //     backgroundColor: 'yellow'
    //   },
    //   labelStyle: {
    //     backgroundColor: 'blue'
    //   },
    //   iconContainerStyle: {
    //     backgroundColor: 'green'
    //   }
    // }
  },
);

class RootNavigator extends React.Component {
  render() {
    // const { loggedIn, useFingerprintId, fingerprintAuthenticationTime } = this.props.auth;

    // const fingerprintTimeout = 60 * 2;
    // const fingerprintExpireTime = fingerprintAuthenticationTime + fingerprintTimeout * 1000;

    // // if user is logged in AND fingerprint identification is NOT enabled
    // if (loggedIn && (!useFingerprintId || fingerprintExpireTime > Date.now())) { return <RootDrawerNavigator />; }
    // // else redirect to login screen so the user can authenticate (user/pass or touchID)
    // return <LoginStackNavigator />;
    return <RootDrawerNavigator />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  walkInState: state.walkInReducer,
});
const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(RootNavigator);
