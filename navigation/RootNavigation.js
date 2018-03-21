// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SalesScreen from './../screens/SalesScreen';

import ScorecardScreen from './../screens/ScorecardScreen';
import SettingsScreen from './../screens/SettingsScreen';

import SideMenu from './../components/SideMenu';

import walkInActions from '../actions/walkIn';
import clientsActions from '../actions/clients';
import appointmentNoteActions from '../actions/appointmentNotes';
import salonSearchHeaderActions from './../components/SalonSearchHeader/redux';

import QueueStackNavigator from './QueueStackNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import AppointmentStackNavigator from './AppointmentStackNavigator';
import ClientsStackNavigator from './ClientsStackNavigator';

const RootDrawerNavigator = DrawerNavigator(
  {
    Queue: { screen: QueueStackNavigator },
    Settings: { screen: SettingsScreen },
    Clients: { screen: ClientsStackNavigator },
    Sales: { screen: SalesScreen },
    Appointments: { screen: AppointmentStackNavigator },
    Scorecard: { screen: ScorecardScreen },
  },
  {
    contentComponent: SideMenu,
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
