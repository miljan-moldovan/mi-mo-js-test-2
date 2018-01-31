// @flow
import React from 'react';
import { Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import LoginScreen from './../screens/LoginScreen';
import ForgotPasswordScreen from './../screens/ForgotPasswordScreen';

import SalesScreen from './../screens/SalesScreen';
import QueueScreen from './../screens/QueueScreen';
import AppointmentsScreen from './../screens/AppointmentsScreen';
import ClientsScreen from './../screens/ClientsScreen';
import ClientsSearchScreen from './../screens/ClientsSearchScreen';
import ScorecardScreen from './../screens/ScorecardScreen';
import WalkInScreen from '../screens/walkinScreen/WalkInScreen';
import HeaderLeftText from '../components/HeaderLeftText';
import ImageHeader from '../components/ImageHeader';
import HeaderMiddle from '../components/HeaderMiddle';
import SearchBar from '../components/searchBar';

import SideMenu from './../components/SideMenu';
import SideMenuItem from '../components/SideMenuItem';


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
    Main: {
      screen: QueueScreen,
      navigationOptions: {
        headerTitle: 'Queue',
      },
    },
    WalkIn: {
      screen: WalkInScreen,
      navigationOptions: rootProps => ({
        headerTitle: HeaderMiddle({
          title: (
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                color: '#fff',
                fontSize: 20,
              }}
            >
              Walkin
            </Text>),
          subTitle: (
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                color: '#fff',
                fontSize: 12,
              }}
            >
              Est wait time
              <Text style={{
                fontFamily: 'OpenSans-Bold',
              }}
              >
                { ` ${rootProps.navigation.state.params.estimatedTime} min` }
              </Text>
            </Text>
          ),
        }),
        headerLeft: HeaderLeftText({
          handlePress: () => rootProps.navigation.goBack(),
        }),
      }),
    },
    ClientsSearch: {
      screen: ClientsSearchScreen,
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitle: 'Client Search',
        header: props => (
          <ImageHeader
            {...props}
            searchBar={searchProps => (
              <SearchBar
                {...searchProps}
                placeHolder=""
                showCancel
                searchIconPosition="left"
              />)}
          />),
      },
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
    Sales: { screen: SalesScreen },
    Appointments: { screen: AppointmentsScreen },
    Clients: { screen: ClientsScreen },
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
    const { loggedIn, useFingerprintId, fingerprintAuthenticationTime } = this.props.auth;

    const fingerprintTimeout = 60 * 2;
    const fingerprintExpireTime = fingerprintAuthenticationTime + fingerprintTimeout * 1000;
    console.log('RootNavigator.render', loggedIn, useFingerprintId, new Date(fingerprintAuthenticationTime), new Date(fingerprintExpireTime), new Date());

    // if user is logged in AND fingerprint identification is NOT enabled
    if (loggedIn && (!useFingerprintId || fingerprintExpireTime > Date.now())) { return <RootDrawerNavigator />; }
    // else redirect to login screen so the user can authenticate (user/pass or touchID)
    return <LoginStackNavigator />;
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('RootNavigator-map');
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(RootNavigator);
