import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import moment from 'moment';
import Svg, {
  LinearGradient,
  Rect,
  Defs,
  Stop
} from 'react-native-svg';
import { times } from 'lodash'

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
      pan: new Animated.ValueXY({ x: props.left, y: props.top }),
    }
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (e, gesture) => {
        this.moveX = gesture.dx;
        this.moveY = gesture.dy;
        return Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gesture);
      },
      onPanResponderGrant: () => {
          this.state.pan.setOffset({ x: this.props.left, y: this.props.top });
          this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: (e, gesture) => {
        this.props.onDrop();
      },
    });
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
    const { cardWidth, height, left } = this.props;
    const color = colors[mainServiceColor] ? mainServiceColor : 0;
    const clientName = `${client.name} ${client.lastName}`;
    const serviceName = service.description;
    const borderColor = colors[color].dark;
    const contentColor = left > 0 ? colors[color].dark : colors[color].light;
    const serviceTextColor = left > 0 ? '#fff' : '#1D1E29';
    const clientTextColor = left > 0 ? '#fff' : '#2F3142';
    const shadow = {
      shadowColor: '#3C4A5A',
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    };
    const position = left > 0 ? { position: 'absolute', ...this.state.pan.getLayout(), zIndex: 9999, ...shadow } : { position: 'relative'};
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        key={id}
        style={[styles.container,
          { width: cardWidth, height, borderColor, backgroundColor: contentColor },
          position,]}
      >
        <TouchableOpacity
          onLongPress={this.handleOnLongPress}
        >
          <View style={{ width: '100%', height: '100%' }}>
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
      </Animated.View>
    );
  }
}

export default Card;
