import React, { Component } from 'react';
import { View, Animated, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../../../components/UI/Icon';
import ListItem from '../queueListItemSummary';
import SalonIcon from '../../../components/SalonIcon';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import QueueTimeNote from '../queueTimeNote';
import StatusEnum from '../../../constants/Status';
import QueueTypes from '../../../constants/QueueTypes';
import styles from './styles';
import ClientInfoButton from '../../../components/ClientInfoButton';

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

onPressModify = () => {
  this.props.onPressSummary.modify(this.props.isWaiting, this.props.onPressSummary);
}

onPressReturn = returned => this.props.onPressSummary.returning(returned)

goToClientInfo = () => {
  this.props.onDonePress();
};

keyExtractor = (item, index) => index;

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

renderBtnContainer = () => {
  let isActiveCheckin = false;
  let isDisabledReturnLater;
  let returned;
  let isActiveWalkOut;
  let isActiveFinish;
  let isActiveWaiting = true;
  let isAppointment = true;
  let isActiveUnCheckin = false;
  let isDisabledStart = true;

  if (this.props.appointment) {
    returned = this.props.appointment.status === StatusEnum.returningLater;
    isActiveWalkOut = !(this.props.appointment.queueType === QueueTypes.PosAppointment &&
    !(this.props.appointment.status === StatusEnum.checkedIn));

    isAppointment = this.props.appointment.queueType === QueueTypes.PosAppointment;

    if (this.props.appointment.status === StatusEnum.notArrived) {
      isDisabledReturnLater = true;
      isActiveCheckin = true;
    }

    if (this.props.appointment.status === StatusEnum.checkedIn ||
      this.props.appointment.status === StatusEnum.notArrived ||
      this.props.appointment.status === StatusEnum.returningLater
    ) {
      isDisabledStart = false;
    }

    if (isAppointment && this.props.appointment.status === StatusEnum.checkedIn) {
      isActiveUnCheckin = true;
    }

    if (this.props.appointment.status === StatusEnum.inService) {
      isActiveWaiting = true;
      isActiveFinish = true;
    } else {
      isActiveWaiting = false;
      isActiveFinish = false;
    }
  }
  const otherBtnStyle = styles.btnBottom;

  if (this.props.isWaiting) {
    return (
      <View style={styles.btnContainer}>

        {isActiveUnCheckin ?
          <SalonTouchableOpacity
            onPress={() => this.props.onPressSummary.checkIn(isActiveCheckin)}
          >
            <View style={styles.btnGroup}>
              <View style={styles.btnBottom}>
                <Icon name="check" size={16} color="#fff" type="solid" />
              </View>
              <Text style={styles.btnbottomText}>Uncheck-in</Text>
            </View>
          </SalonTouchableOpacity>
          :
          <SalonTouchableOpacity
            onPress={() => this.props.onPressSummary.checkIn(isActiveCheckin)}
            disabled={!isActiveCheckin}
          >
            <View style={styles.btnGroup}>
              <View style={!isActiveCheckin ?
                  [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}
              >
                <Icon name="check" size={16} color="#fff" type="solid" />
              </View>
              <Text style={styles.btnbottomText}>Check-in</Text>
            </View>
          </SalonTouchableOpacity>
        }
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
        <SalonTouchableOpacity onPress={this.onPressModify}>
          <View style={styles.btnGroup}>
            <View style={otherBtnStyle}>
              <Icon name="penAlt" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>Modify</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={() => { this.onPressReturn(returned); }}
          disabled={isDisabledReturnLater}
        >
          <View style={styles.btnGroup}>
            <View style={isDisabledReturnLater ?
              [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}
            >
              <Icon name="history" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>{returned ? 'Returned' : 'Returning'}</Text>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity
          onPress={this.props.onPressSummary.toService}
          disabled={isDisabledStart}
        >
          <View style={styles.btnGroup}>

            <View style={isDisabledStart ?
              [styles.btnBottom, styles.btnDisabled] : styles.btnBottom}
            >
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
      <SalonTouchableOpacity
        onPress={this.props.onPressSummary.toWaiting}
        disabled={!isActiveWaiting}
      >
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
        onPress={this.onPressModify}
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

renderItem =({ item }) => (
  <ListItem {...this.props} onDonePress={this.props.onDonePress} service={item} />
)

render() {
  const item = this.props.item ? this.props.item : {};
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
                  <View style={styles.bookedbyWebStyle}>
                    <Text style={styles.bookedbyWebText}>O</Text>
                  </View>
                }
                <Text style={styles.nameText}>{`${this.props.client.name} ${this.props.client.lastName}`}</Text>
                <ClientInfoButton
                  client={this.props.client}
                  navigation={this.props.navigation}
                  onDonePress={this.goToClientInfo}
                  buttonStyle={styles.clientIcon}
                  iconStyle={{
                   fontSize: 20, color: '#115ECD', fontWeight: '100', fontFamily: 'FontAwesome5ProLight',
                  }}
                  apptBook={false}
                />
              </View>
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


QueueItemSummary.defaultProps = {
};
QueueItemSummary.propTypes = {
  isVisible: PropTypes.any.isRequired,
  onDonePress: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  item: PropTypes.any.isRequired,
  appointment: PropTypes.any.isRequired,
  isWaiting: PropTypes.any.isRequired,
  onPressSummary: PropTypes.any.isRequired,
  hide: PropTypes.any.isRequired,
  services: PropTypes.any.isRequired,
};

export default QueueItemSummary;
