// @flow
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  FlatList,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import * as actions from '../actions/queue.js';

import SideMenuItem from '../components/SideMenuItem';
import Queue from '../components/Queue';

import FloatingButton from '../components/FloatingButton';

const WAITING = '0';
const SERVICED = '1';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

class QueueScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Queue"
        icon={require('../assets/images/sidemenu/icon_queue_menu.png')}
      />
    ),
  };
  state = {
    refreshing: false,
    routes: [
      { key: WAITING, title: 'SCHEDULE/WAITING' },
      { key: SERVICED, title: 'BEING SERVICED' },
    ],
    index: 0,
  }
  componentWillMount() {
    this.props.receiveQueue();
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call

    setTimeout(()=>this.setState({refreshing: false}), 1000);
  }

  _renderLabel = ({ position, navigationState }) => ({ route, index }) => {
    // const inputRange = navigationState.routes.map((x, i) => i);
    // const outputRange = inputRange.map(
    //   inputIndex => (inputIndex === index ? '#ffffff' : '#cccccc')
    // );
    // const color = position.interpolate({
    //   inputRange,
    //   outputRange,
    // });
    return (
      <Text style={styles.tabLabel}>
        {route.title}
      </Text>
    );
  };
  _renderBar = props => (
    <TabBar
      {...props}
      tabStyle = {{ backgroundColor : 'transparent', height: 50 }}
      style = {{ backgroundColor: 'transparent', height: 50 }}
      renderLabel={this._renderLabel(props)}
      indicatorStyle = {{ backgroundColor: '#80BBDF', height: 6 }}
    />
  )

  _renderScene = ({ route }) => {
    console.log('_renderScene', route);
    switch (route.key) {
      case WAITING:
        return (
          <Queue data={this.props.waitingQueue} navigation={this.props.navigation} />
        );
      case SERVICED:
        return (
          <Queue data={this.props.serviceQueue} navigation={this.props.navigation} />
        );
    }
  }
  _handleIndexChange = (index) => {
    console.log('_handleIndexChange ', index);
    this.setState({ index });
  };

  _handleWalkInPress = () => {
    const { navigate } = this.props.navigation;
    navigate('WalkIn', { estimatedTime: 12 });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')}
        />

        <TabViewAnimated
          style={{ flex: 1, marginTop: 10 }}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderBar}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
        />
        <FloatingButton handlePress={this._handleWalkInPress}>
          <Text style={styles.textWalkInBtn}>WALK {'\n'} IN</Text>
        </FloatingButton>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  console.log('QueueScreen-map', state);
  return {
    waitingQueue: state.queue.waitingQueue,
    serviceQueue: state.queue.serviceQueue
  }
}
export default connect(mapStateToProps, actions)(QueueScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
  },
  tabLabel: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    paddingBottom: 6,
  },
  textWalkInBtn: {
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 5,
  },
});
