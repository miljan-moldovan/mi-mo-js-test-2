import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
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
  stripesContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 4,
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
      calendarMeasure, calendarOffset, onScrollY, cardWidth, isActive, isBufferCard, apptGridSettings, opacity,
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
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    };
    const position = isActive ? {
      position: 'absolute', ...this.props.pan.getLayout(), zIndex: 9999, ...shadow, width: cardWidth
    } : { position: 'relative', flex: 1 / 4, marginHorizontal: 2 };
    return (
      <Animated.View
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
        <TouchableOpacity
          onLongPress={this.handleOnLongPress}
        >
          <View style={{ width: '100%', height: '100%' }} ref={(view) => { this.card = view; }}>
            <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
            <Text
              numberOfLines={1}
              style={[styles.clientText, { color: clientTextColor }]}
            >
              {clientName}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.serviceText, { color: serviceTextColor }]}
            >
              {serviceName}
            </Text>
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
            top={this.props.pan.y._value + this.props.pan.y._offset}
          /> : null }
      </Animated.View>
    );
  }
}

export default Card;
