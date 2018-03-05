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
} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import * as actions from '../actions/queue';
import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED, QUEUE_ITEM_INSERVICE, QUEUE_ITEM_CHECKEDIN } from '../constants/QueueStatus.js';

import type { QueueItem } from '../models';

class QueueCombineItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  getLabelForItem = (item: QueueItem) => {
    let label, iconName;
    if (item.status < 6 && item.status !== 4) {
      iconName = Icons.hourglassHalf;
      label = 'Waiting';
    } else {
      iconName = Icons.play;
      label =  'In service';
    }
    return (
      <View style={styles.clientStatusContainer}>
        <FontAwesome style={styles.clientStatusIcon}>{iconName}</FontAwesome>
        <Text style={[styles.clientStatusText]}>{label}</Text>
      </View>
    );
  }
  renderPaymentIcon = () => {
    const { type, item } = this.props;
    if (type === "uncombine")
      return (
        <View style={[styles.dollarSignContainer, item.isGroupLeader ? null : { backgroundColor : 'transparent'}]}>
          <Text style={[styles.dollarSign, item.isGroupLeader ? null : { color : '#00E480' }]}>$</Text>
        </View>
      )
    return null;
  }
  renderCheckContainer = () => {
    const { selected } = this.props;
    if (this.props.type === "combine")
      return (
        <View style={styles.checkContainer}>
          <FontAwesome
            style={[styles.checkIcon, selected? { color: '#2BBA11' } : null]}>
            {selected ? Icons.checkCircle : Icons.circleO}
          </FontAwesome>
        </View>
      )
    return null;
  }

  render() {
    const { selected, index, type } = this.props;
    const item: QueueItem = this.props.item;
    const label = this.getLabelForItem(item);
    let first = null;
    if (type == "uncombine") {
      first = index == 0 ? styles.itemContainerCombinedFirst : styles.itemContainerCombined;
    }
    // const first = index == 0 && type == "uncombine" ? styles.itemContainerCombinedFirst : null;

    return (
      <TouchableOpacity style={[styles.itemContainer, type == "uncombine" ? {'backgroundColor': 'white'} : null, first]} key={item.id} onPress={this._onPress}>
        {this.renderCheckContainer()}
        <View style={[styles.itemSummary, type == "uncombine"? (index == 0 ? styles.itemSummaryCombinedFirst : styles.itemSummaryCombined) : null]}>
          <View>
            <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="tail">{item.client.name} {item.client.lastName} </Text>
            <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
              {item.services[0].serviceName.toUpperCase()}
              {item.services.length > 1 ? (<Text style={{color: '#115ECD', fontFamily: 'Roboto-Medium'}}>+{item.services.length - 1}</Text>) : null}
              &nbsp;<Text style={{color: '#727A8F'}}>with</Text> {(item.services[0].employeeFirstName+' '+item.services[0].employeeLastName).toUpperCase()}
            </Text>
            {label}
          </View>
          {this.renderPaymentIcon()}
        </View>
      </TouchableOpacity>
    );
  }
}


export class QueueCombine extends React.Component {
  state = {
    refreshing: false,
    data: [],
    notificationVisible: false,
    notificationType: '',
    notificationItem: {},
    selected: (new Map(): Map<string, boolean>)
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

    let text = query.toLowerCase();
    // search by the client full name
    let filteredData = data.filter(({ client }) => {
      const fullName = (client.name||'')+' '+(client.middleName||'')+' '+(client.lastName||'');
      return fullName.toLowerCase().match(text);
    });

    // if no match, set empty array
    if (!filteredData || !filteredData.length)
      this.setState({ data: [] });
    // if the matched numbers are equal to the original data, keep it the same
    else if (filteredData.length === data.length)
      this.setState({ data: this.props.data });
    // else, set the filtered data
    else
      this.setState({ data: filteredData });
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

      if (this.props.onChangeCombineClients) {
        const selectedArray = [];
        selected.forEach((value, key)=> {
          if (value)
            selectedArray.push(key);
        });
        this.props.onChangeCombineClients(selectedArray);
      }

      return {selected};
    });
  };

  renderItem = ({ item, index }) => (
    <QueueCombineItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
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
          style={{marginBottom: 28}}
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
    selected: (new Map(): Map<string, boolean>)
  }
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

      if (this.props.onChangeCombineClients) {
        const selectedArray = [];
        selected.forEach((value, key)=> {
          if (value)
            selectedArray.push(key);
        });
        this.props.onChangeCombineClients(selectedArray);
      }

      return {selected};
    });
  };

  renderItem = ({ item, index }) => (
    <QueueCombineItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      item={item.queueItem}
      type="uncombine"
      index={index}
    />
  );
  renderSectionHeader = ({section}) => {
    console.log('renderSectionHeader', section);
    const { loading } = this.props;
    return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <TouchableOpacity onPress={loading? null : ()=>this.props.onUncombineClients(section.groupId)} style={{marginLeft: 'auto'}}>
        {loading? <ActivityIndicator /> : null }
        <Text style={[styles.sectionUncombineText, loading? {color: 'gray'} : null ]}>UNCOMBINE</Text>
      </TouchableOpacity>
    </View>
  )};
  renderSectionFooter = ({section}) => {
    return (
    <View style={styles.sectionFooter} />
  )};

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
    backgroundColor: '#f1f1f1'
  },
  itemContainer: {
    // width: '100%',
    height: 94,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(29,29,38,1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    backgroundColor: 'white',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 4
  },
  itemContainerCombinedFirst: {
    backgroundColor : '#EDFCEF',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    marginBottom: 0,
    height: 99
  },
  itemContainerCombined: {
    backgroundColor : '#EDFCEF',
    borderRadius: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 0,
    height: 99
  },
  sectionFooter: {
    backgroundColor : '#EDFCEF',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopColor: 'transparent',
    paddingTop: 3,
    marginHorizontal: 8,
    marginBottom: 28
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
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    flexDirection: 'row',
    left: 1
  },
  itemSummaryCombined: {
    // borderRadius: 0,
    // borderWidth: 0,
    // borderColor: 'transparent',
    // backgroundColor: 'transparent',
    left: 0,
    marginRight: 4,
    marginLeft: 4,
    marginTop: 4,
    height: 94,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
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
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    color: '#111415',
    marginTop: 12,
    marginBottom: 4
  },
  serviceName: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#4D5067',
    marginBottom: 12
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
    marginBottom: 7
  },
  sectionUncombineText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    color: '#1DBF12',
    marginBottom: 7
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
    alignItems: 'center'
    // width: 'auto'
  },
  clientStatusIcon: {
    fontSize: 10,
    color: 'white',
    paddingRight: 6
  },
  checkContainer: {
    width: 44,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#F8F8F8',
    borderRightColor: '#EFEFEF',
    borderRightWidth: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderLeftColor: 'transparent',
    borderLeftWidth: 1,
  },
  checkIcon: {
    fontSize: 20,
    color: '#727A8F'
  },
  dollarSignContainer: {
    backgroundColor: '#00E480',
    borderColor: '#00E480',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 'auto',
    marginTop: 12,
    marginRight: 12,
    marginBottom: 'auto'
  },
  dollarSign: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },

});
