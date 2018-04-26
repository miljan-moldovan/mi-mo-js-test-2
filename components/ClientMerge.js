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
  ActivityIndicator
} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import Icon from '../components/UI/Icon';

import * as actions from '../actions/clients';
import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED, QUEUE_ITEM_INSERVICE, QUEUE_ITEM_CHECKEDIN } from '../constants/QueueStatus.js';

import type { QueueItem } from '../models';

class ClientMergeItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  _onPressSelectMain = () => {
    this.props.onPressSelectMain(this.props.id);
  }
  renderMainIcon = () => {
    const { selected, main } = this.props;
    if (!selected)
      return null;
    return (
      <TouchableOpacity onPress={this._onPressSelectMain} style={styles.checkboxContainerTouchable}>
        <View style={[styles.checkboxContainer, main ? { backgroundColor : '#1DBF12'} : null]}>
          <View style={[styles.checkbox, main ? { borderColor: 'transparent'} : null ]}>
            { main ? (
              <Icon color="#fff" size={9} name="check" type="regular" />
            ) : null }
          </View>
          <Text style={[styles.checkboxLabel, main ? { color: '#fff'} : null ]}>Main</Text>
        </View>
      </TouchableOpacity>
    )
  }
  renderCheckContainer = () => {
    const { selected } = this.props;
    return (
      <View style={styles.checkContainer}>
        <Icon
          name={selected ? "checkCircle" : "circle"}
          type={selected ? "regular" : "solid"}
          size={selected ? 23 : 20 }
          color={selected ? '#2BBA11' : '#727A8F' }
          />
      </View>
    )
  }

  render() {
    const { selected, index, type } = this.props;
    // const { id, fullName, phone, zip, email} = this.props.item;
    const { id, firstName, middleName, lastName, phone, zip, email} = this.props.item;
    const fullName = (firstName||'')+' '+(middleName ? middleName+' ' : '')+(lastName||'');
    return (
      <TouchableOpacity style={styles.itemContainer} key={id} onPress={this._onPress}>
        {this.renderCheckContainer()}
        <View style={styles.itemSummary}>
          <View>
            <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="middle">{fullName}</Text>
            <View style={styles.clientMobileAddress}>
              <Icon name="mobile" type="regular" size={16} color="#4D5067" style={{marginRight: 5}}/>
              <Text style={styles.clientMobileAddressText} numberOfLines={1} ellipsizeMode="tail">
                {phone}
              </Text>
              <Icon name="home" type="light" size={12} color="#4D5067" style={{marginRight: 4, marginLeft: 16 }}/>
              <Text style={styles.clientMobileAddressText} numberOfLines={1} ellipsizeMode="tail">
                {zip}
              </Text>
            </View>
            <Text style={styles.clientEmail} numberOfLines={1} ellipsizeMode="tail">{email}</Text>
          </View>
          {this.renderMainIcon()}
        </View>
      </TouchableOpacity>
    );
  }
}


export class ClientMerge extends React.Component {
  state = {
    refreshing: false,
    data: [],
    mainClient: null,
    selected: (new Map(): Map<string, boolean>)
  }
  componentWillMount() {
    this.setState({ data: this.props.data });
  }
  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.data !== this.props.data) {
      this.setState({ data: nextProps.data });
    }
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(() => this.setState({ refreshing: false }), 500);
  }
  _onPressItem = (id: string) => {
    //
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle

      // if (this.props.onChangeMergeClients) {
      const selectedArray = [];
      selected.forEach((value, key)=> {
        if (value)
          selectedArray.push(key);
      });
      // const mainClient = selectedArray[0];
      let { mainClient } = this.state;

      if (selectedArray.length == 0) {
        // if no one is selected, clear group leader
        mainClient = '';
      } else if (mainClient == '') {
        // if no groupLeader is selected, set current item as the leader (so the first person selected will be the default leader)
        mainClient = id;
      } else if (!selectedArray.includes(mainClient)) {
        // if the previous group leader was unselected, the first selected person from the list will be the leader
        mainClient = selectedArray[0];
      }

      if (this.props.onChangeMergeClients) {
        this.props.onChangeMergeClients(selectedArray, mainClient);
      }
      return {selected, mainClient};
    });
  };
  _onPressSelectMain = (id: string) => {
    //
    this.setState({ mainClient: id });
    this.props.onChangeMergeClients(null, id);
  }
  renderItem = ({ item, index }) => (
    <ClientMergeItem
      id={item.id}
      onPressItem={this._onPressItem}
      onPressSelectMain={this._onPressSelectMain}
      selected={!!this.state.selected.get(item.id)}
      main={this.state.mainClient == item.id}
      item={item}
    />
  );

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
        <FlatList
          renderItem={this.renderItem}
          data={this.state.data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          style={{marginBottom: 28, marginTop: 5}}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  itemContainer: {
    height: 91,
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 4
  },
  itemSummary: {
    paddingLeft: 8,
    marginRight: 'auto',
    // paddingRight: 10,
    flex: 1,
    height: 91,
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    left: 1
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
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
  checkboxContainerTouchable: {
    marginLeft: 'auto',
    height: '100%',
  },
  checkboxContainer: {
    borderRadius: 4,
    height: 24,
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginRight: 16,
    marginLeft: 6,
    marginBottom: 'auto',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#C0C1C6',
    borderRadius: 4,
    width: 15,
    height: 15,
    marginVertical: 4.5,
    marginLeft: 3.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxLabel: {
    fontSize: 10,
    color: '#727A8F',
    margin: 7,
    fontFamily: 'Roboto-Regular',
  },
  clientName: {
    fontWeight: '500',
    color: '#111415',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginTop: 14,
  },
  clientMobileAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7
  },
  clientMobileAddressText: {
    color: '#4D5067',
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
  },
  clientEmail: {
    color: '#4D5067',
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    marginTop: 2
  }
});
