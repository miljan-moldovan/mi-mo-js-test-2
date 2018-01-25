// @flow
import React from 'react';
import { View, Image } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import LoginScreen from './../screens/LoginScreen';
import ForgotPasswordScreen from './../screens/ForgotPasswordScreen';

import SalesScreen from './../screens/SalesScreen';
import QueueScreen from './../screens/QueueScreen';
import AppointmentsScreen from './../screens/AppointmentsScreen';
import ClientsScreen from './../screens/ClientsScreen';
import ScorecardScreen from './../screens/ScorecardScreen';

import SideMenu from './../components/SideMenu';
import SideMenuItem from '../components/SideMenuItem';


const LoginStackNavigator = StackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen
    }
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);


const QueueStackNavigator = StackNavigator(
  {
    Main: {
      screen: QueueScreen,
    },
  },
  {

    navigationOptions: {
      headerStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
      },
      headerTitle: 'Queue',
      headerTintColor: 'white',
      drawerLabel: (props) => (
        <SideMenuItem
          {...props}
          title="Queue"
          icon={require('../assets/images/sidemenu/icon_queue_menu.png')} />
      ),
    },
  }
);
// const QueueNavigator = (props) => (
//   <View style={{ flex: 1 }}>
//     <Image
//       style={{
//         position: 'absolute',
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover'
//       }}
//       source={require('../assets/images/login/blue.png')} />
//     <QueueStackNavigator />
//   </View>
// );
class QueueNavigator extends React.Component {
  static navigationOptions = {
    drawerLabel: (props) => (
      <SideMenuItem
        {...props}
        title="Queue"
        icon={require('../assets/images/sidemenu/icon_queue_menu.png')} />
    ),
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            resizeMode: 'cover'
          }}
          source={require('../assets/images/login/blue.png')} />
        <QueueStackNavigator />
      </View>
    );
  }
}

const RootDrawerNavigator = DrawerNavigator(
  {
    Sales: { screen: SalesScreen },
    Queue: { screen: QueueNavigator },
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
  }
);

class RootNavigator extends React.Component {
  render() {
    const { loggedIn, useFingerprintId, fingerprintAuthenticationTime} = this.props.auth;

    const fingerprintTimeout = 60 * 2;
    const fingerprintExpireTime = fingerprintAuthenticationTime + fingerprintTimeout * 1000;
    console.log('RootNavigator.render', loggedIn, useFingerprintId, new Date(fingerprintAuthenticationTime), new Date(fingerprintExpireTime), new Date());

    // if user is logged in AND fingerprint identification is NOT enabled
    if (loggedIn && (!useFingerprintId || fingerprintExpireTime > Date.now() ))
      return <RootDrawerNavigator />
    // else redirect to login screen so the user can authenticate (user/pass or touchID)
    else
      return <LoginStackNavigator />
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('RootNavigator-map');
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, null)(RootNavigator);
