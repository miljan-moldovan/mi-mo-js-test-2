// @flow

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { connect } from 'react-redux';
// import * as actions from '../actions/provider';
import SideMenuItem from '../../components/SideMenuItem';

import ProviderList from '../../components/providerList';

const mockDataProviders = require('../../mockData/providers.json');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
});

const iconAppointMenu = require('../../assets/images/sidemenu/icon_appoint_menu.png');

class ProviderScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Providers"
        icon={iconAppointMenu}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = { providers: mockDataProviders.data };
  }

  state = {

  }

  render() {
    return (
      <View style={styles.container}>
        <ProviderList {...this.props} selectable providers={this.state.providers} />
      </View>
    );
  }
}
export default ProviderScreen;
