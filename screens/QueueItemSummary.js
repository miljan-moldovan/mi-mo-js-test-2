import React, { Component } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import Icon from '../components/UI/Icon';
import ListItem from './QueueListItemSummary';
import SalonIcon from '../components/SalonIcon';

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
    maxHeight: 172,
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
    <ListItem service={item} />
  )

  renderBtnContainer = () => {
    if (this.props.isWaiting) {
      const btnCheckInStyle =
        this.props.isCheckedIn ? [styles.btnBottom, styles.btnDisabled] : styles.btnBottom;
      const otherButtonsStyle =
        !this.props.isCheckedIn ? [styles.btnBottom, styles.btnDisabled] : styles.btnBottom;
      return (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={this.props.onPressSummary.checkIn}
            disabled={this.props.isCheckedIn}
          >
            <View style={styles.btnGroup}>
              <View style={btnCheckInStyle}>
                <SalonIcon icon="checkin" size={16} />
              </View>
              <Text style={styles.btnbottomText}>Check-in</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.onPressSummary.walkOut}
            disabled={!this.props.isCheckedIn}
          >
            <View style={styles.btnGroup}>
              <View style={otherButtonsStyle}>
                <SalonIcon icon="walkout" size={16} />
              </View>
              <Text style={styles.btnbottomText}>Walk-out</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.onPressSummary.modify}
          >
            <View style={styles.btnGroup}>
              <View style={otherButtonsStyle}>
                <SalonIcon icon="modify" size={16} />
              </View>
              <Text style={styles.btnbottomText}>Modify</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.onPressSummary.returning}
            disabled={!this.props.isCheckedIn}
          >
            <View style={styles.btnGroup}>
              <View style={otherButtonsStyle}>
                <SalonIcon icon="returning" size={16} />
              </View>
              <Text style={styles.btnbottomText}>Returning</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.onPressSummary.toService}
            disabled={!this.props.isCheckedIn}
          >
            <View style={styles.btnGroup}>
              <View style={otherButtonsStyle}>
                <SalonIcon icon="startService" size={16} style={styles.iconStartService} />
              </View>
              <Text style={styles.btnbottomText}>To Service</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={this.props.onPressSummary.checkIn}>
          <View style={styles.btnGroup}>
            <View style={styles.btnBottom}>
              <Icon name="hourglassHalf" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>To Waiting</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onPressSummary.rebook}>
          <View style={styles.btnGroup}>
            <View style={styles.btnBottom}>
              <Icon name="undo" size={16} color="#fff" type="solid" />
            </View>
            <Text style={styles.btnbottomText}>Rebook</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onPressSummary.modify}>
          <View style={styles.btnGroup}>
            <View style={styles.btnBottom}>
              <SalonIcon icon="modify" size={16} />
            </View>
            <Text style={styles.btnbottomText}>Modify</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onPressSummary.returning}>
          <View style={styles.btnGroup}>
            <View style={styles.btnBottom}>
              <Icon name="checkSquare" size={16} color="#fff" type="regular" />
            </View>
            <Text style={styles.btnbottomText}>Finish</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onPressSummary.toService}>
          <View style={styles.btnGroup}>
            <View style={styles.btnBottom}>
              <Icon name="dollar" size={16} color="#fff" type="regular" />
            </View>
            <Text style={styles.btnbottomText}>Checkout</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
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
                <TouchableOpacity onPress={this.props.onDonePress}>
                  <Text style={styles.btnText}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.body}>
                <View style={styles.row}>
                  <Text style={styles.nameText}>{`${this.props.client.name} ${this.props.client.lastName}`}</Text>
                  <TouchableOpacity onPress={() => alert('Not implemented')}>
                    <SalonIcon style={{ marginLeft: 5 }} icon="iconInfo" size={20} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.row, { marginTop: 8 }]}>
                  <Icon name="clockO" size={12} style={{ marginRight: 4 }} color="#72838F" type="light" />
                  <Text style={styles.timeText}>11:57 AM</Text>
                  <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
                  <Text style={styles.remTimeText}>{'REM wait '}
                    <Text style={styles.underlineText}>7m</Text>
                  </Text>
                </View>
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
