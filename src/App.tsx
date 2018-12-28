/**
 * @flow
 */
import * as React from 'react';
import { Provider } from 'react-redux';
import { persistStore, PersistorConfig } from 'redux-persist';
import { StyleSheet, AsyncStorage, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import OfflineNotice from './components/OfflineNotice';
import RootNavigation from './navigation/RootNavigation';
import store from './redux/store/index';
import Colors from './constants/Colors';

console.disableYellowBox = true;

const styles = StyleSheet.create({
  rootSafeArea: {
    flex: 1,
    backgroundColor: Colors.defaultBlue,
  },
  withSpinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const persistConf: PersistorConfig = {
  storage: AsyncStorage,
  blacklist: [
    'walkInReducer',
    'queue',
    'serviceReducer',
    'appointmentFormulasReducer',
    'appointmentNotesReducer',
    'queue',
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
    'rebookReducer',
    'settingsReducer',
  ],
};

export default class App extends React.Component {
  state = {
    isLoadingComplete: true,
    storeIsReady: false,
  };

  componentWillMount() {
    persistStore(store, persistConf, () => {
      this.setState({ storeIsReady: true });
    });
  }

  render() {
    if (!this.state.isLoadingComplete || !this.state.storeIsReady) {
      return (
        <SafeAreaView style={[styles.rootSafeArea , styles.withSpinner]}>
          <ActivityIndicator color={Colors.white} />
        </SafeAreaView>
      );
    }
    return (
      <Provider store={store}>
        <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.rootSafeArea}>
          <StatusBar barStyle="light-content" />
          <OfflineNotice />
          <RootNavigation />
        </SafeAreaView>
      </Provider>
    );
  }
}
