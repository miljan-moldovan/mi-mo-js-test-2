// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SalesScreen from './../screens/SalesScreen';

import ScorecardScreen from './../screens/ScorecardScreen';

import SideMenu from './../components/SideMenu';

import walkInActions from '../actions/walkIn';
import clientsActions from '../actions/clients';
import clientsSearchActions from '../actions/clientsSearch';
import appointmentNoteActions from '../actions/appointmentNotes';

import QueueStackNavigator from './QueueStackNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import AppointmentStackNavigator from './AppointmentStackNavigator';
import ClientsStackNavigator from './ClientsStackNavigator';

const RootDrawerNavigator = DrawerNavigator(
  {
    Queue: { screen: QueueStackNavigator },
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
  clientsSearchState: state.clientsSearchReducer,
  appointmentNoteState: state.appointmentNoteReducer,
});
const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
  clientsSearchActions: bindActionCreators({ ...clientsSearchActions }, dispatch),
  appointmentNoteActions: bindActionCreators({ ...appointmentNoteActions }, dispatch),

});
export default connect(mapStateToProps, mapActionsToProps)(RootNavigator);
