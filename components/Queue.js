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
  TouchableHighlight
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import Swipeable from 'react-native-swipeable';

import * as actions from '../actions/login.js';

import SideMenuItem from '../components/SideMenuItem';

const queueData = require('./queue.json');

class Queue extends React.Component {
  state = {
    refreshing: false
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(()=>this.setState({refreshing: false}), 1000);
  }
  leftContent = <Text>Pull to activate</Text>;

  rightButtons = [
    <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
    <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
  ];

  _renderItem = ({ item, index }) => {
    // return (
    //   <Swipeable leftContent={this.leftContent} rightButtons={this.rightButtons}>
    //     <Text>My swipeable content</Text>
    //   </Swipeable>
    // );
    // /*
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
  _keyExtractor = (item, index) => item.queueId;

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          renderItem={this._renderItem}
          data={queueData.data}
          keyExtractor={this._keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
      </View>
    );
  }
}
export default connect(null, actions)(Queue);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333'
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
