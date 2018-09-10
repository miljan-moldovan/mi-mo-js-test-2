// @flow
import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Icon from './../components/UI/Icon';

import { isValidAppointment } from '../redux/selectors/newAppt';
import userActions from '../actions/user';
import walkInActions from '../actions/walkIn';
import clientsActions from '../actions/clients';
import appointmentNoteActions from '../actions/appointmentNotes';
import salonSearchHeaderActions from './../reducers/searchHeader';

import QueueStackNavigator from './QueueStackNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import AppointmentStackNavigator from './AppointmentStackNavigator';
import ClientsStackNavigator from './ClientsStackNavigator';
import SelectStoreStackNavigator from './SelectStoreStackNavigator';
import rootDrawerNavigatorAction from '../actions/rootDrawerNavigator';

const RootDrawerNavigator = TabNavigator(
  {
    Queue: { screen: QueueStackNavigator },
    ApptBook: { screen: AppointmentStackNavigator, navigationOptions: { title: 'Appt. Book' } },
    Clients: { screen: ClientsStackNavigator },
    //  Settings: { screen: SettingsScreen },
  },
  {

    navigationOptions: ({ navigation, screenProps }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let type = 'regularFree';
        const fontWeight = 'normal';

        if (routeName === 'Sales') {
          iconName = 'lineChart';
        } else if (routeName === 'Queue') {
          iconName = 'signIn';
          type = 'regular';
        } else if (routeName === 'Clients') {
          iconName = 'addressCard';
        } else if (routeName === 'ApptBook') {
          iconName = 'calendar';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (<Icon
          name={iconName}
          size={23}
          color={tintColor}
          type={type}
          fontWeight={fontWeight}
        />);
      },
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        if (previousScene.routeName === 'Clients' && previousScene.route !== scene.route) {
          screenProps.clientsActions.setClients([]);
        }
        jumpToIndex(scene.index);
      },
      //tabBarVisible: true//screenProps.drawerOptions.showTabBar,
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
        zIndex: 0,
      },
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
  },
);

class RootNavigator extends React.Component {
  componentDidMount() {
    this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
  }
  render() {
    const { loggedIn, useFingerprintId, fingerprintAuthenticationTime } = this.props.auth;
    const fingerprintTimeout = 60 * 120; // number of minutes before requesting authentication
    const fingerprintExpireTime = fingerprintAuthenticationTime + (fingerprintTimeout * 1000);
    // if user is logged in AND fingerprint identification is NOT enabled
    if (loggedIn && !this.props.store.hasStore) {
      return <SelectStoreStackNavigator />;
    }
    if (loggedIn && (!useFingerprintId || fingerprintExpireTime > Date.now())) {
      if (!this.props.userInfo.currentEmployee) {
        this.props.userActions.getEmployeeData();
      }
      return (
        <RootDrawerNavigator
          screenProps={{
            isNewApptValid: this.props.isNewApptValid,
            clientsActions: this.props.clientsActions,
            drawerOptions: this.props.drawerOptions,
          }}
        />
      );
    }
    // else redirect to login screen so the user can authenticate (user/pass or touchID)
    return <LoginStackNavigator />;
  }
}

RootNavigator.propTypes = {
  isNewApptValid: PropTypes.bool.isRequired,
  clientsActions: PropTypes.shape({
    setClients: PropTypes.func.isRequired,
    setFilteredClients: PropTypes.func.isRequired,
  }).isRequired,
  userActions: PropTypes.shape({
    getEmployeeData: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    useFingerprintId: PropTypes.bool.isRequired,
    fingerprintAuthenticationTime: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  drawerOptions: PropTypes.shape({
    showTabBar: PropTypes.bool.isRequired,
  }).isRequired,
  store: PropTypes.shape({
    hasStore: PropTypes.bool.isRequired,
  }).isRequired,
  userInfo: PropTypes.shape({
    currentEmployee: PropTypes.shape({}),
  }).isRequired,
  rootDrawerNavigatorAction: PropTypes.shape({
    changeShowTabBar: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  userInfo: state.userInfoReducer,
  walkInState: state.walkInReducer,
  clientsState: state.clientsReducer,
  appointmentNoteState: state.appointmentNoteReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  drawerOptions: state.rootDrawerNavigator,
  isNewApptValid: isValidAppointment(state),
  store: state.storeReducer,
});
const mapActionsToProps = dispatch => ({
  userActions: bindActionCreators({ ...userActions }, dispatch),
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
  appointmentNoteActions: bindActionCreators({ ...appointmentNoteActions }, dispatch),
  salonSearchHeaderActions: bindActionCreators({ ...salonSearchHeaderActions }, dispatch),
  rootDrawerNavigatorAction: bindActionCreators({ ...rootDrawerNavigatorAction }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(RootNavigator);
