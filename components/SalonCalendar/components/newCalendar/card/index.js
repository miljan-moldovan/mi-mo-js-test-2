import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Animated } from 'react-native';
import moment from 'moment';
import Svg, {
  LinearGradient,
  Rect,
  Defs,
  Stop,
} from 'react-native-svg';
import { get, times } from 'lodash';
import SvgUri from 'react-native-svg-uri';
import PropTypes from 'prop-types';

import colors from '../../../../../constants/appointmentColors';
import multiProviderUri from '../../../../../assets/svg/multi-provider-icon.svg';
import Icon from '../../../../UI/Icon';
import Badge from '../../../../SalonBadge/index';
import ResizeButton from '../../resizeButtons';
import GroupBadge from '../../../../SalonGroupBadge/index';
import { isCardWithGap, getBadges } from '../../../../../utilities/helpers';

import styles from './styles';

class Card extends Component {
  constructor(props) {
    super(props);
    this.cards = [];
    this.state = {
      height: 0,
      shadowRadius: new Animated.Value(0),
    };
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.activeCard || (nextProps.isInBuffer !== this.props.isInBuffer
      || nextProps.isActive !== this.props.isActive
    || nextProps.width !== this.props.width || nextProps.left !== this.props.left ||
      !nextProps.isLoading && this.props.isLoading ||
      (!!this.props.isActive && nextProps.isResizeing !== this.props.isResizeing)))
      || nextProps.goToAppointmentId === nextProps.appointment.id ||
      nextProps.displayMode !== this.props.displayMode ||
      nextProps.hiddenCard !== this.props.hiddenCard;
  }

  getAfterTimeHeight = () => {
    const { appointment, apptGridSettings } = this.props;

    return (moment.duration(appointment.afterTime).asMinutes() / apptGridSettings.step) * 30
  }

  getGapHeight = () => {
    const { appointment, apptGridSettings } = this.props;

    return (moment.duration(appointment.gapTime).asMinutes() / apptGridSettings.step) * 30;
  }

  getAfterGapHeight = () => this.props.height - this.getAfterTimeHeight() - this.getGapHeight();

  getCardProperties = () => {
    const {
      isBufferCard,
      activeCard,
      isActive,
      isResizeCard,
      isResizeing,
      left,
      width,
    } = this.props;
    if (!isResizeCard && activeCard) {
      const { verticalPositions } = activeCard;
      const opacity = isResizeing ? 0 : 1;
      return {
        left,
        width,
        zIndex: 999,
        verticalPositions,
        opacity,
        isActiveEmployeeInCellTime: true,
      };
    }
    if (!activeCard && isBufferCard) {
      return {
        left,
        width,
        zIndex: 1,
        verticalPositions: [{ top: 0, height: 46 }],
        opacity: isActive ? 0.7 : 1,
        isActiveEmployeeInCellTime: true,
      };
    }
    const {
      appointment: {
        toTime,
        fromTime,
        employee,
        date,
        resource,
        room,
        id,
        gapTime,
        afterTime,
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
      isInBuffer,
      goToAppointmentId,
      setGoToPositon,
    } = this.props;
    const apptFromTimeMoment = moment(fromTime, 'HH:mm');
    const apptToTimeMoment = moment(toTime, 'HH:mm');
    const startTimeMoment = moment(minStartTime, 'HH:mm');
    // calculate height and top
    const verticalPositions = [];
    let height = null;
    let top = null;
    if (isCardWithGap(this.props.appointment)) {
      height = this.getAfterTimeHeight() - 1;
      top = (apptFromTimeMoment.diff(startTimeMoment, 'm') / step) * 30;
      verticalPositions.push({ height, top });
      top += height + this.getGapHeight() + 1;
      height = this.getAfterGapHeight() - 1;
      verticalPositions.push({ height, top });
    } else {
      height = this.props.height - 1;
      top = (apptFromTimeMoment.diff(startTimeMoment, 'minutes') / step) * 30;
      verticalPositions.push({ height, top });
    }
    // calculate zIndex
    const zIndex = isResizeCard ? 999 : 1;
    // opacity
    const opacity = (!isActive && !isInBuffer) || isResizeCard ? 1 : 0.7;
    // is emplyee active in cell time
    let isActiveEmployeeInCellTime = false;
    const todaySchedule = weeklySchedule[moment(date).isoWeekday() - 1];
    const isStoreOff = !todaySchedule.start1 && !todaySchedule.end1
      && !todaySchedule.start2 && !todaySchedule.end2;
    let providerSchedule = null;
    let providerStartTime = null;
    let providerEndTime = null;
    if (selectedFilter === 'providers' || selectedFilter === 'deskStaff') {
      const scheduledIntervals = isStoreOff || provider.isOff ? [] : get(provider, 'scheduledIntervals', []);
      for (let i = 0; !isActiveEmployeeInCellTime && i < scheduledIntervals.length; i += 1) {
        providerSchedule = scheduledIntervals[i];
        providerStartTime = moment(providerSchedule.start, 'HH:mm');
        providerEndTime = moment(providerSchedule.end, 'HH:mm');
        isActiveEmployeeInCellTime = apptFromTimeMoment.diff(providerStartTime, 'm') >= 0 &&
          apptToTimeMoment.diff(providerEndTime, 'm') <= 0;
      }
    } else {
      const storeStart1Moment = todaySchedule.start1 ? moment(todaySchedule.start1, 'HH:mm') : null;
      const storeEnd1Moment = todaySchedule.start1 ? moment(todaySchedule.end1, 'HH:mm') : null;
      const storeStart2Moment = todaySchedule.start1 ? moment(todaySchedule.start2, 'HH:mm') : null;
      const storeEnd2Moment = todaySchedule.start1 ? moment(todaySchedule.end2, 'HH:mm') : null;
      if (storeStart1Moment) {
        isActiveEmployeeInCellTime = apptFromTimeMoment.isSameOrAfter(storeStart1Moment)
          && apptFromTimeMoment.isBefore(storeEnd1Moment);
        if (!isActiveEmployeeInCellTime && storeStart2Moment) {
          isActiveEmployeeInCellTime = apptFromTimeMoment.isSameOrAfter(storeStart2Moment)
            && apptFromTimeMoment.isBefore(storeEnd2Moment);
        }
      }
    }
    if (goToAppointmentId === id) {
      setGoToPositon({ left, top: verticalPositions[0].top, highlightCard: this.highlightGoTo });
    }
    return {
      left,
      width,
      zIndex,
      verticalPositions,
      opacity,
      isActiveEmployeeInCellTime,
    };
  }

  resizeCard = (size) => {
    let { height } = this.state;
    if (height + size >= 30) {
      height += size;
      this.setState({ height });
    }
    return height;
  }

  handleOnLongPress = ({ verticalPositions, left, width }) => {
    const {
      calendarOffset, appointment, isBufferCard, onDrag, startDate
    } = this.props;
    const today = moment();
    if (startDate.isSameOrAfter(today, 'day')) {
      if (isBufferCard) {
        this.cards[0]._propsAnimated._animatedView.measureInWindow((x, y) => {
          const { height } = this.props;
          const newVerticalPositions = [{ top: y, height }];
          onDrag(false, appointment, x, width, newVerticalPositions, true);
        });
      } else {
        const newVerticalPositions = [];
        for (let i = 0; i < verticalPositions.length; i += 1) {
          const item = verticalPositions[i];
          const newItem = { ...item, top: item.top - calendarOffset.y };
          newVerticalPositions.push(newItem);
        }
        const newLeft = left - calendarOffset.x;
        this.props.onDrag(false, appointment, newLeft, width, newVerticalPositions);
      }
    }
  }

  highlightGoTo = () => {
    Animated.timing(
      this.state.shadowRadius,
      {
        toValue: 8,
        duration: 300,
      },
    ).start(this.hideHighlightGoTo);
  }

  hideHighlightGoTo = () => {
    Animated.timing(
      this.state.shadowRadius,
      {
        delay: 7000,
        toValue: 0,
        duration: 300,
      },
    ).start();
  }

  renderAssistant = ({ height }) => (
    <View
      style={[styles.assistantContainer, { height: height - 10 }]}
    >
      <Text
        style={[styles.assistantText, { width: height }]}
        numberOfLines={1}
      >Assistant Assigned
      </Text>
    </View>
  );

  renderBadges = () => {
    const { appointment, hiddenAddonsLength } = this.props;
    const badges = getBadges(appointment, hiddenAddonsLength);
    return (
      <View style={styles.badgesContainer}>
        { badges }
      </View>
    );
  }

  renderStripes = ({ height, width, backgroundColor }) => {
    let gap = 0;
    let countGap2 = 0;
    let countOpacity2 = 0;
    return (
      <Svg
        height={height - 2}
        width={width - 2}
        style={styles.stripesContainer}
      >
        <Defs>
          <LinearGradient
            id="grad"
            x1={0}
            y1={width > height ? width : height}
            x2={width > height ? width : height}
            y2={0}
          >
            {
             times(50).map((index) => {
              gap = countGap2;
              countGap2 = index % 2 === 0 ? countGap2 + 2 : countGap2;
              if (countOpacity2 > 0 && countOpacity2 % 2 === 0) {
                countOpacity2 = index % 2 === 0 ? countOpacity2 : 0;
                return (<Stop key={`${index}${width}`} offset={`${index + gap}%`} stopColor={backgroundColor} stopOpacity="0.4" />);
              }
              countOpacity2 += 1;
                return (<Stop key={`${index}${width}`} offset={`${index + gap}%`} stopColor={backgroundColor} />);
            })
            }
          </LinearGradient>
        </Defs>
        <Rect
          width={width}
          height={height}
          fill="url(#grad)"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  render() {
    const {
      left,
      width,
      zIndex,
      verticalPositions,
      opacity,
      isActiveEmployeeInCellTime,
    } = this.getCardProperties();
    const {
        client,
        service,
        fromTime,
        toTime,
        id,
        mainServiceColor,
        isFirstAvailable,
        requested,
        badgeData,
      } = this.props.appointment;
    const {
      showAssistant,
      isInBuffer,
      panResponder,
      isActive,
      activeCard,
      pan,
      pan2,
      isBufferCard,
      isResizeing,
      isResizeCard,
      isMultiBlock,
      goToAppointmentId,
      hiddenCard,
    } = this.props;
    const lastIndex = verticalPositions.length - 1;
    if (isResizeCard && this.state.height === 0) {
      this.state.height = verticalPositions[lastIndex].height;
    }
    const color = colors[mainServiceColor] ? mainServiceColor : 0;
    const borderColor = colors[color].dark;
    const backgroundColor = activeCard ? borderColor : colors[color].light;
    const clientName = `${client.name} ${client.lastName}`;
    const clientTextColor = activeCard || requested ? '#fff' : '#2F3142';
    let activeClientTextColor = badgeData.isCashedOut ? '#1DA314' : clientTextColor;
    activeClientTextColor = badgeData.isNoShow ? '#D0021B' : activeClientTextColor;
    const borderStyle = isFirstAvailable || hiddenCard ? 'dashed' : 'solid';
    const activeServiceTextColor = activeCard ? '#fff' : '#1D1E29';
    const panHandlers = panResponder ? panResponder.panHandlers : {};
    const positions = !isResizeCard && activeCard ? [pan.getLayout(), pan2.getLayout()] : ['', ''];
    const container = isBufferCard ? [styles.container, { position: 'relative' }] : styles.container;
    const marginTop = isMultiBlock ? { marginTop: 11 } : '';
    const highlightCard = goToAppointmentId === id ? {
      shadowColor: 'rgba(248,231,28,1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: this.state.shadowRadius,
      elevation: 1,
    } : '';
    const clientBackgroundColor = badgeData.isNoShow || badgeData.isCashedOut ?
      { borderColor } : { backgroundColor: borderColor, borderColor };
    const isRequested = requested || badgeData.isNoShow || badgeData.isCashedOut ?
      [styles.requestedStyle, clientBackgroundColor] : '';
    if (!activeCard && isResizeing) {
      return null;
    }

    let elementOpacity = opacity;
    if (hiddenCard) {
      elementOpacity = 0.1;
    }

    return (
      <React.Fragment>
        {
            verticalPositions.map(({ height, top }, index) => {
              const usedBlocks = isMultiBlock ? (height + 1) / 30 : 1;
              return (
                <Animated.View
                  {...panHandlers}
                  ref={(view) => { this.cards.push(view); }}
                  style={[container,
                    {
                      width,
                      height: index === verticalPositions.length - 1
                        && isResizeCard && isResizeing ? this.state.height : height,
                      borderColor,
                      backgroundColor,
                      left,
                      top,
                      borderStyle,
                      zIndex,
                      opacity: elementOpacity,
                    },
                    positions[index],
                    highlightCard,
                  ]}
                >
                  {!isActiveEmployeeInCellTime && !activeCard ?
                    this.renderStripes({ height, width, backgroundColor }) : null}
                  <TouchableOpacity
                    onPress={() => {
                      if (this.props.onPress) {
                        this.props.onPress(this.props.appointment);
                      }
                    }}
                    onLongPress={() => this.handleOnLongPress({ left, verticalPositions, width })}
                    disabled={activeCard || isActive || isInBuffer}
                  >
                    <View style={styles.fullSize}>
                      <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
                      <View style={styles.cardContent}>
                        {this.renderBadges()}
                        <View style={styles.textContainer}>
                          {
                            times(usedBlocks).map(blockIndex => (
                              <View style={[styles.clientContainer,
                                isRequested, blockIndex !== 0 && marginTop]}
                              >
                                <Text
                                  numberOfLines={!isMultiBlock && height > 30 ? 0 : 1}
                                  style={[styles.clientText,
                                    { color: activeClientTextColor }]}
                                >
                                  {clientName}
                                </Text>
                              </View>
                          ))}
                          { !isMultiBlock && height > 30 && (
                            <Text
                              numberOfLines={1}
                              style={[styles.serviceText, { color: activeServiceTextColor }]}
                            >
                              {service.description}
                            </Text>
                          )}
                        </View>
                      </View>
                      { showAssistant && service.useAssistant ?
                        this.renderAssistant({ height }) : null }
                    </View>
                  </TouchableOpacity>
                  {activeCard && !isBufferCard && index === lastIndex ?
                    <ResizeButton
                      onPress={this.props.onResize}
                      color={colors[color].dark}
                      position={styles.resizePosition}
                      height={height}
                      onScrollY={this.props.onScrollY}
                      isDisabled={isResizeing}
                    /> : null }
                </Animated.View>
            );
          })
        }
      </React.Fragment>
    );
  }
}

Card.defaultProps = {
  hiddenCard: false,
  calendarMeasure: {
    width: 0,
    height: 0,
  },
  onScrollY: () => {},
  onPress: () => {},
  onResize: () => {},
};

Card.propTypes = {
  onResize: PropTypes.func,
  hiddenCard: PropTypes.bool,
  calendarMeasure: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  onScrollY: PropTypes.func,
  onPress: PropTypes.func,
};

export default Card;
