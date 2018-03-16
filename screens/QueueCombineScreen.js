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
  ActivityIndicator,
  TextInput,
  LayoutAnimation,
  UIManager
} from 'react-native';

import { Button } from 'native-base';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import { connect } from 'react-redux';
import * as actions from '../actions/queue.js';
import { QueueCombine, QueueUncombine } from '../components/QueueCombine';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);


class QueueCombineScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { onPressDone, loading } = params;
    return {
      header: (
          <SafeAreaView style={{justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#115ECD', flexDirection: 'row', paddingHorizontal: 19 }}>
            <TouchableOpacity style={styles.navButton} onPress={()=>navigation.goBack()}>
              <Text style={styles.navButtonText}>Cancel</Text>
            </TouchableOpacity>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.headerTitle}>Combine</Text>
              <Text style={styles.headerSubtitle}>Select clients to combine</Text>
            </View>
            {loading ? (
              <View style={styles.navButton}>
                <ActivityIndicator />
              </View>
            ):(
              <TouchableOpacity style={styles.navButton} onPress={onPressDone}>
                <Text style={[styles.navButtonText, onPressDone ? null : { color: '#0B418F' }]}>Done</Text>
              </TouchableOpacity>
            )}

          </SafeAreaView>
      ),
    }
  };

  state = {
    combinedClients: [],
    queueData: [],
    groupData: [],
    groupLeadersTmp: {},
    combinedFirst: false,
    searchText: '',
    groupLeader: ''
  }
  componentWillMount() {
    this.prepareQueueData();
  }

  componentWillReceiveProps(nextProps) {
    const { waitingQueue, serviceQueue, group, error, loading } = nextProps;
    if (waitingQueue !== this.props.waitingQueue || serviceQueue !== this.props.serviceQueue || group !== this.props.group)
      this.prepareQueueData(nextProps);
    if (error) {
      console.log('QueueCombineScreen.componentWillReceiveProps error', error);
      Alert.alert('Error', error.toString());
    }

    if (loading !== undefined && loading !== this.props.loading) {
      console.log('nextProps.loading', loading);
      this.props.navigation.setParams({ loading });
      if (!loading)
        this.updateNavButtons();
    }
  }
  prepareQueueData = (nextProps = {}) => {
    console.log('prepareQueueData');
    const waitingQueue = nextProps.waitingQueue || this.props.waitingQueue;
    const serviceQueue = nextProps.serviceQueue || this.props.serviceQueue;
    const queueData = [...waitingQueue, ...serviceQueue];
    const groups = nextProps.groups || this.props.groups || [];
    console.log('prepareQueueData - groups', groups);
    console.log('prepareQueueData - queueData', queueData);
    const groupData = [];
    for (let groupId in groups) {
      const group = groups[groupId];
      // console.log('Search groupLead', groupId, queueData);
      // const groupLead = queueData.find((queueItem) => queueItem.groupId == groupId && queueItem.isGroupLeader) || {};
      console.log('groupLead', groupId);
      const groupClients = group.clients.map(item=>{
        return {
          ...item,
          queueItem: queueData.find((queueItem) => queueItem.id === item.id)
        }
      });
      // make sure the group leader is the first item
      groupClients.sort((a, b) => (a.isGroupLeader ? -1 : 1));
      groupData.push({
        groupId,
        title: group.groupLeadName,
        data: groupClients
      })
    }
    console.log('groupData', groupData);
    this.setState({
      // clients in groups don't show up on the main list, filter them out
      queueData: queueData.filter(({groupId})=>!groupId),
      groupData
    });
  }

  onChangeCombineClients = (combinedClients, groupLeader) => {
    if (combinedClients === null && groupLeader !== undefined && groupLeader !== null) {
      // update only groupLeader
      this.setState({ groupLeader });
      return;
    }
    this.setState({ combinedClients, groupLeader }, this.updateNavButtons);
  }
  updateNavButtons = () => {
    const { combinedClients } = this.state;
    if ((combinedClients && combinedClients.length > 1) || this.getUpdatedGroupLeaders()) {
      this.props.navigation.setParams({ onPressDone: this.saveData });
    } else {
      this.props.navigation.setParams({ onPressDone: undefined });
    }
  }
  saveData = () => {
    const { combinedClients, queueData, groupLeader, groupData } = this.state;
    // combine any selected clients and create a new group
    if (combinedClients && combinedClients.length > 1) {
      const combinedData = [];
      this.props.startCombine();
      console.log('saveData');
      combinedClients.forEach((id, index)=> {
        const queueItem = queueData.find((item)=> item.id === id)
        const clientName = queueItem.client.name +' '+ queueItem.client.lastName;
        // for now the first client will always be the group lead
        combinedData.push({ id, groupLead: id == groupLeader });
        this.props.combineClient({ id, clientName });
      });
      console.log('saveData', groupLeader, combinedData);
      this.props.navigation.setParams({ onPressDone: undefined });
      this.props.finishCombine(combinedData);
    }
    const groupLeadersNew = this.getUpdatedGroupLeaders();
    if (groupLeadersNew)
      this.props.updateGroupLeaders(groupLeadersNew);

  }
  getUpdatedGroupLeaders = () => {
    const { groupLeadersTmp, groupData } = this.state;
    // check if any of the groups has changed leaders
    if (groupLeadersTmp) {
      // created map of groupId: groupLeader
      const groupLeadersOld = {};
      groupData.forEach((group) => {
        let groupLeader = group.data.find((item)=> item.isGroupLeader)
        groupLeadersOld[group.groupId] = groupLeader.id;
      })
      const groupLeadersNew = {};
      for (let groupId in groupLeadersTmp) {
        const newGroupLeader = groupLeadersTmp[groupId];
        if (newGroupLeader && newGroupLeader != groupLeadersOld[groupId]) {
          groupLeadersNew[groupId] = newGroupLeader;
        }
      }
      if (Object.keys(groupLeadersNew).length)
        return groupLeadersNew;
    }
    return false;
  }
  onUncombineClients = (groupId) => {
    // Alert.alert('onUncombineClients', groupId);
    this.props.uncombine(groupId);
  }
  // change group leader for existing groups. Will only be applied if user clicks on 'Done'.
  onChangeGroupLeader = (clientId, groupId) => {
    this.setState({ groupLeadersTmp: {
      ...this.state.groupLeadersTmp,
      [groupId]: clientId
    }}, this.updateNavButtons);
  }
  toggleSort = () => {
    LayoutAnimation.spring();
    this.setState({
      combinedFirst: !this.state.combinedFirst
    })
  }
  changeSearchText = searchText => this.setState({ searchText });

  render() {
    const { searchText, combinedFirst, queueData, groupData, groupLeadersTmp } = this.state;
    console.log('groups', groupData);
    console.log('queueData', queueData);

    const uncombined = (
      <QueueUncombine
        data={groupData}
        navigation={this.props.navigation}
        onUncombineClients={this.onUncombineClients}
        onChangeLeader={this.onChangeGroupLeader}
        groupLeaders={groupLeadersTmp} // overrides leaders in groupData - used for leader selection
        loading={this.props.loading}
       />
    )
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <FontAwesome style={styles.searchIcon}>{Icons.search}</FontAwesome>
          <TextInput style={styles.search} onChangeText={this.changeSearchText} value={this.state.searchText} placeholder="Search" returnKeyType="search" />
        </View>
        <View style={{alignItems: 'flex-start'}}>
          <TouchableOpacity style={styles.sortButtonContainer} onPress={this.toggleSort}>
            <FontAwesome style={styles.sortButtonIcon}>{combinedFirst ? Icons.sortAmountAsc : Icons.sortAmountDesc }</FontAwesome>
            <Text style={styles.sortButtonLabel}>Sort</Text>
            <Text style={styles.sortButtonText}>{combinedFirst ? 'Combined First' : 'Uncombined First'}</Text>
          </TouchableOpacity>
        </View>
        {combinedFirst ? uncombined : null}
        <QueueCombine
          data={queueData}
          navigation={this.props.navigation}
          onChangeCombineClients={this.onChangeCombineClients}
          filterText={searchText}
         />
        {combinedFirst ? null : uncombined}
      </KeyboardAwareScrollView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  waitingQueue: state.queue.waitingQueue,
  serviceQueue: state.queue.serviceQueue,
  error: state.queue.error,
  groups: state.queue.groups,
  loading: state.queue.loading
});
export default connect(mapStateToProps, actions)(QueueCombineScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
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
    marginBottom: 6
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
    // width: 'auto',
    marginTop: 7,
    marginBottom: 14,
    marginHorizontal: 10,
    flexDirection: 'row',
    flexShrink: 2,
    alignItems: 'center'
  },
  sortButtonIcon: {
    color: 'rgba(114,122,143,1)',
    fontSize: 10,
  },
  sortButtonLabel: {
    fontSize: 10,
    color: 'rgba(114,122,143,1)',
    marginLeft: 3
  },
  sortButtonText: {
    fontSize: 10,
    color: '#1DBF12',
    marginLeft: 10,
  },
  searchContainer: {
    borderRadius: 10,
    backgroundColor: 'rgba(142,142,147,0.24)',
    height: 36,
    margin: 8,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row'
  },
  searchIcon: {
    // position: 'absolute',
    marginLeft: 7,
    color: 'rgba(114,122,143,0.7)',
    // height: '100%',
    fontSize: 14
  },
  search: {
    margin: 7,
    height: 36,
    borderWidth: 0,
    color: 'rgba(114,122,143,1)',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  }
});
