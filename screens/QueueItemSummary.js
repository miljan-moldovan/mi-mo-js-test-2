import React, { Component } from 'react';
import { View, StyleSheet, Animated, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import moment from 'moment';
import Icon from '../components/UI/Icon';
import ListItem from './QueueListItemSummary';
import SalonIcon from '../components/SalonIcon';
import SalonTouchableOpacity from '../components/SalonTouchableOpacity';
import QueueTimeNote from '../components/QueueTimeNote';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
  },
  header: {
    backgroundColor: '#115ECD',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 19,
  },
  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
    paddingTop: 15,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
  },
  nameText: {
    color: '#111415',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    color: '#115ECD',
    fontSize: 20,
  },
  clockIcon: {
    fontSize: 12,
    color: '#c8c8c8',
    marginRight: 5,
  },
  angleIcon: {
    fontSize: 12,
    marginHorizontal: 8,
    color: '#111415',
  },
  timeText: {
    fontSize: 11,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  remTimeText: {
    fontSize: 10,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  listContainer: {
    marginTop: 10,
    maxHeight: 430,
  },
  btnContainer: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  btnBottom: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#727A8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    color: '#fff',
    fontSize: 26,
  },
  btnbottomText: {
    fontFamily: 'Roboto',
    fontSize: 9,
    color: '#727A8F',
    lineHeight: 9,
    marginTop: 5,
  },
  btnGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStartService: {
    marginLeft: 4,
  },
  btnDisabled: {
    backgroundColor: '#C0C1C6',
  },
  hideBtn: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
});

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
    if (this.props.appointment.status === 0 || this.props.appointment.status === 1) {
      isActiveStart = true;
      isDisabledStart = false;
    } else {
      isDisabledStart = true;
    }
    returned = this.props.appointment.status === 5;
    isActiveWalkOut = !(this.props.appointment.queueType === 1);

    if (this.props.appointment.status === 1 && !this.props.appointment.checkedIn) {
      isDisabledReturnLater = true;
      isActiveCheckin = true;
    } else {
      isActiveReturnLater = false;
      isDisabledCheckin = false;
    }


    if (this.props.appointment.status === 6) {
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
          disabled={!this.props.appointment.checkedIn}
        >
          <View style={styles.btnGroup}>
            <View style={!this.props.appointment.checkedIn ? [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}>
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
              <Icon name="undo" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>{returned ? 'Returned' : 'Return later'}</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={this.props.onPressSummary.toService}
          disabled={returned}
        >
          <View style={styles.btnGroup}>

            <View style={returned ? [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}>
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

render() {
  const item = this.props.item ? this.props.item : {};
  let estimatedTime = moment(item.estimatedTime, 'hh:mm:ss').isValid()
    ? moment(item.estimatedTime, 'hh:mm:ss').hours() * 60 + moment(item.estimatedTime, 'hh:mm:ss').minutes()
    : 0;

  if (item.estimatedTime && item.estimatedTime[0] === '-') {
    estimatedTime *= (-1);
  }

  const timeCheckedIn = item.status === 5 ? 0 : estimatedTime;
  const isAppointment = item.queueType === 1;
  const isBookedByWeb = item.queueType === 3;

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
                <SalonTouchableOpacity onPress={() => alert('Not implemented')}>
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
              <QueueTimeNote item={item} />
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
