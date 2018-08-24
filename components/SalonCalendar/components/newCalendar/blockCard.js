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

const styles = StyleSheet.create({
  blockText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    color: '#2F3142',
  },
  notesText: {
    fontWeight: 'normal',
    fontSize: 10,
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
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.activeBlock || (nextProps.isInBuffer !== this.props.isInBuffer
      || nextProps.isActive !== this.props.isActive
    || nextProps.cellWidth !== this.props.cellWidth ||
      !nextProps.isLoading && this.props.isLoading ||
      (!!this.props.isActive && nextProps.isResizeing !== this.props.isResizeing)))
      || nextProps.goToBlockId === nextProps.block.id || nextProps.displayMode !== this.props.displayMode;
  }

  getCardProperties = () => {
    const { isBufferBlock, activeBlock, isActive, isResizeBlock, isResizeing } = this.props;
    if (!isResizeBlock && activeBlock) {
      const { cardWidth, top, left, height } = activeBlock;
      const opacity = isResizeing ? 0 : 1;
      return {
        left,
        width: cardWidth,
        zIndex: 999,
        top,
        height,
        opacity,
      };
    }
    if (!activeBlock && isBufferBlock) {
      return {
        left: 0,
        width: 85,
        zIndex: 1,
        top: 0,
        height: 46,
        opacity: isActive ? 0.7 : 1,
      };
    }
    const {
      block: {
        toTime, fromTime, employee, date,
      },
      apptGridSettings: {
        step,
        minStartTime,
        weeklySchedule,
      },
      cellWidth,
      displayMode,
      provider,
      selectedFilter,
      headerData,
      isInBuffer,
      selectedProvider,
      goToBlockId,
      setGoToPositon,
      storeSchedule,
      numberOfOverlaps,
    } = this.props;
    const blockFromTimeMoment = moment(fromTime, 'HH:mm');
    const blockToTimeMoment = moment(toTime, 'HH:mm');
    const startTimeMoment = moment(minStartTime, 'HH:mm');
    const gap = numberOfOverlaps * 8;
    // calculate left position
    const firstCellWidth = selectedFilter === 'providers' && selectedProvider === 'all' ? 130 : 0;
    let index = 0;
    if (selectedProvider === 'all') {
      index = headerData.findIndex(item => item.id === employee.id);
    } else if (displayMode === 'week') {
      const blockDate = moment(date).format('YYYY-DD-MM');
      index = headerData.findIndex(item => item.format('YYYY-DD-MM') === blockDate);
    }
    const left = (index * cellWidth) + firstCellWidth + gap;
    // calculate card width
    const width = cellWidth - gap;
    // calculate height and top
    const height = ((blockToTimeMoment.diff(blockFromTimeMoment, 'minutes') / step) * 30) - 1;
    const top = (blockFromTimeMoment.diff(startTimeMoment, 'minutes') / step) * 30;
    // calculate zIndex
    const zIndex = isResizeBlock ? 999 : numberOfOverlaps + 1;
    // opacity
    const opacity = (!isActive && !isInBuffer) || isResizeBlock ? 1 : 0.7;
    // go to selected
    if (goToBlockId === id) {
      setGoToPositon({ left, top: verticalPositions[0].top, highlightCard: this.highlightGoTo });
    }
    return {
      left,
      width,
      zIndex,
      top,
      height,
      opacity,
      isActiveEmployeeInCellTime,
    };
  }

  calcualteStateValues = (props) => {
    const {
      toTime, fromTime, employee, date,
    } = props.block;
    const { step } = props.apptGridSettings;
    const {
      startTime, groupedProviders, selectedProvider, providerSchedule
    } = props;
    const blockDate = moment(date).format('YYYY-MM-DD');
    const provider = selectedProvider === 'all' ? groupedProviders[employee.id] ? groupedProviders[employee.id][0] : null : providerSchedule[apptDate] ? providerSchedule[apptDate][0] : null;
    const start = moment(fromTime, 'HH:mm');
    const top = (start.diff(startTime, 'minutes') / step) * 30;
    const end = moment(toTime, 'HH:mm');
    const timeToSpend = end.diff(start, 'minutes');
    const notesLines = timeToSpend >= 30 ? (3 + (((timeToSpend - 30) / 15) * 2)) : 0;
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
      notesLines,
      isActiveEmployeeInCellTime,
    };
  }

  calculateLeftAndGap = (props) => {
    const {
      block, providers, cellWidth, displayMode, selectedProvider
    } = props;
    const date = moment(block.date);
    const startTime = moment(block.fromTime, 'HH:mm');
    let cardWidth = cellWidth - 1;
    let zIndex = 1;
    let left = 0;
    if (selectedProvider === 'all') {
      const firstCellWidth = 130;
      left = providers.findIndex(provider =>
        provider.id === block.employee.id) * cellWidth + firstCellWidth;
    } else if (selectedProvider !== 'all' && displayMode === 'week') {
      const apptDate = moment(block.date).format('YYYY-DD-MM');
      left = providers.findIndex(date => date.format('YYYY-DD-MM') === apptDate) * cellWidth;
    }
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
      notes,
      fromTime,
      toTime,
      id,
    } = this.props.block;
    const { isActive } = this.props;
    const {
      zIndex, cardWidth, left,
    } = this.state;
    const renderColor = colors[color] ? color : 0;
    const { height, notesLines } = this.state;
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
              <Text numberOfLines={notesLines} style={[styles.blockText, styles.notesText]}>
                {notes}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default BlockCard;
