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
  TouchableHighlight,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';

import QueueItemSummary from '../screens/QueueItemSummary';
import * as actions from '../actions/queue';
import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED } from '../constants/QueueStatus.js';


import SideMenuItem from '../components/SideMenuItem';
import CircularCountdown from '../components/CircularCountdown';
import { NotificationBanner, NotificationBannerButton } from '../components/NotificationBanner';
import { QueueButton, QueueButtonTypes } from './QueueButton';
import ServiceIcons from './ServiceIcons';
import Icon from '../components/UI/Icon';

import type { QueueItem } from '../models';

const chevron = require('../assets/images/icons/icon_caret_right.png');

class Queue extends React.Component {
  state = {
    refreshing: false,
    notificationVisible: false,
    notificationType: '',
    notificationItem: {},
    appointment: null,
    isVisible: false,
    client: null,
    services: null,
    data: [],
  }
  componentWillMount() {
    const {
      data, searchClient, searchProvider, filterText,
    } = this.props;
    this.setState({ data });
    if (searchClient || searchProvider) { this.searchText(filterText, searchClient, searchProvider); }
  }
  componentWillReceiveProps({
    data, searchClient, searchProvider, filterText,
  }) {
    if (data !== this.props.data) {
      this.setState({ data });
    }
    // if (nextProps.filterText !== null && nextProps.filterText !== this.props.filterText) {
    if (searchClient != this.props.searchClient ||
        searchProvider != this.props.searchProvider ||
        filterText != this.props.filterText) {
      this.searchText(filterText, searchClient, searchProvider);
    }
  }
  onChangeFilterResultCount = () => {
    console.log('onChangeFilterResultCount', this.state.data.length);
    if (this.props.onChangeFilterResultCount) { this.props.onChangeFilterResultCount(this.state.data.length); }
  }
  searchText = (query: string, searchClient: boolean, searchProvider: boolean) => {
    const { data } = this.props;
    const prevCount = this.state.data.length;
    console.log('searchText prevCount', prevCount);
    if (query === '' || (!searchClient && !searchProvider)) {
      this.setState({ data }, prevCount != data.length ? this.onChangeFilterResultCount : undefined);
    }
    const text = query.toLowerCase();
    // search by the client full name
    const filteredData = data.filter(({ client, services }) => {
      if (searchClient) {
        const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;
        // if this row is a match, we don't need to check providers
        if (fullName.toLowerCase().match(text)) { return true; }
      }
      if (searchProvider) {
        for (let i = 0; i < services.length; i++) {
          const { employeeFirstName, employeeLastName } = services[i];
          const fullName = `${employeeFirstName || ''} ${employeeLastName || ''}`;
          // if this provider is a match, we don't need to check other providers
          if (fullName.toLowerCase().match(text)) { return true; }
        }
      }
      return false;
    });
    // if no match, set empty array
    if (!filteredData || !filteredData.length) { this.setState({ data: [] }, prevCount != 0 ? this.onChangeFilterResultCount : undefined); }
    // if the matched numbers are equal to the original data, keep it the same
    else if (filteredData.length === data.length) { this.setState({ data: this.props.data }, prevCount != this.props.data.length ? this.onChangeFilterResultCount : undefined); }
    // else, set the filtered data
    else { this.setState({ data: filteredData }, prevCount != filteredData.length ? this.onChangeFilterResultCount : undefined); }
  };

