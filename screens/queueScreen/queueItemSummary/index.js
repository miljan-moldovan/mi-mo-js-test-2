import React, { Component } from 'react';
import { View, Animated, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import Icon from '../../../components/UI/Icon';
import ListItem from '../queueListItemSummary';
import SalonIcon from '../../../components/SalonIcon';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import QueueTimeNote from '../queueTimeNote';
import StatusEnum from '../../../constants/Status';
import QueueTypes from '../../../constants/QueueTypes';
import styles from './styles';

class QueueItemSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateYAnim: new Animated.Value(360),
      isVisible: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.isVisible && newProps.isVisible) {
      this.setState({ isVisible: newProps.isVisible });
      this.translateY(0).start();
    } else if (this.props.isVisible && !newProps.isVisible) {
      this.translateY(360).start(() => this.setState({ isVisible: newProps.isVisible }));
    }
  }

fadeInOut = value => Animated.timing( // Animate over time
  this.state.fadeAnim, // The animated value to drive
  {
    toValue: value, // Animate to opacity: 1 (opaque)
    duration: 100, // Make it take a while
  },
); // Starts the animation

translateY = value => Animated.timing( // Animate over time
  this.state.translateYAnim, // The animated value to drive
  {
    toValue: value, // Animate to opacity: 1 (opaque)
    duration: 300, // Make it take a while
  },
); // Starts the animation

keyExtractor = (item, index) => index;

renderItem =({ item }) => (
  <ListItem {...this.props} onDonePress={this.props.onDonePress} service={item} />
)

