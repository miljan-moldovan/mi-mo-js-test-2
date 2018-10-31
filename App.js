/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import {
  Platform,
  StyleSheet,
  View,
  AsyncStorage,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import OfflineNotice from './components/OfflineNotice';
import RootNavigation from './navigation/RootNavigation';
import store from './store';
import Colors from './constants/Colors';

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
  safeArea: {
    flex: 1,
    backgroundColor: Colors.defaultBlue,
  },
  fixBackground: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 100,
    zIndex: -1000,
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
          'navigationReducer',
          'salonSearchHeaderReducer',
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
      <SafeAreaView style={styles.safeArea} forceInset={{ bottom: 'always' }}>
        <Provider store={store}>
          <View style={styles.container}>
            <OfflineNotice />
            {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
            {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
            <RootNavigation />
          </View>
        </Provider>
      </SafeAreaView>
    );
  }
}
