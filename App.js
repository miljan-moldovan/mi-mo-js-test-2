/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import RootNavigation from './navigation/RootNavigation';
import store from './store';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
// console.disableYellowBox = true;
export default class App extends Component<{}> {
  state = {
    isLoadingComplete: true,
    storeIsReady: false,
  };

  componentWillMount() {
    persistStore(
      store,
      {
        storage: AsyncStorage,
        blacklist: [
          'walkInReducer',
          'queue',
          'appointmentFormulasReducer', 'appointmentNotesReducer', 'queue',
          'providersReducer',
        ],
        // whitelist: ['auth']
      },
      () => { this.setState({ storeIsReady: true }); },
    ); // .purge(); use to prevent log in
  }
  render() {
    if (!this.state.isLoadingComplete || !this.state.storeIsReady) {
      return (
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
          <RootNavigation />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
