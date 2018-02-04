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
  LayoutAnimation
} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import Swipeable from 'react-native-swipeable';

import * as actions from '../actions/queue';
import SideMenuItem from '../components/SideMenuItem';
import { NotificationBanner, NotificationBannerButton } from '../components/NotificationBanner';
import { QueueButton, QueueButtonTypes } from './QueueButton';

class Queue extends React.Component {
  state = {
    refreshing: false,
    notificationVisible: false,
    notificationType: '',
    notificationItem: {},
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(()=>this.setState({refreshing: false}), 1000);
  }
  getButtonsForItem = (item) => {
    const { noShow, returnLater, clientReturned, service, walkout, checkin,
      uncheckin, undoFinish, rebook, checkout, notesFormulas,
      toWaiting, finishService } = QueueButtonTypes;
    const { queueId } = item;
    let left, right;
    if (!item.serviced) {
      if (!item.checked_in) {
        left = [
          <QueueButton type={noShow} left/>
        ];
        right = [
          <QueueButton type={checkin} right
            onPress={()=>{
              LayoutAnimation.spring();
              this.props.checkInClient(queueId);
              }} />,
          <QueueButton type={service} right
            onPress={()=>{
              LayoutAnimation.spring();
              this.props.startService(queueId);
              this.showNotification(item, 'service')
            }} />
        ];
      } else {
        left = [
          <QueueButton type={returnLater} onPress={()=>{ LayoutAnimation.spring(); this.props.returnLater(queueId)}} left/>,
          <QueueButton type={walkout} onPress={()=>{ LayoutAnimation.spring(); this.props.walkOut(queueId)}} left/>
        ];
        right = [
          <QueueButton type={uncheckin} right/>,
          <QueueButton type={service} onPress={()=>{
            LayoutAnimation.spring();
            this.props.startService(queueId);
            this.showNotification(item, 'service')
          }} right/>
        ];
      }
    } else {
      if (item.finishService) {
        left = [
          <QueueButton type={undoFinish} left/>
        ];
        right = [
          <QueueButton type={rebook} right/>,
          <QueueButton type={checkout} right/>
        ];
      } else {
        left = [
          <QueueButton type={notesFormulas} left/>,
          <QueueButton type={toWaiting} onPress={()=>{ LayoutAnimation.spring(); this.props.toWaiting(queueId)}} left/>
        ];
        right = [
          <QueueButton type={finishService} onPress={()=>{ LayoutAnimation.spring(); this.props.finishService(queueId)}} right/>,
          <QueueButton type={checkout} right/>
        ];
      }
    }
    return { left, right };
  }
  getLabelForItem = (item) => {
    switch (item.status) {
      case 7:
        return (
          <View style={styles.waitingTime}>
            <Text style={styles.waitingTimeTextTop}>FINISHED</Text>
          </View>
        )
      case 5:
        return (
          <View style={styles.waitingTime}>
            <Text style={styles.waitingTimeTextTop}>RETURNING</Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.waitingTime}>
            <Text style={styles.waitingTimeTextTop}>NOT ARRIVED</Text>
          </View>
        );
      default:
        return (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.waitingTime}>
              <Text style={styles.waitingTimeTextTop}>Waiting</Text>
              <Text style={styles.waitingTimeTextMid}>{item.processTime}</Text>
              <Text style={styles.waitingTimeTextBottom}>min</Text>
            </View>
            <View style={styles.waitingTime}>
              <Text style={styles.waitingTimeTextTop}>Est. Wait</Text>
              <Text style={styles.waitingTimeTextMid}>{item.estimatedTime}</Text>
              <Text style={styles.waitingTimeTextBottom}>min</Text>
            </View>
          </View>
        );
    }
  }
  renderItem = ({ item, index }) => {
    const buttons = this.getButtonsForItem(item);
    const label = this.getLabelForItem(item);
    return (
      <Swipeable leftButtons={buttons.left} rightButtons={buttons.right} key={item.queueId} leftButtonWidth={100} rightButtonWidth={100}>
        <TouchableOpacity style={styles.itemContainer} onPress={()=>this.props.navigation.navigate('QueueDetail', { item })}>
          <View style={styles.itemSummary}>
            <Text style={styles.clientName}>{item.client.name} {item.client.lastName}</Text>
            <Text style={styles.serviceName}>
              {item.services[0].description}
              {item.services.length > 1 ? '(+'+(item.services.length - 1)+')' : null}
              &nbsp;with {item.employees[0].name} {item.employees[0].lastName}
            </Text>
            <Text style={styles.serviceTimeContainer}>at <Text style={styles.serviceTime}>{item.start_time}</Text></Text>
          </View>
          {label}
        </TouchableOpacity>
      </Swipeable>
    );
  }
  showNotification = (item, type) => {
    console.log('showNotification', type);
    this.setState({
      notificationVisible: true,
      notificationType: type,
      notificationItem: item
    });
  }
  onDismissNotification = () => {
    console.log('onDismissNotification');
    this.setState({ notificationVisible: false });
  }
  renderNotification = () => {
    const { notificationType, notificationItem,
            notificationVisible } = this.state;
    console.log('renderNotification - notificationVisible', notificationVisible);
    let notificationColor, notificationButton, notificationText;
    switch (notificationType) {
      case 'service':
        const client = notificationItem.client || {};
        notificationText = (<Text>Started service for <Text style={{fontFamily: 'OpenSans-Bold'}}>{client.name +' '+ client.lastName}</Text></Text>);
        notificationColor = '#ccc';
        notificationButton = <NotificationBannerButton title="UNDO" />
        break;
      default: ''
    }
    return (
      <NotificationBanner
        backgroundColor={notificationColor}
        visible={notificationVisible}
        button={notificationButton}
        onDismiss={this.onDismissNotification}>
        <Text>{notificationText}</Text>
      </NotificationBanner>
    )
  }
  _keyExtractor = (item, index) => item.queueId;

  render() {
    console.log('queue.data: ', this.props.data);

    return (
      <View style={styles.container}>
        <FlatList
          renderItem={this.renderItem}
          data={this.props.data}
          keyExtractor={this._keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
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
    backgroundColor: '#333'
  },
  itemContainer: {
    // width: '100%',
    height: 104,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29,29,38,1)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
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
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
