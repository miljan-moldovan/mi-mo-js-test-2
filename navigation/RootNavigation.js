import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import LoginScreen from './../screens/LoginScreen';
import ForgotPasswordScreen from './../screens/ForgotPasswordScreen';

import SalesScreen from './../screens/SalesScreen';
import QueueScreen from './../screens/QueueScreen';
import AppointmentsScreen from './../screens/AppointmentsScreen';
import ClientsScreen from './../screens/ClientsScreen';
import ScorecardScreen from './../screens/ScorecardScreen';

import SideMenu from './../components/SideMenu';


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

const RootDrawerNavigator = DrawerNavigator(
  {
    Sales: { screen: SalesScreen },
    Queue: { screen: QueueScreen },
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
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

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

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };
}

const mapStateToProps = (state, ownProps) => {
  console.log('RootNavigator-map');
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, null)(RootNavigator);
