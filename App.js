import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import store from './store';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    storeIsReady: false
  };

  componentWillMount() {
    persistStore(
      store,
      {
        storage: AsyncStorage,
        // whitelist: ['auth']
      },
      () => { this.setState({ storeIsReady: true }); console.log('storeIsReady!') }
    ); // .purge(); use to prevent log in
  }

  render() {
    if ((!this.state.isLoadingComplete || !this.state.storeIsReady) && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
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

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/login/url_icon.png'),
        require('./assets/images/login/blue.png'),
        require('./assets/images/login/icon_profile.png'),
        require('./assets/images/login/icon_lock.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
        'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
