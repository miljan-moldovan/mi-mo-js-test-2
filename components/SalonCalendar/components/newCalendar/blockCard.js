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
//import ResizeButton from '../resizeButtons';

const styles = StyleSheet.create({
  blockText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    color: '#2F3142',
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

class BlockCard extends Component {
  constructor(props) {
    super(props);
    this.scrollValue = 0;
    this.state = this.calcualteStateValues(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isActive !== this.props.isActive
    || nextProps.cellWidth !== this.props.cellWidth ||
      !nextProps.isLoading && this.props.isLoading ||
      (this.props.isActive && nextProps.isResizeing !== this.props.isResizeing);
  }

  calcualteStateValues = (props) => {
    const {
      toTime, fromTime, employeeId, date,
    } = props.block;
    const { step } = props.apptGridSettings;
    const {
      startTime, groupedProviders,
    } = props;
    const provider = groupedProviders[employeeId] ? groupedProviders[employeeId][0] : 0;
    const start = moment(fromTime, 'HH:mm');
    const top = (start.diff(startTime, 'minutes') / step) * 30;
    const end = moment(toTime, 'HH:mm');
    const { left, cardWidth, zIndex } = this.calculateLeftAndGap(props);
    const height = ((end.diff(start, 'minutes') / step) * 30) - 1;
    const usedBlocks = (height + 1) / 30;
    let isActiveEmployeeInCellTime = false;
    if (provider &&
      provider.scheduledIntervals && provider.scheduledIntervals[0]) {
      const employeeTime = provider.scheduledIntervals[0];
      const employeeStartTime = moment(employeeTime.start, 'HH:mm');
      const employeeEndTime = moment(employeeTime.end, 'HH:mm');
      isActiveEmployeeInCellTime = start.diff(employeeStartTime, 'm') >= 0 &&
        end.diff(employeeEndTime, 'm') <= 0;
    }
    const opacity = !props.isActive && !props.isInBuffer ? 1 : 0.7;
    return {
      pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top: new Animated.Value(top),
      height: new Animated.Value(height),
      isResizeing: false,
      opacity,
      cardWidth,
      cardHeight: height,
      zIndex,
      step,
      usedBlocks,
      isActiveEmployeeInCellTime,
    };
  }

  calculateLeftAndGap = (props) => {
    const {
      block, providers, cellWidth,
    } = props;
    const date = moment(block.date);
    const startTime = moment(block.fromTime, 'HH:mm');
    let cardWidth = cellWidth - 1;
    let zIndex = 1;
    const firstCellWidth = 102;
    const left = providers.findIndex(provider =>
      provider.id === block.employeeId) * cellWidth + firstCellWidth;
    return { cardWidth, zIndex, left };
  }

  handleOnLongPress = () => {
    // this.props.onDrag(
    //   false, this.props.appointment, this.state.left - this.props.calendarOffset.x,
    //   this.state.top._value - this.props.calendarOffset.y, this.state.cardWidth, this.state.height._value,
    // );
  }

  render() {
    this.state = this.calcualteStateValues(this.props);
    const {
      color,
      reason,
      fromTime,
      toTime,
      id,
    } = this.props.block;
    const { isActive } = this.props;
    const {
      zIndex, cardWidth, left,
    } = this.state;
    const renderColor = colors[color] ? color : 0;
    const { height } = this.state;
    const borderColor = colors[renderColor].dark;
    const contentColor = colors[renderColor].light;
    let countOpacity2 = 0;
    let countGap2 = 0;
    const opacity = isActive && this.props.isResizeing ? 0 : 1;
    return (
      <Animated.View key={id} style={{ position: 'absolute', zIndex, opacity }}>
        <Animated.View
          style={[styles.container,
            {
          width: cardWidth,
          height,
          borderColor,
          backgroundColor: colors[color].light,
          left,
          top: this.state.top,
          opacity: this.state.opacity,
          }]}

        >
            <Svg
              height={height._value - 2}
              width={cardWidth - 2}
              style={styles.stripesContainer}
            >
              <Defs>
                <LinearGradient
                  id="grad"
                  x1={0}
                  y1={cardWidth > height._value ? cardWidth : height._value}
                  x2={cardWidth > height._value ? cardWidth : height._value}
                  y2={0}
                >
                  {
                   times(50).map((index) => {
                    const gap = countGap2;
                    countGap2 = index % 2 === 0 ? countGap2 + 2 : countGap2;
                    if (countOpacity2 > 0 && countOpacity2 % 2 === 0) {
                      countOpacity2 = index % 2 === 0 ? countOpacity2 : 0;
                      return (<Stop key={`${index}${cardWidth}`} offset={`${index + gap}%`} stopColor={contentColor} stopOpacity="0.4" />);
                    }
                    countOpacity2 += 1;
                      return (<Stop key={`${index}${cardWidth}`} offset={`${index + gap}%`} stopColor={contentColor} />);
                  })
                  }
                </LinearGradient>
              </Defs>
              <Rect
                width={cardWidth}
                height={height._value}
                fill="url(#grad)"
                strokeLinecap="round"
              />
            </Svg>
          <TouchableOpacity
            onPress={() => {
              //this.props.onPress(this.props.appointment)
            }}
            onLongPress={this.handleOnLongPress}
            disabled={isActive}
          >
            <View style={{ minHeight: 28, width: '100%', height: '100%' }}>
              <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
              <Text
                numberOfLines={1}
                style={styles.blockText}
              >
                {reason.name}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default BlockCard;
