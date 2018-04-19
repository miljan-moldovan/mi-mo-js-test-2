// @flow
import React from 'react';
// import { Image, View, Text } from 'react-native';
// import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SalesScreen from './../screens/SalesScreen';

import ScorecardScreen from './../screens/ScorecardScreen';
import SettingsScreen from './../screens/SettingsScreen';
import Icon from './../components/UI/Icon';
// import SideMenu from './../components/SideMenu';

import walkInActions from '../actions/walkIn';
import clientsActions from '../actions/clients';
import appointmentNoteActions from '../actions/appointmentNotes';
import salonSearchHeaderActions from './../components/SalonSearchHeader/redux';

import QueueStackNavigator from './QueueStackNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import AppointmentStackNavigator from './AppointmentStackNavigator';
import ClientsStackNavigator from './ClientsStackNavigator';

const RootDrawerNavigator = TabNavigator(
  {
    Queue: { screen: QueueStackNavigator },
    Sales: { screen: SalesScreen },
    'Appt. Book': { screen: AppointmentStackNavigator },
    Clients: { screen: ClientsStackNavigator },
    Scorecard: { screen: ScorecardScreen },
  //  Settings: { screen: SettingsScreen },
  },
  {

    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;

        if (routeName === 'Sales') {
          iconName = 'lineChart';
        } else if (routeName === 'Queue') {
          iconName = 'signIn';
        } else if (routeName === 'Clients') {
          iconName = 'addressCard';
        } else if (routeName === 'Appt. Book') {
          iconName = 'calendar';
        } else if (routeName === 'Scorecard') {
          iconName = 'clipboard';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={23} color={tintColor} type="solid" />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#2560C6',
      inactiveTintColor: '#737A8D',
      labelStyle: {
        fontFamily: 'Roboto',
        fontWeight: '500',
        textAlign: 'center',
        fontSize: 10,
      },
      style: {
        backgroundColor: '#F2F2F2',
        borderTopColor: '#9D9D9D',
        borderTopWidth: 1,
      },
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
  },
);

class RootNavigator extends React.Component {
  render() {
    const { loggedIn, useFingerprintId, fingerprintAuthenticationTime } = this.props.auth;

    const fingerprintTimeout = 60 * 120; // number of minutes before requesting authentication
    const fingerprintExpireTime = fingerprintAuthenticationTime + fingerprintTimeout * 1000;

    // if user is logged in AND fingerprint identification is NOT enabled
    if (loggedIn && (!useFingerprintId || fingerprintExpireTime > Date.now())) {
      return <RootDrawerNavigator />;
    }
    // else redirect to login screen so the user can authenticate (user/pass or touchID)
    return <LoginStackNavigator />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  walkInState: state.walkInReducer,
  clientsState: state.clientsReducer,
  appointmentNoteState: state.appointmentNoteReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});
const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
  appointmentNoteActions: bindActionCreators({ ...appointmentNoteActions }, dispatch),
  salonSearchHeaderActions: bindActionCreators({ ...salonSearchHeaderActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(RootNavigator);
