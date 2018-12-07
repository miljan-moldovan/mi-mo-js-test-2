import * as React from 'react';
<<<<<<< HEAD:src/components/SalonCalendar/components/newCalendar/blockCard.js
import {TouchableOpacity, View, Text, StyleSheet, Animated} from 'react-native';
=======
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
>>>>>>> fa3b13f66e35da52e64b3e8e7f38f0f35bdacc71:src/components/SalonCalendar/components/newCalendar/blockCard.tsx
import moment from 'moment';
import Svg, {LinearGradient, Rect, Defs, Stop} from 'react-native-svg';
import {times} from 'lodash';

import ResizeButton from '../resizeButtons';
import colors from '../../../../constants/appointmentColors';

const styles = StyleSheet.create ({
  resizePosition: {
    left: -13,
    bottom: -27,
  },
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

class BlockCard extends React.Component {
<<<<<<< HEAD:src/components/SalonCalendar/components/newCalendar/blockCard.js
  constructor (props) {
    super (props);
    this.state = {notesLines: 1, height: 0};
=======
  constructor(props) {
    super(props);
    this.state = { notesLines: 1, height: 0 }
>>>>>>> fa3b13f66e35da52e64b3e8e7f38f0f35bdacc71:src/components/SalonCalendar/components/newCalendar/blockCard.tsx
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.activeBlock ||
      (nextProps.isInBuffer !== this.props.isInBuffer ||
        nextProps.isActive !== this.props.isActive ||
        nextProps.width !== this.props.width ||
        nextProps.left !== this.props.left ||
        (!nextProps.isLoading && this.props.isLoading) ||
        (!!this.props.isActive &&
          nextProps.isResizeing !== this.props.isResizeing)) ||
      nextProps.displayMode !== this.props.displayMode
    );
  }

  getCardProperties = () => {
    const {
      isBufferBlock,
      activeBlock,
      isActive,
      isResizeBlock,
      isResizeing,
      left,
      width,
    } = this.props;
    if (!isResizeBlock && activeBlock) {
      const {top, height} = activeBlock;
      const opacity = isResizeing ? 0 : 1;
      return {
        left,
        width,
        zIndex: 999,
        top,
        height,
        opacity,
      };
    }
    if (!activeBlock && isBufferBlock) {
      return {
        left,
        width,
        zIndex: 1,
        top: 0,
        height: 46,
        opacity: isActive ? 0.7 : 1,
      };
    }
    const {
      block: {toTime, fromTime, employee, date},
      apptGridSettings: {step, minStartTime, weeklySchedule},
      displayMode,
      selectedFilter,
      isInBuffer,
    } = this.props;
    const blockFromTimeMoment = moment (fromTime, 'HH:mm');
    const blockToTimeMoment = moment (toTime, 'HH:mm');
    const startTimeMoment = moment (minStartTime, 'HH:mm');
    // calculate height and top
    const height =
      blockToTimeMoment.diff (blockFromTimeMoment, 'minutes') / step * 30 - 1;
    const top =
      blockFromTimeMoment.diff (startTimeMoment, 'minutes') / step * 30;
    // calculate zIndex
    const zIndex = isResizeBlock ? 999 : 1;
    // opacity
    const opacity = (!isActive && !isInBuffer) || isResizeBlock ? 1 : 0.7;
    return {
      left,
      width,
      zIndex,
      top,
      height,
      opacity,
    };
  };

  handleOnLongPress = ({top, renderedHeight, left, width}) => {
    const {
      calendarOffset,
      block,
      isBufferBlock,
      onDrag,
      startDate,
    } = this.props;
    const today = moment ();
    if (startDate.isSameOrAfter (today, 'day')) {
      if (isBufferBlock) {
        this.block._propsAnimated._animatedView.measureInWindow ((x, y) => {
          const {height} = this.props;
          const newVerticalPositions = [{top: y, height}];
          onDrag (false, block, x, width, newVerticalPositions, true, true);
        });
      } else {
        const newVerticalPositions = [
          {top: top - calendarOffset.y, height: renderedHeight},
        ];
        const newLeft = left - calendarOffset.x;
        this.props.onDrag (
          false,
          block,
          newLeft,
          width,
          newVerticalPositions,
          false,
          true
        );
      }
    }
  };

  resize = size => {
    let {height} = this.state;
    if (height + size >= 30) {
      height += size;
      this.setState ({height});
    }
    return height;
  };

  render () {
    const {
      left,
      width,
      zIndex,
      top,
      height,
      opacity,
    } = this.getCardProperties ();
    const {color, reason, notes, fromTime, toTime, id} = this.props.block;
    const {
      isInBuffer,
      panResponder,
      isActive,
      activeBlock,
      pan,
      isBufferBlock,
      isResizeing,
      isResizeBlock,
    } = this.props;
    if (isResizeBlock && this.state.height === 0) {
      this.state.height = height;
    }
    const renderColor = colors[color] ? color : 0;
    const {notesLines} = this.state;
    const borderColor = colors[renderColor].dark;
    const backgroundColor = activeBlock ? borderColor : colors[color].light;
    const contentColor = colors[renderColor].light;
    const position = !isResizeBlock && activeBlock
      ? pan.getLayout ()
      : {left, top};
    const container = isBufferBlock
      ? [styles.container, {position: 'relative'}]
      : styles.container;
    let countOpacity2 = 0;
    let countGap2 = 0;
    const panHandlers = panResponder ? panResponder.panHandlers : {};
    const integerHeight = isResizeBlock && isResizeing
      ? this.state.height
      : height;
    if (!activeBlock && isResizeing) {
      return null;
    }
    return (
      <Animated.View
        {...panHandlers}
        ref={view => {
          this.block = view;
        }}
        style={[
          container,
          {
            width,
            height: isResizeBlock && isResizeing ? this.state.height : height,
            borderColor,
            backgroundColor,
            zIndex,
            opacity,
          },
          position,
        ]}
      >
        <Svg
          height={integerHeight - 2}
          width={width - 2}
          style={styles.stripesContainer}
        >
          <Defs>
            <LinearGradient
              id="grad"
              x1={0}
              y1={width > integerHeight ? width : integerHeight}
              x2={width > integerHeight ? width : integerHeight}
              y2={0}
            >
              {times (50).map (index => {
                const gap = countGap2;
                countGap2 = index % 2 === 0 ? countGap2 + 2 : countGap2;
                if (countOpacity2 > 0 && countOpacity2 % 2 === 0) {
                  countOpacity2 = index % 2 === 0 ? countOpacity2 : 0;
                  return (
                    <Stop
                      key={`${index}${width}`}
                      offset={`${index + gap}%`}
                      stopColor={contentColor}
                      stopOpacity="0.4"
                    />
                  );
                }
                countOpacity2 += 1;
                return (
                  <Stop
                    key={`${index}${width}`}
                    offset={`${index + gap}%`}
                    stopColor={contentColor}
                  />
                );
              })}
            </LinearGradient>
          </Defs>
          <Rect
            width={width}
            height={integerHeight}
            fill="url(#grad)"
            strokeLinecap="round"
          />
        </Svg>
        <TouchableOpacity
          onPress={() => {
            this.props.onPress && this.props.onPress (this.props.block);
          }}
          onLongPress={() => {
            this.handleOnLongPress ({
              top,
              renderedHeight: integerHeight,
              left,
              width,
            });
          }}
          disabled={isActive}
        >
          <View style={{minHeight: 28, width: '100%', height: '100%'}}>
            <View
              style={[styles.header, {backgroundColor: colors[color].dark}]}
            />
            <Text numberOfLines={1} style={styles.blockText}>
              {reason.name}
            </Text>
            <Text
              numberOfLines={notesLines}
              style={[styles.blockText, styles.notesText]}
            >
              {notes}
            </Text>
          </View>
        </TouchableOpacity>
        {activeBlock && !isBufferBlock
          ? <ResizeButton
              onPress={this.props.onResize}
              color={colors[color].dark}
              position={styles.resizePosition}
              height={height}
              onScrollY={this.props.onScrollY}
              isDisabled={isResizeing}
            />
          : null}
      </Animated.View>
    );
  }
}

export default BlockCard;
