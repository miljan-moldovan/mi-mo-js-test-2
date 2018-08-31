import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import moment from 'moment';
import Svg, {
  LinearGradient,
  Rect,
  Defs,
  Stop,
} from 'react-native-svg';
import { get, times } from 'lodash';
import SvgUri from 'react-native-svg-uri';

import colors from '../../../../constants/appointmentColors';
import multiProviderUri from '../../../../assets/svg/multi-provider-icon.svg';
import Icon from '../../../UI/Icon';
import Badge from '../../../SalonBadge';
import ResizeButton from '../resizeButtons';
import GroupBadge from '../../../SalonGroupBadge';

const styles = StyleSheet.create({
  clientText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    color: '#2F3142',
    flex: 1,
    flexWrap: 'wrap',
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
  fullSize: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  clientContainer: {
    flexDirection: 'row',
    paddingVertical: 1,
    flexWrap: 'wrap',
  },
  textContainer: {
    flex: 1,
  },
  resizePosition: {
    left: -13,
    bottom: -27,
  },
  multiProviderFix: {
    marginTop: 4,
  },
  assistantContainer: {
    position: 'absolute',
    top: 6,
    right: 4,
    width: 15,
    backgroundColor: 'rgba(47, 49, 66, 0.3)',
    borderRadius: 2,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  assistantText: {
    fontSize: 10,
    lineHeight: 10,
    minHeight: 10,
    textAlign: 'center',
    margin: 0,
    padding: 0,
    color: '#fff',
    transform: [{ rotate: '-90deg' }],
  },
  requestedStyle: {
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
});

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
    || nextProps.cellWidth !== this.props.cellWidth ||
      !nextProps.isLoading && this.props.isLoading ||
      (!!this.props.isActive && nextProps.isResizeing !== this.props.isResizeing)))
      || nextProps.goToAppointmentId === nextProps.appointment.id || nextProps.displayMode !== this.props.displayMode;
  }

  getCardProperties = () => {
    const { isBufferCard, activeCard, isActive, isResizeCard, isResizeing } = this.props;
    if (!isResizeCard && activeCard) {
      const { cardWidth, verticalPositions, left } = activeCard;
      const opacity = isResizeing ? 0 : 1;
      return {
        left,
        width: cardWidth,
        zIndex: 999,
        verticalPositions,
        opacity,
        isActiveEmployeeInCellTime: true,
      };
    }
    if (!activeCard && isBufferCard) {
      return {
        left: 0,
        width: 85,
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
        afterTime
      },
      apptGridSettings: {
        step,
        minStartTime,
        weeklySchedule,
      },
      appointments,
      cellWidth,
      displayMode,
      provider,
      selectedFilter,
      headerData,
      isInBuffer,
      selectedProvider,
      goToAppointmentId,
      setGoToPositon,
      storeSchedule,
      numberOfOverlaps,
    } = this.props;
    const dateTime12 = moment('00:00:00', 'HH:mm');
    const apptFromTimeMoment = moment(fromTime, 'HH:mm');
    const apptToTimeMoment = moment(toTime, 'HH:mm');
    const apptGapTimeMoment = moment(gapTime, 'HH:mm');
    const apptAfterTimeMoment = moment(afterTime, 'HH:mm');
    const startTimeMoment = moment(minStartTime, 'HH:mm');
    const gap = numberOfOverlaps * 8;
    // calculate left position
    const firstCellWidth = selectedFilter === 'providers' && selectedProvider === 'all' ? 130 : 0;
    let index;
    switch (selectedFilter) {
      case 'rooms':
        index = headerData.findIndex(item => item.id === room.id);
        break;
      case 'resources':
        index = headerData.findIndex(item => item.id === resource.id);
        break;
      case 'deskStaff':
      case 'providers':
        if (selectedProvider === 'all') {
          index = headerData.findIndex(item => item.id === employee.id);
        } else if (displayMode === 'week') {
          const apptDate = moment(date).format('YYYY-DD-MM');
          index = headerData.findIndex(item => item.format('YYYY-DD-MM') === apptDate);
        }
        break;
      default:
        index = 0;
        break;
    }
    const left = (index * cellWidth) + firstCellWidth + gap;
    // calculate card width
    const width = cellWidth - gap;
    // calculate height and top
    const verticalPositions = [];
    let height = null;
    let top = null;
    if (gapTime !== '00:00:00') {
      const firstBlockDuration = apptAfterTimeMoment.diff(dateTime12, 'm');
      height = ((firstBlockDuration / step) * 30) - 1;
      top = (apptFromTimeMoment.diff(startTimeMoment, 'm') / step) * 30;
      verticalPositions.push({ height, top });
      const gapMinutes = apptGapTimeMoment.diff(dateTime12, 'm');
      const newFromtTime = apptFromTimeMoment.clone().add(firstBlockDuration + gapMinutes, 'm');
      top = (newFromtTime.diff(startTimeMoment, 'm') / step) * 30;
      height = ((apptToTimeMoment.diff(newFromtTime, 'minutes') / step) * 30) - 1;
      verticalPositions.push({ height, top });
    } else {
      height = ((apptToTimeMoment.diff(apptFromTimeMoment, 'minutes') / step) * 30) - 1;
      top = (apptFromTimeMoment.diff(startTimeMoment, 'minutes') / step) * 30;
      verticalPositions.push({ height, top });
    }
    // calculate zIndex
    const zIndex = isResizeCard ? 999 : numberOfOverlaps + 1;
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
    const { badgeData, client: { name, lastName } } = appointment;
    const initials = `${name[0]}${lastName[0]}`;
    const users = appointment.isMultipleProviders ? (
      <View style={styles.multiProviderFix}>
        <SvgUri
          width="16"
          height="8"
          source={multiProviderUri}
          fill="#082E66"
        />
      </View>) : null;
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
    const badgeAddons = hiddenAddonsLength > 0 ? <Badge text={`+${hiddenAddonsLength}`} /> : null;
    const badgeParty = badgeData.isParty ? <GroupBadge text={initials} /> : null;
    return (
      <View style={styles.badgesContainer}>
        {badgeAddons}
        {badgeParty}
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
      isActiveEmployeeInCellTime
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
      goToAppointmentId
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
    const borderStyle = isFirstAvailable ? 'dashed' : 'solid';
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
    return (
      <React.Fragment>
        {
            verticalPositions.map(({ height, top }, index) => {
              const usedBlocks = isMultiBlock ? (height + 1) / 30 : 1;
              return (
                <Animated.View
                  {...panHandlers}
                  ref={(view) => { this.cards.push(view);}}
                  style={[container,
                    {
                      width,
                      height: isResizeCard && isResizeing ? this.state.height : height,
                      borderColor,
                      backgroundColor,
                      left,
                      top,
                      borderStyle,
                      zIndex,
                      opacity,
                    },
                    positions[index],
                    highlightCard,
                  ]}
                >
                  {!isActiveEmployeeInCellTime && !activeCard ?
                    this.renderStripes({ height, width, backgroundColor }) : null}
                  <TouchableOpacity
                    onPress={() => {
                      this.props.onPress(this.props.appointment)
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
                      calendarMeasure={this.props.calendarMeasure}
                      calendarOffset={this.props.calendarOffset}
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

export default Card;
