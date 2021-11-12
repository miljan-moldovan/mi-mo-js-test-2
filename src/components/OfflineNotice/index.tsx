import * as React from 'react';
import { View, Text, NetInfo } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styles from './style';
import { getSessionInfo } from '../../utilities/apiWrapper/apiServicesResources/session';

const CONNECTION_RETRY_TIMEOUT = 10000;

class OfflineNotice extends React.PureComponent {
  state = {
    isConnected: true,
  };

  timerID = null;

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
    clearTimeout(this.timerID);
  }

  isBackendFetchable = async () =>
    getSessionInfo()
      .then(() => true)
      .catch(() => false);

  handleConnectivityChange = async () => {
    const isConnected = await NetInfo.isConnected.fetch();
    const backendIsFetchable = await this.isBackendFetchable();

    if (!isConnected) {
      if (backendIsFetchable) {
        return this.setState({ isConnected: true });
      }
      this.timerID && clearTimeout(this.timerID);
      this.timerID = setTimeout(
        this.handleConnectivityChange,
        CONNECTION_RETRY_TIMEOUT + (Math.random() * 6 - 3) * 1000,
      );
    }
    return this.setState({ isConnected });
  };

  render() {
    if (!this.state.isConnected) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
          </View>
        </SafeAreaView>
      );
    }
    return null;
  }
}

export default OfflineNotice;
