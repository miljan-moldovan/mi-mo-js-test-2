// @flow
import React, { Component } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  QUEUE_ITEM_FINISHED,
  QUEUE_ITEM_RETURNING,
  QUEUE_ITEM_NOT_ARRIVED,
  QUEUE_ITEM_CHECKEDIN,
  QUEUE_ITEM_INSERVICE,
} from '../constants/QueueStatus';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');

  return d;
}
const baseSize = 600,
  baseStrokeWidth = 40,
  baseRadius = 285 - baseStrokeWidth / 2,
  normal = '#31CE49',
  warning = '#FCA301',
  danger = '#D1242A';

class CircularCountdown extends Component {
  getStrokeColor() {
    const {
      estimatedTime, processTime, itemStatus, queueType,
    } = this.props;
    switch (itemStatus) {
      case QUEUE_ITEM_NOT_ARRIVED:
        if (processTime != null && estimatedTime != null) {
          if (processTime > estimatedTime + 15) { return danger; } else if (processTime > estimatedTime + 60) { return warning; }
          return normal;
        }
        return normal;

      case QUEUE_ITEM_RETURNING:
        return normal;
      case QUEUE_ITEM_CHECKEDIN:
        // FIXME fix once appointment API is defined
      //  if (QueueType == QueueTypes.PosAppointment || estimatedTime == null) {
        if (queueType == 1 || estimatedTime == null) {
          if (processTime > 30) { return danger; } else if (processTime > 15) { return warning; }
          return normal;
        }

        if (processTime > estimatedTime + 15) { return danger; } else if (processTime > estimatedTime + 60) { return warning; }
        return normal;

      case QUEUE_ITEM_INSERVICE:
        if (estimatedTime - processTime <= -15) { return danger; } else if (estimatedTime - processTime <= 0) { return warning; }
        return normal;
        // not implemented in mobile
        // case QUEUE_ITEM_FINISHED:
        //   if (TimeSpanExtensions.Now - FinishServiceTime > new TimeSpan(0, 30, 0))
        //     return danger;
        //   else if (TimeSpanExtensions.Now - FinishServiceTime > new TimeSpan(0, 15, 0))
        //     return warning;
        //   else
        //    return normal;
      default:
        return normal;
    }
  }
  render() {
    const {
      size, estimatedTime, processTime, style, itemStatus,
    } = this.props;
    const strokeWidth = baseStrokeWidth * size / baseSize;
    const radius = baseRadius * size / baseSize; // ((baseSize - 15 - 20) * size/baseSize - strokeWidth/2)/2;
    const progress = estimatedTime > 0 ? processTime / estimatedTime : 0;
    const delay = (estimatedTime - processTime) / 60;

    const fill = '#FFFFFF',
      // stroke = progress <= 1 ? '#31CE49' : (progress <= 1.2 ? '#FCA301' : '#D1242A'),
      stroke = this.getStrokeColor(),
      strokeLinecap = 'butt',
      arc = describeArc(size / 2, size / 2, radius, 0, 359.999 * (progress > 1 ? 1 : progress)),
      backgroundArc = describeArc(size / 2, size / 2, radius, 0, 359.999);

    return (
      <View style={[style, { width: size }]}>
        <Svg
          height={size}
          width={size}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Path
            d={backgroundArc}
            fill={fill}
            stroke="#C0C1C6"
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
          />
          <Path
            d={arc}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
          />
        </Svg>
        <View style={[styles.overlayContainer, { width: size + 10, height: size }]}>
          <View style={[styles.processTime, { width: size, height: size }]}>
            <Text style={[styles.processTimeText, { fontSize: 16, marginBottom: -4 }]}>{processTime}</Text>
            <Text style={styles.processTimeText}>min</Text>
          </View>
          <Text style={styles.estimatedTime}>{estimatedTime} min est.</Text>
        </View>
      </View>
    );
  }
}
export default CircularCountdown;

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    alignItems: 'center',

  },
  processTime: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processTimeText: {
    color: '#4D5067',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
  estimatedTime: {
    color: '#4D5067',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
  },
});
