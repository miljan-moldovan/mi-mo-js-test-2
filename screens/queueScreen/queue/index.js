// @flow
import React from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';

import QueueItemSummary from '../queueItemSummary';
import * as actions from '../../../actions/queue';
import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED } from '../../../constants/QueueStatus';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import CircularCountdown from '../../../components/CircularCountdown';
import { NotificationBanner, NotificationBannerButton } from '../../../components/NotificationBanner';
import ServiceIcons from '../../../components/ServiceIcons';
import Icon from '../../../components/UI/Icon';
import QueueTimeNote from '../queueTimeNote';
import styles from './styles';

import type { QueueItem } from '../../../models';

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
  sortItemsBy: { value: 'FIRST_ARRIVED', label: 'First Arrived' },
}
componentWillMount() {
  const {
    data, searchClient, searchProvider, filterText,
  } = this.props;

  const sortedItems = this.sortItems(this.state.sortItemsBy, data);

  this.setState({ data: sortedItems });
  if (searchClient || searchProvider) { this.searchText(filterText, searchClient, searchProvider); }
}
componentWillReceiveProps({
  data, searchClient, searchProvider, filterText,
}) {
  if (data !== this.props.data) {
    const sortedItems = this.sortItems(this.state.sortItemsBy, data);
    this.setState({ data: sortedItems });
  }
  // if (nextProps.filterText !== null && nextProps.filterText !== this.props.filterText) {
  if (searchClient !== this.props.searchClient ||
    searchProvider !== this.props.searchProvider ||
    filterText !== this.props.filterText ||
    (data !== this.props.data && filterText)) {
    this.searchText(filterText, searchClient, searchProvider);
  }
}
onChangeFilterResultCount = () => {
  if (this.props.onChangeFilterResultCount) {
    this.props.onChangeFilterResultCount(this.state.data.length);
  }
}

