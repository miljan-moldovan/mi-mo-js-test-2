// @flow
import React, { Component } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}
const baseSize = 600,
      baseStrokeWidth = 40,
      baseRadius = 285 - baseStrokeWidth / 2;

class CircularCountdown extends Component {
    render() {
      const { size, estimatedTime, processTime, style } = this.props;
      const strokeWidth = baseStrokeWidth * size/baseSize;
      const radius = baseRadius * size/baseSize; //((baseSize - 15 - 20) * size/baseSize - strokeWidth/2)/2;
      const progress = processTime / estimatedTime;

      const fill = "transparent",
            stroke = progress <= 1 ? '#31CE49' : (progress <= 1.2 ? '#FCA301' : '#D1242A'),
            strokeLinecap="butt",
            arc = describeArc(size/2, size/2, radius, 0, 359.999 * ( progress > 1 ? 1 : progress )),
            backgroundArc = describeArc(size/2, size/2, radius, 0, 359.999);

      return (
        <View style={[style, { width: size }]}>
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
          <View style={[styles.overlayContainer, { width: size, height: size+50 }]}>
            <View style={[styles.processTime, { width: size, height: size }]}>
              <Text style={[styles.processTimeText, {fontSize:16, marginBottom: -4}]}>{processTime}</Text>
              <Text style={styles.processTimeText}>min</Text>
            </View>
            <Text style={styles.estimatedTime}>{estimatedTime}min est.</Text>
          </View>
        </View>
      );
    }
}
export default CircularCountdown;

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    alignItems: 'center'
  },
  processTime: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  processTimeText: {
    color: '#4D5067',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    padding: 0,
    margin: 0
  },
  estimatedTime: {
    color: '#4D5067',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
  }
});
