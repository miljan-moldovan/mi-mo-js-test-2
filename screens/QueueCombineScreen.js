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
  ActivityIndicator
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as actions from '../actions/queue.js';
import { QueueCombine, QueueUncombine } from '../components/QueueCombine';

class QueueCombineScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { onPressDone } = params;

    return {
      headerTitle: (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Combine</Text>
          <Text style={styles.headerSubtitle}>Select clients to combine</Text>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity style={styles.navButton} onPress={()=>navigation.goBack()}>
          <Text style={styles.navButtonText}>Cancel</Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity style={styles.navButton} onPress={onPressDone}>
          <Text style={[styles.navButtonText, onPressDone ? null : { color: '#0B418F' }]}>Done</Text>
        </TouchableOpacity>
      )
    }
  };

  state = {
    combinedClients: [],
    queueData: [],
    groupData: []
  }
  componentWillMount() {
    this.prepareQueueData();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.waitingQueue || nextProps.serviceQueue || nextProps.group)
      this.prepareQueueData(nextProps);
  }
  prepareQueueData = (nextProps = {}) => {
    const waitingQueue = nextProps.waitingQueue || this.props.waitingQueue;
    const serviceQueue = nextProps.serviceQueue || this.props.serviceQueue;
    const queueData = [...waitingQueue, ...serviceQueue];
    const groups = nextProps.groups || this.props.groups || [];
    console.log('prepareQueueData - groups', groups);
    console.log('prepareQueueData - queueData', queueData);
    const groupData = [];
    for (let groupId in groups) {
      const group = groups[groupId];
      console.log('Search groupLead', groupId, queueData);
      const groupLead = queueData.find((queueItem) => queueItem.groupId == groupId && queueItem.groupLead) || {};
      console.log('groupLead', groupId, groupLead);
      const groupClients = group.map(item=>{
        return {
          ...item,
          queueItem: queueData.find((queueItem) => queueItem.id === item.id)
        }
      });
      // make sure the group leader is the first item
      groupClients.sort((a, b) => a.groupLead ? -1 : 0);
      groupData.push({
        groupId,
        title: groupLead.client ? (groupLead.client.name+' '+groupLead.client.lastName) : 'No leader identified',
        data: groupClients
      })
    }
    this.setState({
      // clients in groups don't show up on the main list, filter them out
      queueData: queueData.filter(({groupId})=>!groupId),
      groupData
    });
  }

  onChangeCombineClients = (combinedClients) => {
    if (combinedClients && combinedClients.length > 1) {
      this.props.navigation.setParams({ onPressDone: this.onFinishCombineClients });
    } else {
      this.props.navigation.setParams({ onPressDone: undefined });
    }
    this.setState({ combinedClients });
  }
  onFinishCombineClients = () => {
    const { combinedClients, queueData } = this.state;

    this.props.startCombine();
    combinedClients.forEach((id)=> {
      const queueItem = queueData.find((item)=> item.id === id)
      const clientName = queueItem.client.name +' '+ queueItem.client.lastName;
      this.props.combineClient({ id, clientName });
    });
    this.props.finishCombine();
    this.props.navigation.goBack();
  }
  onUncombineClients = (groupId) => {
    // Alert.alert('onUncombineClients', groupId);
    this.props.uncombine(groupId);
  }
  toggleSort = () => {
    this.setState({
      uncombinedFirst: !this.state.uncombinedFirst
    })
  }
  render() {
    console.log('groups', this.state.groupData);
    console.log('queueData', this.state.queueData);
    const uncombined = (
      <QueueUncombine
        data={this.state.groupData}
        navigation={this.props.navigation}
        onUncombineClients={this.onUncombineClients}
       />
    )
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.sortButtonContainer} onPress={this.toggleSort}>
          <Text style={styles.sortButtonText}>{this.state.uncombinedFirst ? 'Combined First' : 'Uncombined First'}</Text>
        </TouchableOpacity>
        {this.state.uncombinedFirst ? uncombined : null}
        <QueueCombine
          data={this.state.queueData}
          navigation={this.props.navigation}
          onChangeCombineClients={this.onChangeCombineClients}
         />
        {this.state.uncombinedFirst ? null : uncombined}
      </ScrollView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  waitingQueue: state.queue.waitingQueue,
  serviceQueue: state.queue.serviceQueue,
  groups: state.queue.groups
});
export default connect(mapStateToProps, actions)(QueueCombineScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
  navButton: {

  },
  navButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
  sortButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    width: 'auto',
    marginTop: 12,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  sortButtonText: {
    fontSize: 12,
    color: '#1DBF12'
  }
});
