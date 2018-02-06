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
import CustomModal from '../components/CustomModal';
import SalonTextInput from '../components/SalonTextInput';

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
    isWalkoutVisible: false,
    walkoutText: ''
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

  _handleWalkOutPress = () => {
    this.setState({ isWalkoutVisible: true });
  }

  _closeWalkOut = () => {
    this.setState({ isWalkoutVisible: false });
  }

  _handleWalkOutTextChange = (ev) => {
    this.setState({ walkoutText: ev.nativeEvent.text });
  };

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
        <FloatingButton handlePress={this._handleWalkOutPress} rootStyle={styles.walkOutRoot}>
          <Text style={styles.textWalkInBtn}>WALK {'\n'} OUT</Text>
        </FloatingButton>
        <CustomModal isVisible={this.state.isWalkoutVisible} closeModal={this._closeWalkOut}>
          <View style={styles.walkoutContainer}>
            <View style={styles.walkoutImageContainer}>
              <Image style={styles.walkoutImage}  source={require('../assets/images/walkoutModal/icon_walkout.png')} />
            </View>
            <Text style={styles.walkoutText}>Walk-out reason:
              <Text style={styles.walkoutTextBold}>Other</Text>
            </Text>
            <View style={styles.walkoutTextContainer}>
              <SalonTextInput
                multiline
                placeholder="Please insert other reasons"
                placeholderColor="#0A274A"
                style={styles.walkoutInput}
                placeholderStyle={styles.walkoutPlaceholder}
                text={this.state.walkoutText}
                onChange={this._handleWalkOutTextChange}
              />
            </View>
            <View style={styles.walkoutButtonContainer}>
              <TouchableOpacity onPress={this._closeWalkOut} style={styles.walkoutButtonCancel}>
                <Text style={styles.walkoutTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._closeWalkOut} style={styles.walkoutButtonOk}>
                <Text style={styles.walkoutTextOk}>Ok</Text>
              </TouchableOpacity>
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
  walkoutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkoutImageContainer: {
    height: 100,
    width: 100,
    backgroundColor: '#67A3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingRight: 8,
    marginBottom: 20,
  },
  walkoutImage: {
    height: 27,
    overflow: 'visible',
  },
  walkoutText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 22,
    color: '#3D3C3B',
  },
  walkoutTextBold: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    color: '#3D3C3B',
  },
  walkoutInput: {
    color: '#3D3C3B',
    height: 120,
    borderColor: 'rgba(10,39,74,0.2)',
    borderWidth: 1,
    marginTop: 20,
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  walkoutPlaceholder: {
    fontStyle: 'italic',
  },
  walkoutTextContainer: {
    flexDirection: 'row',
  },
  walkoutButtonContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  walkoutButtonOk: {
    backgroundColor: '#67A3C7',
    flex: 1,
    height: 60,
    borderRadius: 80,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#67A3C7',
  },
  walkoutButtonCancel: {
    backgroundColor: '#fff',
    flex: 1,
    height: 60,
    borderRadius: 80,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#67A3C7',
  },
  walkoutTextOk: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
  },
  walkoutTextCancel: {
    color: '#67A3C7',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
  },
});
