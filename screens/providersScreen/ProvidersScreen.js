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
  _handleOnChangeProvider = (provider) => {
    console.log('provider', provider);
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeProvider, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeProvider) { onChangeProvider(provider); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }

  render() {
    const { state } = this.props.navigation;
    let onChangeProvider = null;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeProvider) { onChangeProvider = this._handleOnChangeProvider; }
    return (
      <View style={styles.container}>
        <ProviderList {...this.props} selectable providers={this.state.providers} onChangeProvider={onChangeProvider} />
      </View>
    );
  }
}
export default ProviderScreen;
