// @flow
import * as React from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import moment from 'moment';

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
  baseRadius = 285 - baseStrokeWidth / 2;

class CircularCountdown extends React.Component {
  getLabelColor = (item) => {
    let background = '#4a4a4a';

    if (item.status === QUEUE_ITEM_CHECKEDIN) {
      const progressTime = Math.abs(Math.round(moment.duration(item.progressTime).asMinutes()));
      if (progressTime < 15) {
        background = '#00CF48';
      } else if (progressTime < 30) {
        background = '#FFA300';
      } else {
        background = '#D1242A';
      }
    } else if (item.status === QUEUE_ITEM_NOT_ARRIVED) {
      // todo: (Malakhov) not sure about it
      // background = '#00CF48';
    } else if (item.status === QUEUE_ITEM_INSERVICE) {
      const progressTime = Math.round(moment.duration(item.progressTime).asMinutes());
      const progressMaxTime = Math.round(moment.duration(item.progressMaxTime).asMinutes());
      if (progressTime >= +progressMaxTime + 15) {
        background = '#D1242A';
      } else if (progressTime >= +progressMaxTime) {
        background = '#FFA300';
      } else if (progressTime < +progressMaxTime) {
        background = '#00CF48';
      }
    }
    return background;
  }

  render() {
    const {
      size, style, item,
    } = this.props;


    const processTime = moment(item.processTime, 'hh:mm:ss');
    const progressMaxTime = moment(item.progressMaxTime, 'hh:mm:ss');
    const processMinutes = moment(item.processTime, 'hh:mm:ss').isValid()
      ? processTime.minutes() + processTime.hours() * 60
      : 0;
    const progressMaxMinutes = moment(item.progressMaxTime, 'hh:mm:ss').isValid()
      ? progressMaxTime.minutes() + progressMaxTime.hours() * 60
      : 0;
    let valueForBar = Math.floor((processMinutes / progressMaxMinutes * 100));

    if (valueForBar >= 100) {
      valueForBar = 100;
    } else if (!valueForBar || valueForBar <= 0) {
      valueForBar = 0;
    }


    const strokeWidth = baseStrokeWidth * size / baseSize;
    const radius = baseRadius * size / baseSize; // ((baseSize - 15 - 20) * size/baseSize - strokeWidth/2)/2;
    const progress = valueForBar / 100;

    const fill = '#FFFFFF',
      stroke = this.getLabelColor(item),
      strokeLinecap = 'butt',
      arc = describeArc(size / 2, size / 2, radius, 0, 359.999 * (progress > 1 ? 1 : progress)),
      backgroundArc = describeArc(size / 2, size / 2, radius, 0, 359.999);

    return (
      <View style={[style, { width: size, height: size + 15 }]}>
        <Svg
          height={size}
          width={size}
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
          <View style={[styles.processMinutes, { width: size, height: size }]}>
            <Text style={[styles.processMinutesText, { fontSize: 16, marginBottom: -4 }]}>{processMinutes}</Text>
            <Text style={styles.processMinutesText}>min</Text>
          </View>
          <View style={[{
            width: '100%', height: 10, marginTop: 5, alignItems: 'center',
          }]}
          >
            <Text style={styles.progressMaxMinutes}>{progressMaxMinutes} min est.</Text>
          </View>
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
  processMinutes: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processMinutesText: {
    color: '#4D5067',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
  progressMaxMinutes: {
    color: '#4D5067',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
  },
});
