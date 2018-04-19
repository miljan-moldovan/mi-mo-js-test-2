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
  SectionList,
  RefreshControl,
  TouchableHighlight,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
// import FontAwesome, { Icons } from 'react-native-fontawesome';
import Icon from '../components/UI/Icon';

import * as actions from '../actions/queue';
import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED, QUEUE_ITEM_INSERVICE, QUEUE_ITEM_CHECKEDIN } from '../constants/QueueStatus.js';

import type { QueueItem } from '../models';

const groupColors = [
  { font: '#00E480', background: '#F1FFF2' },
  { font: '#A07FCC', background: '#F6F5FF' },
  { font: '#F6A623', background: '#FDF7EC' },
  { font: '#F5E000', background: '#FFFEEF' },
  { font: '#0095F5', background: '#F5FFFE' },
  { font: '#EB1D1D', background: '#FEF2F2' },
  { font: '#E007D9', background: '#FDF0FD' },
  { font: '#B07513', background: '#F2EFE7' },
  { font: '#00FBFF', background: '#EDFFFD' },
  { font: '#ACEA56', background: '#F5FFE7' },
  { font: '#3C58D2', background: '#F1F6FC' },
  { font: '#3A5674', background: '#F0F4F8' },
];

const groups = {};
const assignedColors = [];

class QueueCombineItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id, this.props.groupId);
  };


  _onPressSelectLeader = () => {
    // console.log('_onPressSelectLeader', this.props.id);
    this.props.onPressSelectLeader(this.props.id, this.props.groupId);
  }
  getLabelForItem = (item: QueueItem) => {
    let label,
      iconName;
    if (item.status < 6 && item.status !== 4) {
      // iconName = Icons.hourglassHalf;
      iconName = 'hourglassHalf';
      label = 'Waiting';
    } else {
      // iconName = Icons.play;
      iconName = 'play';
      label = 'In service';
    }
    return (
      <View style={styles.clientStatusContainer}>
        <Icon name={iconName} type="solid" style={styles.clientStatusIcon} />
        <Text style={[styles.clientStatusText]}>{label}</Text>
      </View>
    );
  }
  renderPaymentIcon = (color) => {
    const {
      selected, item, type, groupLeader,
    } = this.props;


    console.log(JSON.stringify(item));
    if (type === 'uncombine' || selected) {
      return (
        <TouchableOpacity onPress={this._onPressSelectLeader} style={styles.dollarSignContainerTouchable}>
          <View style={[styles.dollarSignContainer, groupLeader ? { backgroundColor: color.font, borderColor: color.font } : { backgroundColor: 'transparent', borderColor: color.font }]}>
            <Icon
              name="dollar"
              type="solid"
              size={10}
              color={groupLeader ? '#FFFFFF' : color.font}
              style={styles.dollarSign}
            />
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  }
  renderCheckContainer = () => {
    const { selected, type } = this.props;
    if (type === 'combine') {
      return (
        <View style={styles.checkContainer}>
          <Icon
            name={selected ? 'checkCircle' : 'circle'}
            type={selected ? 'regular' : 'solid'}
            size={selected ? 23 : 20}
            color={selected ? '#2BBA11' : '#727A8F'}
            style={styles.checkIcon}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      selected, index, type, groupLeader,
    } = this.props;
    const item: QueueItem = this.props.item;
    const label = this.getLabelForItem(item);
    let first = null;
    if (type == 'uncombine') {
      first = index == 0 ? styles.itemContainerCombinedFirst : styles.itemContainerCombined;
    }
    // const first = index == 0 && type == "uncombine" ? styles.itemContainerCombinedFirst : null;
    const firstService = item.services[0] || {};
    const serviceName = (firstService.serviceName || '').toUpperCase();
    const employee = (`${firstService.employeeFirstName || ''} ${firstService.employeeLastName || ''}`).toUpperCase();

    let color = groupColors[Math.floor(Math.random() * groupColors.length)];


    if (item.groupId) {
      
      if (groups[item.groupId]) {
        color = groups[item.groupId];
      } else {
        groups[item.groupId] = color;
      }
    } else {
      color = groupColors[0];
    }

    return (
      <TouchableOpacity style={[styles.itemContainer, type == 'uncombine' ? { backgroundColor: color.background } : null, first]} key={item.id} onPress={this._onPress}>
        {this.renderCheckContainer()}
        <View style={[styles.itemSummary, type == 'uncombine' ? (groupLeader ? styles.itemSummaryCombinedFirst : styles.itemSummaryCombined) : null]}>
          <View>
            <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="tail">{item.client.name} {item.client.lastName} </Text>
            <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
              {serviceName}
              {item.services.length > 1 ? (<Text style={{ color: '#115ECD', fontFamily: 'Roboto-Medium' }}>+{item.services.length - 1}</Text>) : null}
              &nbsp;<Text style={{ color: '#727A8F' }}>with</Text> {employee}
            </Text>
            {label}
          </View>
          {this.renderPaymentIcon(color)}
        </View>
      </TouchableOpacity>
    );
  }
}


export class QueueCombine extends React.Component {
  state = {
    refreshing: false,
    data: [],
    groupLeader: '',
    notificationVisible: false,
    notificationType: '',
    notificationItem: {},
    selected: (new Map(): Map<string, boolean>),
  }
  componentWillMount() {
    this.setState({ data: this.props.data });
  }
  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.data !== this.props.data) {
      this.setState({ data: nextProps.data });
    }
    if (nextProps.filterText !== null && nextProps.filterText !== this.props.filterText) {
      this.searchText(nextProps.filterText);
    }
  }
  searchText = (query: string) => {
    const { data } = this.props;

    if (query === '') {
      this.setState({ data });
    }

    const text = query.toLowerCase();
    // search by the client full name
    const filteredData = data.filter(({ client }) => {
      const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;
      return fullName.toLowerCase().match(text);
    });

    // if no match, set empty array
    if (!filteredData || !filteredData.length) { this.setState({ data: [] }); }
    // if the matched numbers are equal to the original data, keep it the same
    else if (filteredData.length === data.length) { this.setState({ data: this.props.data }); }
    // else, set the filtered data
    else { this.setState({ data: filteredData }); }
  };
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(() => this.setState({ refreshing: false }), 500);
  }
  _onPressItem = (id: string) => {
    console.log('_onPressItem', id);
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      const selectedArray = [];
      selected.forEach((value, key) => {
        if (value) { selectedArray.push(key); }
      });

      let { groupLeader } = this.state;

      if (selectedArray.length == 0) {
        // if no one is selected, clear group leader
        groupLeader = '';
      } else if (groupLeader == '') {
        // if no groupLeader is selected, set current item as the leader (so the first person selected will be the default leader)
        groupLeader = id;
      } else if (!selectedArray.includes(groupLeader)) {
        // if the previous group leader was unselected, the first selected person from the list will be the leader
        groupLeader = selectedArray[0];
      }
      console.log('_onPressItem groupLeader', groupLeader);
      if (this.props.onChangeCombineClients) {
        this.props.onChangeCombineClients(selectedArray, groupLeader);
      }
      return { selected, groupLeader };
    });
  };
  _onPressSelectLeader = (id: string) => {
    console.log('_onPressSelectLeader', id);
    this.setState({ groupLeader: id });
    this.props.onChangeCombineClients(null, id);
  }

  renderItem = ({ item, index }) => (
    <QueueCombineItem
      id={item.id}
      onPressItem={this._onPressItem}
      onPressSelectLeader={this._onPressSelectLeader}
      selected={!!this.state.selected.get(item.id)}
      groupLeader={item.id == this.state.groupLeader}
      item={item}
      type="combine"
    />
  );

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
    // <View style={styles.container}>
      <FlatList
        renderItem={this.renderItem}
        data={this.state.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        style={{ marginBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
          }
      />
    // </View>
    );
  }
}

