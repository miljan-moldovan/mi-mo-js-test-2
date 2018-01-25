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
  Dimensions
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import * as actions from '../actions/login.js';

import SideMenuItem from '../components/SideMenuItem';
import Queue from '../components/Queue';

const WAITING = '0';
const SERVICED = '1';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

class QueueScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: (props) => (
      <SideMenuItem
        {...props}
        title="Queue"
        icon={require('../assets/images/sidemenu/icon_queue_menu.png')} />
    ),
  };
  state = {
    refreshing: false,
    routes: [
      { key: WAITING, title: 'Schedule/Waiting' },
      { key: SERVICED, title: 'Being Serviced' },
    ],
    index: 0,
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(()=>this.setState({refreshing: false}), 1000);
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer} key={item.queueId}>
        <View style={styles.itemSummary}>
          <Text style={styles.clientName}>{item.client.name} {item.client.lastName}</Text>
          <Text style={styles.serviceName}>
            {item.services[0].description}
            {item.services.length > 1 ? '(+'+(item.services.length - 1)+')' : null}
            &nbsp;with {item.employees[0].name} {item.employees[0].lastName}
          </Text>
          <Text style={styles.serviceTimeContainer}>at <Text style={styles.serviceTime}>{item.start_time}</Text></Text>
        </View>
        <View style={styles.waitingTime}>
          <Text style={styles.waitingTimeTextTop}>Waiting</Text>
          <Text style={styles.waitingTimeTextMid}>30</Text>
          <Text style={styles.waitingTimeTextBottom}>min</Text>
        </View>
        <View style={styles.waitingTime}>
          <Text style={styles.waitingTimeTextTop}>Est. Wait</Text>
          <Text style={styles.waitingTimeTextMid}>30</Text>
          <Text style={styles.waitingTimeTextBottom}>min</Text>
        </View>
      </View>
    );
  }

  _renderLabel = ({ position, navigationState }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? '#ffffff' : '#cccccc')
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });
    return (
      <Animated.Text>
        {route.title}
      </Animated.Text>
    );
  };
  _renderBar = props => (
    <TabBar
      {...props}
      tabStyle = {{ backgroundColor : 'transparent' }}
      labelStyle = {{ color: 'white' }}
      style = {{ backgroundColor: 'transparent' }}

      renderLabel={this._renderLabel(props)}
    />
  )

  _renderScene = ({ route }) => {
    console.log('_renderScene', route);

    switch (route.key) {
      case WAITING:
        return (
          <Queue />
        );
      case SERVICED:
        return (
          <Queue />
        );
      }
  }
  _handleIndexChange = (index) => {
    console.log('_handleIndexChange ', index);
    this.setState({ index })
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')} />
        <TabViewAnimated
          style={{flex: 1, marginTop: 100}}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderBar}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
        />
      </View>
    );
  }
}
export default connect(null, actions)(QueueScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333'
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  itemContainer: {
    width: '100%',
    height: 104,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29,29,38,1)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  itemSummary: {
    marginLeft: 20,
    marginRight: 'auto',
    paddingRight: 10,
    flex: 1
  },
  clientName: {
    fontSize: 19,
    fontFamily: 'OpenSans-Bold',
    color: 'rgba(17,20,21,1)'
  },
  serviceName: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#999'
  },
  serviceTimeContainer: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(29,29,38,1)'
  },
  serviceTime: {
    fontFamily: 'OpenSans-Bold',
  },
  waitingTime: {
    marginRight: 15,
    alignItems: 'center'
  },
  waitingTimeTextTop: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#999'
  },
  waitingTimeTextMid: {
    fontSize: 24,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(181,60,60,1)'
  },
  waitingTimeTextBottom: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(181,60,60,1)'
  }
});
