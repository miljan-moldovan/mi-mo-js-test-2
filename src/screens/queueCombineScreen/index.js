// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  TextInput,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '@/components/common/Icon';
import SalonFlatPicker from '../../components/SalonFlatPicker';
import styles from './styles';
import * as actions from '../../redux/actions/queue';
import {QueueCombine, QueueUncombine} from './queueCombine';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental (true);

const TAB_UNCOMBINED = 0;
const TAB_COMBINED = 1;
const TAB_COMBINE = {
  title: 'Group',
  message: 'Are you sure you want to group this items?',
};
const TAB_CHANGE_LEADER = {
  title: 'Change leader',
  message: 'Are you sure you want to change the leader?',
};

class QueueCombineScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    const {onPressDone, loading} = params;
    const showDone = 'showDone' in params ? params.showDone : true;
    const doneButton = showDone
      ? <SalonTouchableOpacity wait={3000} onPress={onPressDone}>
          <View style={styles.rightButtonContainer}>
            <Text
              style={[
                styles.rightButtonText,
                onPressDone ? null : {color: '#0B418F'},
              ]}
            >
              Done
            </Text>
          </View>
        </SalonTouchableOpacity>
      : null;
    const headerRight = loading && showDone
      ? <View style={styles.navButton}>
          <ActivityIndicator />
        </View>
      : doneButton;
    return {
      header: (
        <SalonHeader
          title="Group"
          headerLeft={
            <SalonTouchableOpacity
              style={styles.leftButton}
              onPress={() => {
                navigation.goBack ();
              }}
            >
              <View style={styles.leftButtonContainer}>
                <Text style={styles.leftButtonText}>
                  Close
                </Text>
              </View>
            </SalonTouchableOpacity>
          }
          headerRight={headerRight}
        />
      ),
    };
  };

  state = {
    combinedClients: [],
    queueData: [],
    groupData: [],
    groupLeadersTmp: {},
    combinedFirst: false,
    searchText: '',
    groupLeader: '',
    activeTab: TAB_UNCOMBINED,
    alertDone: TAB_COMBINE,
  };
  componentWillMount () {
    this.prepareQueueData ();
  }

  componentWillReceiveProps (nextProps) {
    const {waitingQueue, serviceQueue, group, error, loading} = nextProps;
    if (
      waitingQueue !== this.props.waitingQueue ||
      serviceQueue !== this.props.serviceQueue ||
      group !== this.props.group
    ) {
      this.prepareQueueData (nextProps);
    }
    if (error) {
      Alert.alert ('Error', error.toString ());
    }

    if (loading !== undefined && loading !== this.props.loading) {
      this.props.navigation.setParams ({loading});
      // if (!loading) { this.updateNavButtons(); }
    }
  }
  prepareQueueData = (nextProps = {}) => {
    let waitingQueue = nextProps.waitingQueue || this.props.waitingQueue;
    waitingQueue = waitingQueue
      ? waitingQueue.filter (({services}) => services.length > 0)
      : {};
    let serviceQueue = nextProps.serviceQueue || this.props.serviceQueue;
    serviceQueue = serviceQueue
      ? serviceQueue.filter (({services}) => services.length > 0)
      : {};

    const queueData = [...waitingQueue, ...serviceQueue];
    const groups = nextProps.groups || this.props.groups || [];
    const groupData = [];
    for (const groupId in groups) {
      const group = groups[groupId];
      //
      // const groupLead = queueData.find((queueItem) => queueItem.groupId == groupId && queueItem.isGroupLeader) || {};
      const groupClients = group.clients.map (item => ({
        ...item,
        queueItem: queueData.find (queueItem => queueItem.id === item.id),
      }));
      // make sure the group leader is the first item
      groupClients.sort ((a, b) => (a.isGroupLeader ? -1 : 1));
      groupData.push ({
        groupId,
        title: group.groupLeadName,
        data: groupClients,
      });
    }
    this.setState ({
      // clients in groups don't show up on the main list, filter them out
      queueData: queueData.filter (({groupId}) => !groupId),
      groupData,
    });
  };

  onChangeCombineClients = (combinedClients, groupLeader) => {
    if (
      combinedClients === null &&
      groupLeader !== undefined &&
      groupLeader !== null
    ) {
      // update only groupLeader
      this.setState ({groupLeader, alertDone: TAB_COMBINE});
      return;
    }

    this.setState (
      {combinedClients, groupLeader, alertDone: TAB_COMBINE},
      this.updateNavButtons
    );
  };

  updateNavButtons = () => {
    const {combinedClients} = this.state;

    if (
      (combinedClients && combinedClients.length > 1) ||
      this.getUpdatedGroupLeaders ()
    ) {
      this.props.navigation.setParams ({onPressDone: this.confirmation});
    } else {
      this.props.navigation.setParams ({onPressDone: undefined});
    }
  };

  confirmation = () => {
    Alert.alert (
      this.state.alertDone.title,
      this.state.alertDone.message,
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'OK', onPress: () => this.saveData ()},
      ],
      {cancelable: true}
    );
  };

  saveData = () => {
    const {combinedClients, queueData, groupLeader, groupData} = this.state;

    // combine any selected clients and create a new group
    if (combinedClients && combinedClients.length > 1) {
      const combinedData = [];
      this.props.startCombine ();
      combinedClients.forEach ((id, index) => {
        const queueItem = queueData.find (item => item.id === id);
        const clientName = `${queueItem.client.name} ${queueItem.client.lastName}`;
        // for now the first client will always be the group lead
        combinedData.push ({id, groupLead: id == groupLeader});
        this.props.combineClient ({id, clientName});
      });
      // this.props.navigation.setParams({ onPressDone: undefined});
      this.props.finishCombine (combinedData, () => {
        this.props.navigation.setParams ({onPressDone: undefined});
        this.setState ({combinedClients: []});
      });
    }
    const groupLeadersNew = this.getUpdatedGroupLeaders ();
    if (groupLeadersNew) {
      this.props.navigation.setParams ({onPressDone: undefined});
      this.props.updateGroupLeaders (groupLeadersNew);
    }
  };

  getUpdatedGroupLeaders = () => {
    const {groupLeadersTmp, groupData} = this.state;
    // check if any of the groups has changed leaders
    if (groupLeadersTmp) {
      // created map of groupId: groupLeader
      const groupLeadersOld = {};
      groupData.forEach (group => {
        const groupLeader = group.data.find (item => item.isGroupLeader);
        groupLeadersOld[group.groupId] = groupLeader.id;
      });
      const groupLeadersNew = {};
      for (const groupId in groupLeadersTmp) {
        const newGroupLeader = groupLeadersTmp[groupId];
        if (newGroupLeader && newGroupLeader != groupLeadersOld[groupId]) {
          groupLeadersNew[groupId] = newGroupLeader;
        }
      }
      if (Object.keys (groupLeadersNew).length) {
        return groupLeadersNew;
      }
    }
    return false;
  };
  onUncombineClients = groupId => {
    // Alert.alert('onUncombineClients', groupId);

    Alert.alert (
      'Ungroup',
      'Are you sure you want to ungroup this items?',
      [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'OK', onPress: () => this.props.uncombine (groupId)},
      ],
      {cancelable: true}
    );
  };
  // change group leader for existing groups. Will only be applied if user clicks on 'Done'.
  onChangeGroupLeader = (clientId, groupId) => {
    this.setState (
      {
        groupLeadersTmp: {
          ...this.state.groupLeadersTmp,
          [groupId]: clientId,
        },
        alertDone: TAB_CHANGE_LEADER,
      },
      () => {
        this.confirmation ();
        //  this.updateNavButtons
      }
    );
  };
  toggleSort = () => {
    LayoutAnimation.spring ();
    this.setState ({
      combinedFirst: !this.state.combinedFirst,
    });
  };
  changeSearchText = searchText => this.setState ({searchText});

  onPressTab = (ev, index) => {
    this.setState ({activeTab: index});
    this.props.navigation.setParams ({showDone: index === TAB_UNCOMBINED});
  };

  render () {
    const {
      searchText,
      combinedFirst,
      queueData,
      groupData,
      groupLeadersTmp,
    } = this.state;

    const uncombined = (
      <QueueUncombine
        data={groupData}
        filterText={searchText}
        navigation={this.props.navigation}
        onUncombineClients={this.onUncombineClients}
        onChangeLeader={this.onChangeGroupLeader}
        groupLeaders={groupLeadersTmp} // overrides leaders in groupData - used for leader selection
        loading={this.props.loading}
        {...this.props}
      />
    );
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon
            style={{marginLeft: 10}}
            name="search"
            size={14}
            color="rgba(114,122,143,0.7)"
            type="solid"
          />
          <TextInput
            style={styles.search}
            onChangeText={this.changeSearchText}
            value={this.state.searchText}
            placeholder="Search"
            returnKeyType="search"
          />
        </View>
        <View style={{height: 40, alignItems: 'center'}}>
          <SalonFlatPicker
            textFontSize={13}
            selectedIndex={this.state.activeTab}
            onItemPress={this.onPressTab}
            rootStyle={{
              height: 27,
            }}
            containerStyle={{
              height: 27,
              width: 350,
              backgroundColor: 'white',
            }}
            selectedColor="#115ECD"
            unSelectedTextColor="#115ECD"
            dataSource={['Group', 'Ungroup']}
          />
          {/* <SalonTouchableOpacity style={styles.sortButtonContainer} onPress={this.toggleSort}>
            <Icon name={combinedFirst ? 'sortAmountAsc' : 'sortAmountDesc'} size={10} color="rgba(114,122,143,1)" type="solid" />
            <Text style={styles.sortButtonLabel}>Sort</Text>
            <Text style={styles.sortButtonText}>{combinedFirst ? 'Grouped First' : 'Ungrouped First'}</Text>
          </SalonTouchableOpacity> */}
        </View>
        {this.state.activeTab === TAB_UNCOMBINED &&
          <QueueCombine
            data={queueData}
            combinedClients={this.state.combinedClients}
            navigation={this.props.navigation}
            onChangeCombineClients={this.onChangeCombineClients}
            activeTab={this.state.activeTab}
            filterText={searchText}
            {...this.props}
          />}
        {this.state.activeTab === TAB_COMBINED &&
          <View style={{marginTop: 23}}>{uncombined}</View>}

      </KeyboardAwareScrollView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  waitingQueue: state.queue.waitingQueue,
  serviceQueue: state.queue.serviceQueue,
  error: state.queue.error,
  groups: state.queue.groups,
  loading: state.queue.loading,
});
export default connect (mapStateToProps, actions) (QueueCombineScreen);