export class QueueUncombine extends React.Component {
  state = {
    refreshing: false,
    notificationVisible: false,
    notificationType: '',
    notificationItem: {},
    selected: (new Map(): Map<string, boolean>),
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(() => this.setState({ refreshing: false }), 500);
  }
  // _onPressItem = (id: string) => {
  //   console.log('_onPressItem', id);
  //   // updater functions are preferred for transactional updates
  //   this.setState((state) => {
  //     const selected = new Map(state.selected);
  //     selected.set(id, !selected.get(id)); // toggle
  //
  //     if (this.props.onChangeCombineClients) {
  //       const selectedArray = [];
  //       selected.forEach((value, key)=> {
  //         if (value)
  //           selectedArray.push(key);
  //       });
  //       this.props.onChangeCombineClients(selectedArray);
  //     }
  //
  //     return {selected};
  //   });
  // };
  _onPressSelectLeader = (id: string, groupId: string) => {
    console.log('_onPressSelectLeader', id, groupId);
    if (this.props.onChangeLeader) { this.props.onChangeLeader(id, groupId); }
  }
  renderItem = ({ item, index, section }) => {
    const groupLeader = this.props.groupLeaders[section.groupId] ?
      item.id === this.props.groupLeaders[section.groupId] :
      item.isGroupLeader;
    // console.log('*** QueueUncombine renderItem', this.props.groupLeaders[section.groupId], item.isGroupLeader, groupLeader, item);
    return (
      <QueueCombineItem
        id={item.id}
        groupId={section.groupId}
        onPressItem={this._onPressSelectLeader}
        onPressSelectLeader={this._onPressSelectLeader}
        selected={!!this.state.selected.get(item.id)}
        // if a temporary group leader is set, use it. Otherwise, use item status.
        groupLeader={groupLeader}
        item={item.queueItem}
        type="uncombine"
        index={index}
      />
    );
  }
  renderSectionHeader = ({ section }) => {
    console.log('renderSectionHeader', section);
    const { loading } = this.props;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <TouchableOpacity onPress={loading ? null : () => this.props.onUncombineClients(section.groupId)} style={styles.sectionUncombine}>
          {loading ? <ActivityIndicator /> : null }
          <Text style={[styles.sectionUncombineText, loading ? { color: 'gray' } : null]}>UNCOMBINE</Text>
        </TouchableOpacity>
      </View>
    );
  };
  renderSectionFooter = ({ section }) => (
    <View style={styles.sectionFooter} />
  );

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <SectionList
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        renderItem={this.renderItem}
        sections={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
          }
      />
    );
  }
}

// export default connect(null, actions)(QueueCombine);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  itemContainer: {
    height: 94,
    borderRadius: 4,

    // borderWidth: 1,
    // borderColor: '#ccc',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  itemContainerCombinedFirst: {
  //  backgroundColor: '#EDFCEF',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    marginBottom: 0,
    height: 99,
  },
  itemContainerCombined: {
  //  backgroundColor: '#EDFCEF',
    borderRadius: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 0,
    height: 99,
  },
  sectionFooter: {
  //  backgroundColor: '#EDFCEF',
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderTopColor: 'transparent',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    paddingTop: 3,
    marginHorizontal: 8,
    marginBottom: 28,
  },
  itemSummary: {
    paddingLeft: 10,
    marginRight: 'auto',
    paddingRight: 10,
    flex: 1,
    height: 94,
    // borderTopLeftRadius: 5,
    // borderBottomLeftRadius: 5,
    borderRadius: 4,

    // borderWidth: 1,
    // borderColor: '#ccc',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    backgroundColor: 'white',
    flexDirection: 'row',

    left: 1,
  },
  itemSummaryCombined: {
    // borderRadius: 0,
    // borderWidth: 0,
    // borderColor: 'transparent',
    // backgroundColor: 'transparent',
    left: 0,
    marginRight: 4,
    marginLeft: 4,
    marginTop: 6,
    marginBottom: 6,
    height: 94,
    borderRadius: 4,
    // borderWidth: 1,
    // borderColor: '#ccc',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    backgroundColor: 'white',
  },
  itemSummaryCombinedFirst: {
    left: 0,
    marginRight: 4,
    marginLeft: 4,
    marginTop: 4,
    height: 94,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',

    shadowColor: null,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    color: '#111415',
    marginTop: 12,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#4D5067',
    marginBottom: 12,
  },
  sectionHeader: {
    // marginTop: 28,
    flexDirection: 'row',
    marginHorizontal: 8,

  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#4D5067',
    marginLeft: 16,
    marginBottom: 7,
  },
  sectionUncombineText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    color: '#1DBF12',
    marginLeft: 5,
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientStatusText: {
    fontSize: 9,
    color: 'white',
    fontFamily: 'Roboto-Medium',
  },
  clientStatusContainer: {
    backgroundColor: '#727A8F',
    marginRight: 'auto',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 'auto'
  },
  clientStatusIcon: {
    fontSize: 10,
    color: 'white',
    paddingRight: 6,
  },
  checkContainer: {
    width: 44,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#F8F8F8',

    // borderRightColor: '#EFEFEF',
    // borderRightWidth: 1,

    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderLeftColor: 'transparent',
    borderLeftWidth: 1,
  },
  checkIcon: {
    fontSize: 20,
    color: '#727A8F',
  },
  dollarSignContainerTouchable: {
    marginLeft: 'auto',
    height: '100%',
  },
  dollarSignContainer: {
    backgroundColor: '#00E480',
    borderColor: '#00E480',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 20,
    marginRight: 12,
    marginTop: 12,
    marginBottom: 'auto',
    height: 18,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dollarSign: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },
  sectionUncombine: {
    marginLeft: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
});
