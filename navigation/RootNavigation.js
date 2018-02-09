// @flow
import React from 'react';
import { Image, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SalesScreen from './../screens/SalesScreen';
import ClientsScreen from './../screens/clientsScreen';
import ClientsHeader from '../screens/clientsScreen/components/ClientsHeader';

import ScorecardScreen from './../screens/ScorecardScreen';

import HeaderMiddle from '../components/HeaderMiddle';
import HeaderLateral from '../components/HeaderLateral';
import ImageHeader from '../components/ImageHeader';
import SearchBar from '../components/searchBar';

import SideMenu from './../components/SideMenu';
import SideMenuItem from '../components/SideMenuItem';

import walkInActions from '../actions/walkIn';
import clientsActions from '../actions/clients';
import clientsSearchActions from '../actions/clientsSearch';

import QueueStackNavigator from './QueueStackNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import AppointmentStackNavigator from './AppointmentStackNavigator';


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
});
const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
  clientsSearchActions: bindActionCreators({ ...clientsSearchActions }, dispatch),

});
export default connect(mapStateToProps, mapActionsToProps)(RootNavigator);