renderBtnContainer = () => {
  let isActiveCheckin,
    isDisabledCheckin;
  let isActiveReturnLater,
    isDisabledReturnLater;
  let returned;
  let isActiveWalkOut,
    isDisabledWalkOut;
  let isActiveStart,
    isDisabledStart;
  let isActiveWaiting,
    isActiveFinish = true;

  if (this.props.appointment) {
    isDisabledWalkOut = true;
    if (this.props.appointment.status === StatusEnum.checkedIn ||
      this.props.appointment.status === StatusEnum.notArrived) {
      isActiveStart = true;
      isDisabledStart = false;
    } else {
      isDisabledStart = true;
    }
    returned = this.props.appointment.status === StatusEnum.returningLater;
    isActiveWalkOut = !(this.props.appointment.queueType === QueueTypes.PosAppointment);

    if (this.props.appointment.status === StatusEnum.notArrived) {
      isDisabledReturnLater = true;
      isActiveCheckin = true;
    } else {
      isActiveReturnLater = false;
      isDisabledCheckin = false;
    }


    if (this.props.appointment.status === StatusEnum.inService) {
      isActiveWaiting = true;
      isActiveFinish = true;
    } else {
      isActiveFinish = false;
      isActiveWaiting = false;
    }
  }
  const otherBtnStyle = styles.btnBottom;

  if (this.props.isWaiting) {
    return (
      <View style={styles.btnContainer}>
        <SalonTouchableOpacity
          onPress={this.props.onPressSummary.checkIn}
          disabled={!isActiveCheckin}
        >
          <View style={styles.btnGroup}>
            <View style={!isActiveCheckin ? [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}>
              <Icon name="check" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>Check-in</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={() => this.props.onPressSummary.walkOut(isActiveWalkOut)}
        >
          <View style={styles.btnGroup}>
            <View style={styles.btnBottom}>
              <Icon name="signOut" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>{isActiveWalkOut ? 'Walk-out' : 'No Show'} </Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={() => this.props.onPressSummary.modify(this.props.isWaiting, this.props.onPressSummary)}
        >
          <View style={styles.btnGroup}>
            <View style={otherBtnStyle}>
              <Icon name="penAlt" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>Modify</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={() => this.props.onPressSummary.returning(returned)}
          disabled={isDisabledReturnLater}
        >
          <View style={styles.btnGroup}>
            <View style={isDisabledReturnLater ? [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}>
              <Icon name="history" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>{returned ? 'Returned' : 'Returning'}</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={this.props.onPressSummary.toService}
          disabled={(returned || isActiveCheckin)}
        >
          <View style={styles.btnGroup}>

            <View style={(returned || isActiveCheckin) ? [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}>
              <Icon name="play" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>To Service</Text>
          </View>
        </SalonTouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.btnContainer}>
      <SalonTouchableOpacity onPress={this.props.onPressSummary.toWaiting} disabled={!isActiveWaiting}>
        <View style={styles.btnGroup}>
          <View style={isActiveWaiting ? styles.btnBottom : [styles.btnBottom, styles.btnDisabled]}>
            <Icon name="hourglassHalf" size={16} color="#fff" type="solid" />
          </View>
          <Text style={styles.btnbottomText}>To Waiting</Text>
        </View>
      </SalonTouchableOpacity>
      <SalonTouchableOpacity onPress={this.props.onPressSummary.rebook}>
        <View style={styles.btnGroup}>
          <View style={styles.btnBottom}>
            <Icon name="undo" size={16} color="#fff" type="solid" />
          </View>
          <Text style={styles.btnbottomText}>Rebook</Text>
        </View>
      </SalonTouchableOpacity>
      <SalonTouchableOpacity
        onPress={() => this.props.onPressSummary.modify(this.props.isWaiting, this.props.onPressSummary)}
      >
        <View style={styles.btnGroup}>
          <View style={otherBtnStyle}>
            <Icon name="penAlt" size={16} color="#fff" type="solid" />
          </View>
          <Text style={styles.btnbottomText}>Modify</Text>
        </View>
      </SalonTouchableOpacity>
      <SalonTouchableOpacity
        onPress={() => this.props.onPressSummary.finish(isActiveFinish)}
      >
        <View style={styles.btnGroup}>
          <View style={styles.btnBottom}>
            <Icon name="checkSquare" size={16} color="#fff" type="solid" />
          </View>
          <Text style={styles.btnbottomText}>{isActiveFinish ? 'Finish' : 'Undo finish'}</Text>
        </View>
      </SalonTouchableOpacity>
      <SalonTouchableOpacity onPress={this.props.onPressSummary.checkout}>
        <View style={styles.btnGroup}>
          <View style={styles.btnBottom}>
            <Icon name="dollar" size={16} color="#fff" type="solid" />
          </View>
          <Text style={styles.btnbottomText}>Checkout</Text>
        </View>
      </SalonTouchableOpacity>
    </View>
  );
}


goToClientInfo = () => {
  this.props.navigation.navigate('ClientInfo', { client: this.props.client });
  this.props.onDonePress();
};


render() {
  const item = this.props.item ? this.props.item : {};
  let estimatedTime = moment(item.estimatedTime, 'hh:mm:ss').isValid()
    ? moment(item.estimatedTime, 'hh:mm:ss').hours() * 60 + moment(item.estimatedTime, 'hh:mm:ss').minutes()
    : 0;

  if (item.estimatedTime && item.estimatedTime[0] === '-') {
    estimatedTime *= (-1);
  }

  const timeCheckedIn = item.status === StatusEnum.returningLater ? 0 : estimatedTime;
  const isAppointment = item.queueType === QueueTypes.PosAppointment;
  const isBookedByWeb = item.queueType === QueueTypes.BookedbyWeb;

  const { translateYAnim } = this.state;

  if (this.state.isVisible) {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.state.isVisible}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.props.hide}>
            <View style={styles.hideBtn} />
          </TouchableWithoutFeedback>
          <Animated.View style={[
              styles.content,
              {
                transform: [{
                  translateY: translateYAnim,
                }],
              },
            ]}
          >
            <View style={styles.header}>
              <SalonTouchableOpacity onPress={this.props.onDonePress}>
                <Text style={styles.btnText}>Done</Text>
              </SalonTouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={[styles.row, { height: 20 }]}>

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

                <Text style={styles.nameText}>{`${this.props.client.name} ${this.props.client.lastName}`}</Text>
                <SalonTouchableOpacity onPress={this.goToClientInfo}>
                  <SalonIcon style={{ marginLeft: 5 }} icon="iconInfo" size={20} />
                </SalonTouchableOpacity>
              </View>
              {/*  // <View style={[styles.row, { height: 25 }]}>
              //   <Icon name="clockO" size={12} style={{ marginRight: 4 }} color="#72838F" type="light" />
              //   <Text style={styles.timeText}> {moment(item.startTime, 'hh:mm:ss').format('LT')}</Text>
              //   <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
              //   <Text style={styles.remTimeText}>{'exp, start in '}
              //     <Text>{timeCheckedIn}m</Text>
              //     {isAppointment && <Text style={styles.apptLabel}> Appt.</Text>}
              //   </Text>
              //
              // </View>
*/}
              <QueueTimeNote type="long" item={item} />
              <ScrollView style={styles.listContainer}>
                <FlatList
                  data={this.props.services}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                />
              </ScrollView>
              {this.renderBtnContainer()}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
  return null;
}
}

export default QueueItemSummary;
