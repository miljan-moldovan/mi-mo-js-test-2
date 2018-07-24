import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import moment from 'moment';
import Svg, {
  LinearGradient,
  Rect,
  Defs,
  Stop,
} from 'react-native-svg';
import { times } from 'lodash';

import colors from '../../../../constants/appointmentColors';
import ResizeButton from '../resizeButtons';
import Badge from '../../../SalonBadge';
import Icon from '../../../UI/Icon';

const styles = StyleSheet.create({
  clientText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    color: '#2F3142',
  },
  serviceText: {
    color: '#1D1E29',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: 'normal',
    paddingHorizontal: 8,
  },
  header: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  container: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: 1,
  },
});

class Card extends Component {
  constructor(props) {
    super(props);
    this.scrollValue = 0;
    this.state = {
      height: props.height,
    };
  }

  componentWillUpdate(nextProps) {
    this.state.height = nextProps.height !== this.props.height ? nextProps.height : this.state.height;
  }

  handleOnLongPress = () => {
    const { appointment, cardWidth, height, onLongPress } = this.props
    if (onLongPress) {
      this.card.measureInWindow((x, y) => {
        onLongPress(false, appointment, x, y, cardWidth, height, true);
      });
    }
  }

  resizeCard = (size) => {
    let { height } = this.state;
    if (height + size >= 30) {
      height += size;
      this.setState({ height });
    }
    return height;
  }

  renderBadges = () => {
    const { appointment } = this.props;
    const { badgeData } = appointment;
    const users = appointment.isMultipleProviders ? <Icon color="#082E66" size={16} name="users" type="solid" /> : null;
    const star = badgeData.clientHasMembership ? <Icon color="#082E66" size={16} name="star" type="solid" /> : null;
    const birthdayCake = badgeData.clientBirthday ? <Icon color="#082E66" size={16} name="birthdayCake" type="regular" /> : null;
    const checkCircle = appointment.confirmationStatus ? <Icon color="#082E66" size={16} name="checkCircle" type="solid" /> : null;
    const repeat = badgeData.isRecurring ? <Icon color="#082E66" size={16} name="repeatAlt" type="solid" /> : null;
    const badgeNL = !badgeData.clientIsNew && badgeData.clientIsNewLocally ? <Badge text="NL" /> : null;
    const badgeN = badgeData.clientIsNew ? <Badge text="N" /> : null;
    const badgeO = badgeData.isOnlineBooking ? <Badge text="O" /> : null;
    const badgeW = badgeData.isWaiting ? <Badge text="W" /> : null;
    const badgeS = badgeData.isInService ? <Badge text="S" /> : null;
    const badgeF = badgeData.isFinished ? <Badge text="F" /> : null;
    const badgeR = badgeData.isReturning ? <Badge text="R" /> : null;
    return (
      <React.Fragment>
        { users }
        { star }
        { birthdayCake }
        { checkCircle }
        { repeat }
        { badgeNL }
        { badgeN }
        { badgeO }
        { badgeW }
        { badgeS }
        { badgeF }
        { badgeR }
      </React.Fragment>
    );
  }

  render() {
    const {
      client,
      service,
      fromTime,
      toTime,
      id,
      mainServiceColor,
      isFirstAvailable,
    } = this.props.appointment;
    const { height } = this.state;
    const {
      calendarMeasure, calendarOffset, onScrollY, cardWidth, isActive, isBufferCard, apptGridSettings, opacity, top, left
    } = this.props;
    const color = colors[mainServiceColor] ? mainServiceColor : 0;
    const clientName = `${client.name} ${client.lastName}`;
    const serviceName = service.description;
    const borderColor = colors[color].dark;
    const contentColor = isActive ? colors[color].dark : colors[color].light;
    const serviceTextColor = isActive ? '#fff' : '#1D1E29';
    const clientTextColor = isActive ? '#fff' : '#2F3142';
    const shadow = {
      shadowColor: '#3C4A5A',
      shadowOffset: { height: 8, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    };
    const activePosition = top || !this.props.pan ? { position: 'absolute', top, left, width: cardWidth } : {
      position: 'absolute', ...this.props.pan.getLayout(), zIndex: 9999, width: cardWidth
    };
    const position = isActive ? activePosition : { position: 'relative', flex: 1 / 4, marginHorizontal: 2 };
    const wrap = height > 30 ? { flexWrap: 'wrap' } : { ellipsizeMode: 'tail' };
    const panHandlers = this.props.panResponder ? this.props.panResponder.panHandlers : {};
    return (
      <Animated.View
        { ...panHandlers }
        key={id}
        style={[
          styles.container,
          {
            opacity,
            height,
            borderColor,
            backgroundColor: contentColor,
          },
          position,
        ]}
      >
        <View style={isActive ? shadow : ''}>
          <TouchableOpacity
            onLongPress={this.handleOnLongPress}
            style={{ overflow: 'hidden' }}
          >
            <View style={{ width: '100%', height }} ref={(view) => { this.card = view; }}>
              <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
              <View style={{flexDirection: 'row', paddingHorizontal: 2}}>
                {this.renderBadges()}
                <Text
                  numberOfLines={height > 30 ? 0 : 1}
                  style={[styles.clientText, { flex: 1, color: clientTextColor }, wrap]}
                >
                  {clientName}
                </Text>
              </View>
              {
                height > 30 ?
                  <Text
                    numberOfLines={1}
                    style={[styles.serviceText, { color: serviceTextColor }]}
                  >
                    {serviceName}
                  </Text> : null
              }
            </View>
          </TouchableOpacity>
          {isActive && !isBufferCard ?
            <ResizeButton
              onPress={this.props.onResize}
              onResize={this.resizeCard}
              color={colors[color].dark}
              position={{ left: -13, bottom: -27 }}
              apptGridSettings={apptGridSettings}
              height={height}
              calendarMeasure={calendarMeasure}
              calendarOffset={calendarOffset}
              onScrollY={onScrollY}
              isDisabled={this.props.isResizeing}
            /> : null }
        </View>
      </Animated.View>
    );
  }
}

export default Card;
