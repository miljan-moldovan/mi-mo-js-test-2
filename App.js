/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import {
  Platform,
  StyleSheet,
  View,
  AsyncStorage,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import OfflineNotice from './components/OfflineNotice';
import RootNavigation from './navigation/RootNavigation';
import store from './store';

console.disableYellowBox = true;

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


export default class App extends Component {
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
          'serviceReducer',
          'appointmentFormulasReducer', 'appointmentNotesReducer', 'queue',
          'providersReducer',
          'clientsReducer',
          'clientAppointmentsReducer',
          'appointmentBookReducer',
          'newAppointmentReducer',
          'apptBookSetEmployeeOrderReducer',
          'modifyApptReducer',
          'userInfoReducer',
          'productsReducer',
          'queueDetailReducer',
          'salonSearchHeaderReducer',
          'rebookReducer',
        ],
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
          <OfflineNotice />
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
          <RootNavigation />
        </View>
      </Provider>
    );
  }
}
