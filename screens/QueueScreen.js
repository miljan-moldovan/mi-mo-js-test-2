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
  ActionSheetIOS
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import * as actions from '../actions/queue.js';
import walkInActions from '../actions/walkIn';
import SideMenuItem from '../components/SideMenuItem';
import Queue from '../components/Queue';

import FloatingButton from '../components/FloatingButton';
import SalonModal from '../components/SalonModal';
import SalonTextInput from '../components/SalonTextInput';

const WAITING = '0';
const SERVICED = '1';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};


const QueueNavButton = ({ icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesome style={styles.navButton}>{icon}</FontAwesome>
    </TouchableOpacity>
  )
};
class QueueScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const headerLeft =
      <QueueNavButton icon={Icons.bars} />
      ;
    const onActionPress = () => {
      ActionSheetIOS.showActionSheetWithOptions({
        // options: ['Cancel', 'Remove'],
        options: ['Turn Away', 'Combine', 'Cancel'],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            navigation.navigate('TurnAway');
            break;
          case 1:
            navigation.navigate('QueueCombine');
            break;
        }
      });
    };
    const headerRight =
      <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 80}}>
        <QueueNavButton icon={Icons.ellipsisH} onPress={onActionPress}/>
        <QueueNavButton icon={Icons.search} />
      </View>
    ;
    return {
      headerLeft,
      headerRight
    };
  }
  state = {
    refreshing: false,
    routes: [
      { key: WAITING, title: 'Waiting' },
      { key: SERVICED, title: 'In Service' },
    ],
    index: 0,
    isWalkoutVisible: false,
    walkoutText: '',
  }
  componentWillMount() {
    this.props.actions.receiveQueue();
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call

    setTimeout(() => this.setState({ refreshing: false }), 500);
  }

  _renderLabel = ({ position, navigationState }) => ({ route, focused }) =>
      (
        <View style={styles.tabLabelContainer}>
          <View style={[styles.tabQueueCounter, focused? null : { backgroundColor: '#0C4699' }]}>
            <Text style={[styles.tabQueueCounterText, focused? null : { color: '#fff' }]}>
              {route.key === WAITING ? this.props.waitingQueue.length : this.props.serviceQueue.length }
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 12,
            color: focused ? '#115ECD' : 'white'
          }}>
            {route.title}
          </Text>
        </View>
      );
    // }
  _renderBar = props => (
    <TabBar
      {...props}
      tabStyle={styles.tab}
      style={styles.tabContainer}
      renderLabel={this._renderLabel(props)}
      indicatorStyle={styles.indicator}
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
      default:
        return route;
    }
  }

  _handleIndexChange = (index) => {
    console.log('_handleIndexChange ', index);
    this.setState({ index });
  };

  _handleWalkInPress = () => {
    const { navigate } = this.props.navigation;

    this.props.walkInActions.setEstimatedTime(17);
    navigate('WalkIn');
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
        <TabViewAnimated
          style={{
            flex: 1,
            backgroundColor: '#115ECD',
            borderWidth: 0,
          }}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderBar}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
        />
        <TouchableOpacity onPress={this._handleWalkInPress} style={styles.walkinButton}>
          <Text style={styles.walkinButtonText}>Walk-in</Text>
        </TouchableOpacity>
        {/* <FloatingButton handlePress={this._handleWalkInPress}>
          <Text style={styles.textWalkInBtn}>WALK {'\n'} IN</Text>
        </FloatingButton> */}
        {/* <FloatingButton handlePress={this._handleWalkOutPress} rootStyle={styles.walkOutRoot}>
          <Text style={styles.textWalkInBtn}>WALK {'\n'} OUT</Text>
        </FloatingButton> */}
        <SalonModal isVisible={this.state.isWalkoutVisible} closeModal={this._closeWalkOut}>
          {[<View key={Math.random().toString()} style={styles.walkoutContainer}>
            <View style={styles.walkoutImageContainer}>
              <Image style={styles.walkoutImage} source={require('../assets/images/walkoutModal/icon_walkout.png')} />
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
          </View>]}
        </SalonModal>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  waitingQueue: state.queue.waitingQueue,
  serviceQueue: state.queue.serviceQueue,
  walkInState: state.walkInReducer.walkInState,
});

const mapActionsToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch),
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(QueueScreen);


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
  walkinButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    width: 92,
    borderWidth: 1,
    borderColor: '#1DBF12',
    borderRadius: 16,
    backgroundColor: '#1DBF12',
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
  },
  walkinButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: 'white',
  },
  indicator: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 16,
    backgroundColor: 'white',
    height: 33,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
  },
  tab: {
     height: 33,
     width: 120,
     alignItems: 'center',
     justifyContent: 'center'
   },
  tabContainer: {
     height: 34,
     width: 240,
     borderWidth: 1,
     borderColor: 'rgba(8,46,102,0.5)',
     borderRadius: 16,
     backgroundColor: '#115ECD',
     marginLeft: 15,
     marginBottom: 9
  },
  tabQueueCounter: {
    backgroundColor: '#C3D6F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    // paddingHorizontal: 3,
    paddingVertical: 0,
    paddingHorizontal: 5,
    marginRight: 3,
  },
  tabQueueCounterText: {
    color: '#1963CE',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    padding: 0
  },
  tabLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    flexDirection: 'row'
  },
  navButton: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10
  }
});
