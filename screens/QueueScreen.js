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
  TextInput
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import * as actions from '../actions/queue.js';

import SideMenuItem from '../components/SideMenuItem';
import Queue from '../components/Queue';
import FloatingButton from '../components/FloatingButton';
import CustomModal from '../components/CustomModal';

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
    isWalkOutVisible: false
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
      tabStyle = {{ backgroundColor : 'transparent' }}
      style = {{ backgroundColor: 'transparent' }}
      renderLabel={this._renderLabel(props)}
      indicatorStyle = {{ backgroundColor: '#80BBDF', height: 6 }}
    />
  )

  _renderScene = ({ route }) => {
    console.log('_renderScene', route);

    switch (route.key) {
      case WAITING:
        return (
          <Queue data={this.props.waitingQueue} />
        );
      case SERVICED:
        return (
          <Queue data={this.props.serviceQueue} />
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

  _handleWalkOutPress = () => {
    console.log('walk out!');
    this.setState({ isWalkOutVisible: true })
  }

  _closeWalkOut = () => {
    console.log('walk out!');
    this.setState({ isWalkOutVisible: false })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')}
        />
        <TabViewAnimated
          style={{ flex: 1, marginTop: 100 }}
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
        <FloatingButton handlePress={this._handleWalkOutPress} rootStyle={styles.walkOutRoot}>
          <Text style={styles.textWalkInBtn}>WALK {'\n'} OUT</Text>
        </FloatingButton>
        <CustomModal isVisible={this.state.isWalkOutVisible} closeModal={this._closeWalkOut}>
          <View style={styles.modalContainer}>
            <View style={styles.modalImageContainer}>
              <Image style={styles.modalImage}  source={require('../assets/images/walkoutModal/icon_walkout.png')} />
            </View>
            <Text style={styles.modalText}>Walk-out reason:
              <Text style={styles.modalTextBold}>Other</Text>
            </Text>
            <View style={{flexDirection: 'row'}}>
            <TextInput
              multiline
              placeholder="Please insert other reasons"
              placeholderColor="#0A274A"
              style={{height: 120,borderColor: 'rgba(10,39,74,0.2)', borderWidth: 1, marginTop: 20, flex: 1, marginLeft:20,marginRight:20}}
            />
          </View>
          </View>
        </CustomModal>
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
  walkOutRoot: {
    bottom: 138,
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImageContainer: {
    height: 100,
    width: 100,
    backgroundColor: '#67A3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingRight: 8,
    marginBottom: 20,
  },
  modalImage: {
    height: 27,
    overflow: 'visible',
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 22,
    color: '#3D3C3B',
  },
  modalTextBold: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    color: '#3D3C3B',
  },
});
