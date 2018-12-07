import * as React from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999999,
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: '100%',
    height: '100%',
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    top: 20,
  },
  offlineText: { color: '#fff' },
});

const CONNECTION_RETRY_TIMEOUT = 10000;

function MiniOfflineSign() {
  return (
    <View style={styles.container}>
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    </View>
  );
}

class OfflineNotice extends React.PureComponent {
  constructor(props) {
    super(props);
    NetInfo.isConnected.fetch().then(this.doCheckFetch);
  }

  state = {
    isConnected: true,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.doCheckFetch);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.doCheckFetch);
    clearTimeout(this.retryInterval);
  }

  doCheckFetch = (isConnected) => {
    if (isConnected) {
      this.handleConnectivityChange(true);
    } else {
      this.handleConnectivityChange(isConnected);
      clearTimeout(this.retryInterval);
      this.retryInterval = setTimeout(
        this.retry,
        CONNECTION_RETRY_TIMEOUT + (Math.random() * 6 - 3) * 1000,
      );
    }
  };

  handleConnectivityChange = (isConnected) => {
    if (isConnected && !this.state.isConnected && this.props.autoRefresh) {
      this.props.autoRefresh();
    }
    this.setState({ isConnected });
  };

  retry = () => {
    NetInfo.isConnected.fetch().then(this.doCheckFetch);
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

export default OfflineNotice;