searchText = (query: string, searchClient: boolean, searchProvider: boolean) => {
  const { data } = this.props;
  const prevCount = this.state.data.length;
  if (query === '' || (!searchClient && !searchProvider)) {
    this.setState({ data }, prevCount != data.length ? this.onChangeFilterResultCount : undefined);
  }
  const text = query.toLowerCase();
  // search by the client full name
  const filteredData = data.filter(({ client, services }) => {
  //  if (searchClient) {
    const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;
    // if this row is a match, we don't need to check providers
    if (fullName.toLowerCase().match(text)) { return true; }
    //  }
    //    if (searchProvider) {
    for (let i = 0; i < services.length; i++) {
      const { employee } = services[i];

      const fullName = `${employee.fullName || ''}`;
      // if this provider is a match, we don't need to check other providers
      if (fullName.toLowerCase().match(text)) { return true; }
    }
    //  }
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
  checkIn: () => this.handlePressCheckIn(),
  rebook: () => this.handlePressRebook(),
  walkOut: isActiveWalkOut => this.handlePressWalkOut(isActiveWalkOut),
  modify: (isWaiting, onPressSummary) => this.handlePressModify(isWaiting, onPressSummary),
  returning: returned => this.handleReturning(returned),
  toService: () => this.checkHasProvider(),
  toWaiting: () => this.handleToWaiting(),
  finish: finish => this.handlePressFinish(finish),
}

_onRefresh = () => {
  this.setState({ refreshing: true });
  // FIXME this._refreshData();
  // emulate refresh call
  setTimeout(() => this.setState({ refreshing: false }), 500);
}

getGroupLeaderName = (item: QueueItem) => {
  const { groups } = this.props;
  if (groups && groups[item.groupId]) { return groups[item.groupId].groupLeadName; }
  return null;
}

getLabelForItem = (item) => {
  switch (item.status) {
    case QUEUE_ITEM_FINISHED:
      return (
        <View style={styles.finishedContainer}>

          <View style={styles.finishedTime}>
            <View style={[styles.finishedTimeFlag, item.processTime > item.estimatedTime ? { backgroundColor: '#D1242A' } : null]} />
            <Text style={styles.finishedTimeText}>{(moment(item.processTime, 'hh:mm:ss').isValid()
              ? moment(item.processTime, 'hh:mm:ss').minutes() + moment(item.processTime, 'hh:mm:ss').hours() * 60
              : 0)}min / <Text style={{ fontFamily: 'Roboto-Regular' }}>{(moment(item.progressMaxTime, 'hh:mm:ss').isValid()
                ? moment(item.progressMaxTime, 'hh:mm:ss').minutes() + moment(item.progressMaxTime, 'hh:mm:ss').hours() * 60
                : 0)}min est.
              </Text>
            </Text>
          </View>

          <View style={[styles.waitingTime, { backgroundColor: 'black', marginRight: 0 }]}>
            <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>FINISHED</Text>
          </View>
        </View>
      );
      break;
    case QUEUE_ITEM_RETURNING:
      return (
        <View style={styles.returningContainer}>
          <View style={[styles.waitingTime, { marginRight: 0, backgroundColor: 'black' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>RETURNING</Text>
          </View>
        </View>
      );
    case QUEUE_ITEM_NOT_ARRIVED:
      return (
        <View style={styles.notArrivedContainer}>
          <View style={[styles.waitingTime, { marginRight: 0, flexDirection: 'row', backgroundColor: 'rgba(192,193,198,1)' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: '#555' }]}>NOT ARRIVED </Text>
            <Icon name="circle" style={{ fontSize: 2, color: '#555' }} type="solid" />
            <Text style={[styles.waitingTimeTextTop, { color: '#D1242A' }]}> LATE</Text>
          </View>
        </View>
      );
    default:

      let processTime = moment(item.processTime, 'hh:mm:ss'),
        progressMaxTime = moment(item.progressMaxTime, 'hh:mm:ss'),
        estimatedTime = moment(item.estimatedTime, 'hh:mm:ss'),
        processMinutes = moment(item.processTime, 'hh:mm:ss').isValid()
          ? processTime.minutes() + processTime.hours() * 60
          : 0,
        progressMaxMinutes = moment(item.progressMaxTime, 'hh:mm:ss').isValid()
          ? progressMaxTime.minutes() + progressMaxTime.hours() * 60
          : 0,
        estimatedTimeMinutes = moment(item.estimatedTime, 'hh:mm:ss').isValid()
          ? estimatedTime.minutes() + estimatedTime.hours() * 60
          : 0;

      return (
        <CircularCountdown
          size={46}
          estimatedTime={progressMaxMinutes}
          processTime={processMinutes}
          itemStatus={item.status}
          style={styles.circularCountdown}
          queueType={item.queueType}
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

handlePressModify = (isWaiting, onPressSummary) => {
  const { appointment } = this.state;
  this.hideDialog();
  if (appointment !== null) {
    setTimeout(() => this.props.navigation.navigate('AppointmentDetails', { item: { ...appointment }, isWaiting, onPressSummary }), 500);
  }
}

handlePressRebook = () => {
  const { appointment } = this.state;
  this.hideDialog();
  if (appointment !== null) {
    this.props.navigation.navigate('RebookDialog', {
      appointment,
      ...this.props,
    });
  }
}

handlePressCheckIn = () => {
  const { appointment } = this.state;
  this.props.checkInClient(appointment.id);
  this.hideDialog();
}

handlePressWalkOut = (isActiveWalkOut) => {
  const { appointment } = this.state;

  if (isActiveWalkOut) {
    // this.props.walkOut(appointment.id);

    if (appointment !== null) {
      this.props.navigation.navigate('Walkout', {
        appointment,
        ...this.props,
      });
    }

    this.hideDialog();
  } else {
    const { client } = appointment;

    const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;

    Alert.alert(
      'No show',
      `Are you sure you want to mark ${fullName} as a no show?`,
      [
        { text: 'No, cancel', onPress: () => { this.hideDialog(); }, style: 'cancel' },
        {
          text: 'Yes, Im sure',
          onPress: () => {
            this.props.noShow(appointment.id);
            this.hideDialog();
          },
        },
      ],
      { cancelable: false },
    );
  }
}

handleReturning = (returned) => {
  const { appointment } = this.state;

  if (returned) {
    this.props.returned(appointment.id);
  } else {
    this.props.returnLater(appointment.id);
  }

  this.hideDialog();
}

cancelButton = () => ({
  leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
  leftButtonOnPress: (navigation) => {
    navigation.goBack();
  },
})

checkHasProvider = () => {
  const { appointment } = this.state;
  const service = appointment.services[0];
  if (service.employee) {
    this.handleStartService();
  } else {
    this.hideDialog();

    this.props.navigation.navigate('Providers', {
      headerProps: { title: 'Providers', ...this.cancelButton() },
      dismissOnSelect: true,
      selectedService: service,
      filterByService: true,
      showFirstAvailable: false,
      onChangeProvider: provider => this.handleProviderSelection(provider),
    });
  }
}


handleProviderSelection = (provider) => {
  const { appointment } = this.state;
  const service = appointment.services[0];
  service.employee = provider;
  this.handleStartService();
}


handleStartService = () => {
  const { appointment } = this.state;
  const service = appointment.services[0];

  const serviceData = {
    serviceEmployees: [
      {
        serviceEmployeeId: service.id,
        serviceId: service.serviceId,
        employeeId: service.employee.id,
        isRequested: true,
      },
    ],
    deletedServiceEmployeeIds: [],
  };
  this.props.startService(appointment.id, serviceData);
  this.hideDialog();
}

handleToWaiting = () => {
  const { appointment } = this.state;
  this.props.toWaiting(appointment.id);
  this.hideDialog();
}

handlePressFinish = (finish) => {
  const { appointment } = this.state;

  if (!finish) {
    this.props.undoFinishService(appointment.id);
  } else {
    this.props.finishService(appointment.id);
  }

  this.hideDialog();
}

hideDialog = () => {
  this.setState({ isVisible: false });
}

searchText = (query: string, searchClient: boolean, searchProvider: boolean) => {
  const { data } = this.props;
  const prevCount = this.state.data.length;
  if (query === '' || (!searchClient && !searchProvider)) {
    this.setState({ data }, prevCount != data.length ? this.onChangeFilterResultCount : undefined);
  }
  const text = query.toLowerCase();
  // search by the client full name
  const filteredData = data.filter(({ client, services }) => {
  //  if (searchClient) {
    const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;
    // if this row is a match, we don't need to check providers
    if (fullName.toLowerCase().match(text)) { return true; }
    //  }
    //    if (searchProvider) {
    for (let i = 0; i < services.length; i++) {
      const { employee } = services[i];
      const fullName = `${employee.fullName || ''}`;
      // if this provider is a match, we don't need to check other providers
      if (fullName.toLowerCase().match(text)) { return true; }
    }
    //  }
    return false;
  });
  // if no match, set empty array
  if (!filteredData || !filteredData.length) { this.setState({ data: [] }, prevCount != 0 ? this.onChangeFilterResultCount : undefined); }
  // if the matched numbers are equal to the original data, keep it the same
  else if (filteredData.length === data.length) { this.setState({ data: this.props.data }, prevCount != this.props.data.length ? this.onChangeFilterResultCount : undefined); }
  // else, set the filtered data
  else { this.setState({ data: filteredData }, prevCount != filteredData.length ? this.onChangeFilterResultCount : undefined); }
};

sortItems = (option, items) => {
  let sortedItems = [];

  if (option.value === 'FIRST_ARRIVED' || option.value === 'LAST_ARRIVED') {
    sortedItems = _.sortBy(items, item => item.enteredTime);

    if (option.value === 'LAST_ARRIVED') {
      sortedItems = _.reverse(sortedItems);
    }
  } else if (option.value === 'A_Z' || option.value === 'Z_A') {
    sortedItems = _.sortBy(items, item => item.client.fullName);

    if (option.value === 'Z_A') {
      sortedItems = _.reverse(sortedItems);
    }
  }

  return sortedItems;
}

renderItem = (row) => {
  const item: QueueItem = row.item;
  const index = row.index;

  const label = this.getLabelForItem(item);
  const groupLeaderName = this.getGroupLeaderName(item);
  const firstService = item.services[0] || {};
  const serviceName = (firstService.serviceName || '').toUpperCase();
  const employee = !firstService.isFirstAvailable && firstService.employee.fullName ? (firstService.employee.fullName).toUpperCase() : 'First Available';

  const isBookedByWeb = item.queueType === 3;

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
    <SalonTouchableOpacity
      style={styles.itemContainer}
      onPress={() => this.handlePress(item)}
      key={item.id}
    >
      <View style={styles.itemSummary}>
        <View style={{ flexDirection: 'row', marginTop: 11, alignItems: 'center' }}>

          {isBookedByWeb &&
          <View style={{
                backgroundColor: '#115ECD',
                width: 16,
                height: 14,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 5,
                marginTop: 2,
              }}
          >
            <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 8 }}>O</Text>
          </View>
}

          <Text style={styles.clientName}>{item.client.name} {item.client.lastName} </Text>
          <ServiceIcons badgeData={item.badgeData} color={color} item={item} groupLeaderName={groupLeaderName} />
        </View>
        <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
          {serviceName}
          <Text style={{ color: '#727A8F' }}> with</Text> {employee}
          {item.services.length > 1 ? (<Text style={{ color: '#115ECD', fontFamily: 'Roboto-Medium' }}> +{item.services.length - 1}</Text>) : null}

        </Text>

        <QueueTimeNote item={item} type="short" />


      </View>
      <View style={styles.itemIcons}>
        {label}
      </View>
      <Icon name="chevronRight" style={styles.chevron} type="solid" />
    </SalonTouchableOpacity>
  );
}
showNotification = (item, type) => {
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
//
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
      {/* this.props.loading ? (
        <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
) : null */}
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
        {...this.props}
        isVisible={this.state.isVisible}
        client={this.state.client}
        services={this.state.services}
        onDonePress={this.hideDialog}
        onPressSummary={this.handlePressSummary}
        isWaiting={this.props.isWaiting}
        item={this.state.appointment}
        appointment={this.state.appointment}
        hide={this.hideDialog}
      />
      {this.renderNotification()}
    </View>
  );
}
}


Queue.defaultProps = {

};

Queue.propTypes = {
  data: PropTypes.any.isRequired,
  searchClient: PropTypes.any.isRequired,
  searchProvider: PropTypes.any.isRequired,
  filterText: PropTypes.any.isRequired,
  isWaiting: PropTypes.any.isRequired,
  onChangeFilterResultCount: PropTypes.any.isRequired,
};

export default connect(null, actions)(Queue);