  handlePressSummary = {
    checkIn: () => alert('Not Implemented'),
    walkOut: () => alert('Not Implemented'),
    modify: () => this.handlePressModify(),
    returning: () => alert('Not Implemented'),
    toService: () => alert('Not Implemented'),
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(() => this.setState({ refreshing: false }), 500);
  }
  getButtonsForItem = (item) => {
    const {
      noShow, returnLater, clientReturned, service, walkout, checkin,
      uncheckin, undoFinish, rebook, checkout, notesFormulas,
      toWaiting, finishService,
    } = QueueButtonTypes;
    const { id: queueId } = item;
    let left,
      right;
    if (!item.serviced) {
      if (!item.checked_in) {
        left = [
          <QueueButton type={noShow} left />,
        ];
        right = [
          <QueueButton
            type={checkin}
            right
            onPress={() => {
              LayoutAnimation.spring();
              this.props.checkInClient(queueId);
              }}
          />,
          <QueueButton
            type={service}
            right
            onPress={() => {
              LayoutAnimation.spring();
              this.props.startService(queueId);
              this.showNotification(item, 'service');
            }}
          />,
        ];
      } else {
        left = [
          <QueueButton type={returnLater} onPress={() => { LayoutAnimation.spring(); this.props.returnLater(queueId); }} left />,
          <QueueButton type={walkout} onPress={() => { LayoutAnimation.spring(); this.props.walkOut(queueId); }} left />,
        ];
        right = [
          <QueueButton type={uncheckin} right />,
          <QueueButton
            type={service}
            onPress={() => {
            LayoutAnimation.spring();
            this.props.startService(queueId);
            this.showNotification(item, 'service');
          }}
            right
          />,
        ];
      }
    } else if (item.finishService) {
      left = [
        <QueueButton type={undoFinish} left />,
      ];
      right = [
        <QueueButton type={rebook} right />,
        <QueueButton type={checkout} right />,
      ];
    } else {
      left = [
        <QueueButton type={notesFormulas} left />,
        <QueueButton type={toWaiting} onPress={() => { LayoutAnimation.spring(); this.props.toWaiting(queueId); }} left />,
      ];
      right = [
        <QueueButton type={finishService} onPress={() => { LayoutAnimation.spring(); this.props.finishService(queueId); }} right />,
        <QueueButton type={checkout} right />,
      ];
    }
    return { left, right };
  }
  getLabelForItem = (item) => {
    switch (item.status) {
      case QUEUE_ITEM_FINISHED:
        return (
          <View style={styles.finishedContainer}>
            <View style={[styles.waitingTime, { backgroundColor: 'black', marginRight: 0 }]}>
              <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>FINISHED</Text>
            </View>
            <View style={styles.finishedTime}>
              <View style={[styles.finishedTimeFlag, item.processTime > item.estimatedTime ? { backgroundColor: '#D1242A' } : null]} />
              <Text style={styles.finishedTimeText}>{item.processTime}min / <Text style={{ fontFamily: 'Roboto-Regular' }}>{item.estimatedTime}min est.</Text></Text>
            </View>
          </View>
        );
      case QUEUE_ITEM_RETURNING:
        return (
          <View style={[styles.waitingTime, { backgroundColor: 'black' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>RETURNING</Text>
          </View>
        );
      case QUEUE_ITEM_NOT_ARRIVED:
        return (
          <View style={[styles.waitingTime, { backgroundColor: 'rgba(192,193,198,1)' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: '#555' }]}>NOT ARRIVED</Text>
          </View>
        );
      default:
        return (
          <CircularCountdown
            size={46}
            estimatedTime={item.estimatedTime}
            processTime={item.processTime}
            itemStatus={item.status}
            style={styles.circularCountdown}
          />
        );
    }
  }

  handlePress = (item) => {
    if (!this.state.isVisible) {
      this.setState({
        appointment: item,
        client: item.client,
        services: item.services,
        isVisible: true,
      });
    }
  }

  handlePressModify = () => {
    const { appointment } = this.state;
    this.hideDialog();
    if (appointment !== null) {
      this.props.navigation.navigate('AppointmentDetails', { item: { ...appointment } });
    }
  }

  hideDialog = () => {
    this.setState({ isVisible: false });
  }
  getGroupLeaderName = (item: QueueItem) => {
    const { groups } = this.props;
    if (groups && groups[item.groupId]) { return groups[item.groupId].groupLeadName; }
    return null;
  }

  renderItem = (row) => {
    const item: QueueItem = row.item;
    const index = row.index;

    const label = this.getLabelForItem(item);
    const groupLeaderName = this.getGroupLeaderName(item);
    const firstService = item.services[0] || {};
    const serviceName = (firstService.serviceName || '').toUpperCase();
    const employee = ((firstService.employeeFirstName||'')+' '+(firstService.employeeLastName||'')).toUpperCase();
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => this.handlePress(item)}
        key={item.id}
      >
        <View style={styles.itemSummary}>
          <View style={{ flexDirection: 'row', marginTop: 11 }}>
            <Text style={styles.clientName}>{item.client.name} {item.client.lastName} </Text>
            <ServiceIcons item={item} groupLeaderName={groupLeaderName} />
          </View>
          <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
            {serviceName}
            {item.services.length > 1 ? (<Text style={{ color: '#115ECD', fontFamily: 'Roboto-Medium' }}>+{item.services.length - 1}</Text>) : null}
            <Text style={{ color: '#727A8F' }}>with</Text> {employee}
          </Text>
          <Text style={styles.serviceTimeContainer}>
            <Icon name="clockO" style={styles.serviceClockIcon} />
            <Text style={styles.serviceTime}> {item.startTime}</Text> > REM Wait <Text style={styles.serviceRemainingWaitTime}>7m</Text>
          </Text>
        </View>
        {label}
        {/* <Image source={chevron} style={styles.chevron} /> */}
        <Icon name="chevronRight" style={styles.chevron} type="solid" />
      </TouchableOpacity>
    );
  }
  showNotification = (item, type) => {
    console.log('showNotification', type);
    this.setState({
      notificationVisible: true,
      notificationType: type,
      notificationItem: item,
    });
  }
  onDismissNotification = () => {
    this.setState({ notificationVisible: false });
  }
  renderNotification = () => {
    const { notificationType, notificationItem, notificationVisible } = this.state;
    let notificationColor,
      notificationButton,
      notificationText;
    switch (notificationType) {
      case 'service':
        const client = notificationItem.client || {};
        notificationText = (<Text>Started service for <Text style={{ fontFamily: 'OpenSans-Bold' }}>{`${client.name} ${client.lastName}`}</Text></Text>);
        notificationColor = '#ccc';
        notificationButton = <NotificationBannerButton title="UNDO" />;
        break;
      default: '';
    }
    return (
      <NotificationBanner
        backgroundColor={notificationColor}
        visible={notificationVisible}
        button={notificationButton}
        onDismiss={this.onDismissNotification}
      >
        <Text>{notificationText}</Text>
      </NotificationBanner>
    );
  }
  _keyExtractor = (item, index) => item.id;

  render() {
    // console.log('Queue.render', this.props.data);
    const { headerTitle, searchText } = this.props;
    const numResult = this.state.data.length;

    const header = headerTitle ? (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <Text style={styles.headerCount}>{numResult} {numResult === 1 ? 'Result' : 'Results'}</Text>
      </View>
    ) : null;
    return (
      <View style={styles.container}>
        {this.props.loading ? (
          <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : null}
        <FlatList
          style={{ marginTop: 5 }}
          renderItem={this.renderItem}
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          ListHeaderComponent={header}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
        <QueueItemSummary
          isVisible={this.state.isVisible}
          client={this.state.client}
          services={this.state.services}
          onDonePress={this.hideDialog}
          onPressSummary={this.handlePressSummary}
          isWaiting={this.props.isWaiting}
          isCheckedIn={this.state.appointment ? this.state.appointment.checkedIn : false}
          hide={this.hideDialog}
        />
        {this.renderNotification()}
      </View>
    );
  }
}
export default connect(null, actions)(Queue);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  itemContainer: {
    // width: '100%',
    height: 94,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(29,29,38,1)',
    borderRadius: 4,
    // borderWidth: 1,
    // borderColor: '#ccc',
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginTop: 4,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.1,
    // box-shadow: 0 0 2px 0 rgba(0,0,0,0.1);
  },
  itemSummary: {
    marginLeft: 10,
    marginRight: 'auto',
    paddingRight: 10,
    flex: 1,
    height: 90,
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    color: '#111415',
  },
  serviceName: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#4D5067',
    marginTop: 5,
    // marginBottom: 12
  },
  serviceTimeContainer: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#000',
    marginTop: 11,
    marginBottom: 8,
    flexDirection: 'row',
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  serviceTime: {
    // fontFamily: 'OpenSans-Bold',
  },
  waitingTime: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(17,10,36,1)',
    borderRadius: 4,
    borderColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  circularCountdown: {
    marginLeft: 'auto',
    marginBottom: 'auto',
    marginRight: 52,
    marginTop: 16,
    alignItems: 'center',
  },
  waitingTimeTextTop: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceClockIcon: {
    fontSize: 10,
    // padding: 0,
    color: '#7E8D98',
    paddingRight: 7,
  },
  finishedContainer: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 'auto',
    marginBottom: 'auto',
    marginRight: 42,
    marginTop: 16,
  },
  finishedTime: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedTimeText: {
    fontSize: 9,
    fontFamily: 'Roboto-Medium',
    color: '#4D5067',
  },
  finishedTimeFlag: {
    backgroundColor: '#31CF48',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 22,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    color: '#4D5067',
    fontSize: 14,
  },
  headerCount: {
    fontFamily: 'Roboto-Regular',
    color: '#4D5067',
    fontSize: 11,
  },
  chevron: {
    position: 'absolute',
    top: 22,
    right: 10,
    fontSize: 15,
    color: '#115ECD',
  },
});
