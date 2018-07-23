import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import moment from 'moment';
import Svg, {
  LinearGradient,
  Rect,
  Defs,
  Stop,
} from 'react-native-svg';
import { get, times } from 'lodash';

import colors from '../../../../constants/appointmentColors';
import Icon from '../../../UI/Icon';
import Badge from '../../../SalonBadge';

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
    this.state = {
      pan: new Animated.ValueXY(),
      pan2: new Animated.ValueXY(),
    };
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.props.isActive,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.props.isActive,
      onPanResponderMove: (e, gesture) => {
        console.log('BACONPAN', this.state.pan.getLayout())
        return Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
      }, {
        dx: this.state.pan2.x,
        dy: this.state.pan2.y,
      }])(e, gesture, gesture)
    },
      onPanResponderRelease: (e, gesture) => {}
    });
}

  shouldComponentUpdate(nextProps) {
    return nextProps.isInBuffer !== this.props.isInBuffer || nextProps.isActive !== this.props.isActive
    || nextProps.cellWidth !== this.props.cellWidth ||
      !nextProps.isLoading && this.props.isLoading ||
      (!!this.props.isActive && nextProps.isResizeing !== this.props.isResizeing);
  }

  getCardProperties = () => {
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
        minStartTime
      },
      appointments,
      cellWidth,
      displayMode,
      isAllProviderView,
      provider,
      selectedFilter,
      headerData,
      isInBuffer,
      isActive,
      isResizeing,
    } = this.props;
    const dateTime12 = moment('00:00:00', 'HH:mm');
    const apptFromTimeMoment = moment(fromTime, 'HH:mm');
    const apptToTimeMoment = moment(toTime, 'HH:mm');
    const apptGapTimeMoment = moment(gapTime, 'HH:mm');
    const apptAfterTimeMoment = moment(afterTime, 'HH:mm');
    const startTimeMoment = moment(minStartTime, 'HH:mm');
    const formatedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    // calculate number of overlaps
    let currentAppt = null;
    let currentDate = null;
    let numberOfOverlaps = 0;
    for (let i = 0; i < appointments.length; i += 1) {
      currentAppt = appointments[i];
      if (currentAppt.id !== id) {
        currentDate = moment(currentAppt.date).format('YYYY-MM-DD');
        if (formatedDate === currentDate && get(currentAppt.employee, 'id', -1) === get(employee, 'id', -2)) {
          const currentStartTime = moment(currentAppt.fromTime, 'HH:mm');
          const currentEndTime = moment(currentAppt.toTime, 'HH:mm');
          if (apptFromTimeMoment.isSameOrAfter(currentStartTime)
          && apptFromTimeMoment.isBefore(currentEndTime)) {
            numberOfOverlaps += 1;
          }
        }
      }
    }
    const gap = numberOfOverlaps * 8;
    // calculate left position
    const firstCellWidth = selectedFilter === 'providers' ? 130 : 0;
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
        if (isAllProviderView) {
          index = headerData.findIndex(provider => provider.id === employee.id);
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
      const firstBlockDuration = apptAfterTimeMoment.diff(dateTime12, 'm')
      height = ((firstBlockDuration / step) * 30) - 1;
      top = (apptFromTimeMoment.diff(startTimeMoment, 'm') / step) * 30;
      verticalPositions.push({ height, top });
      const gapMinutes = apptGapTimeMoment.diff(dateTime12, 'm');
      const newFromtTime = apptFromTimeMoment.clone().add(firstBlockDuration + gapMinutes, 'm')
      top = (newFromtTime.diff(startTimeMoment, 'm') / step) * 30;
      height = ((apptToTimeMoment.diff(newFromtTime, 'minutes') / step) * 30) - 1;
      verticalPositions.push({ height, top });
    } else {
      height = ((apptToTimeMoment.diff(apptFromTimeMoment, 'minutes') / step) * 30) - 1;
      top = (apptFromTimeMoment.diff(startTimeMoment, 'minutes') / step) * 30;
      verticalPositions.push({ height, top });
    }
    // calculate zIndex
    const zIndex = numberOfOverlaps + 1;
    // opacity
    const opacity = !isActive && !isInBuffer ? 1 : 0.7;
    // is emplyee active in cell time
    let isActiveEmployeeInCellTime = false;
    const scheduledIntervals = provider.isOff ? [] : get(provider, 'scheduledIntervals', []);
    let providerSchedule = null;
    let providerStartTime = null;
    let providerEndTime = null;
    for (let i = 0; !isActiveEmployeeInCellTime && i < scheduledIntervals.length; i += 1) {
      providerSchedule = scheduledIntervals[i];
      providerStartTime = moment(providerSchedule.start, 'HH:mm');
      providerEndTime = moment(providerSchedule.end, 'HH:mm');
      isActiveEmployeeInCellTime = apptFromTimeMoment.diff(providerStartTime, 'm') >= 0 &&
        apptToTimeMoment.diff(providerEndTime, 'm') <= 0;
    }
    return {
      //pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top,
      width,
      zIndex,
      verticalPositions,
      opacity,
      isActiveEmployeeInCellTime,
    };
  }

  // calcualteStateValues = (props) => {
  //   const {
  //     toTime, fromTime, employee, date,
  //   } = props.appointment;
  //   const { step } = props.apptGridSettings;
  //   const {
  //     startTime, cellWidth, displayMode, selectedProvider, groupedProviders, providerSchedule,
  //   } = props;
  //   const apptDate = moment(date).format('YYYY-MM-DD');
  //   const provider = selectedProvider === 'all' ? groupedProviders[employee.id] ? groupedProviders[employee.id][0] : null : providerSchedule[apptDate] ? providerSchedule[apptDate][0] : null;
  //   const start = moment(fromTime, 'HH:mm');
  //   const top = (start.diff(startTime, 'minutes') / step) * 30;
  //   const end = moment(toTime, 'HH:mm');
  //   const { left, cardWidth, zIndex } = this.calculateLeftAndGap(props);
  //   const height = ((end.diff(start, 'minutes') / step) * 30) - 1;
  //   const usedBlocks = (height + 1) / 30;
  //   let isActiveEmployeeInCellTime = false;
  //   if (provider &&
  //     provider.scheduledIntervals && provider.scheduledIntervals[0]) {
  //     const employeeTime = provider.scheduledIntervals[0];
  //     const employeeStartTime = moment(employeeTime.start, 'HH:mm');
  //     const employeeEndTime = moment(employeeTime.end, 'HH:mm');
  //     isActiveEmployeeInCellTime = start.diff(employeeStartTime, 'm') >= 0 &&
  //       end.diff(employeeEndTime, 'm') <= 0;
  //   }
  //   const opacity = !props.isActive && !props.isInBuffer ? 1 : 0.7;
  //   return {
  //     pan: new Animated.ValueXY({ x: left, y: top }),
  //     left,
  //     top: new Animated.Value(top),
  //     height: new Animated.Value(height),
  //     isResizeing: false,
  //     opacity,
  //     cardWidth,
  //     cardHeight: height,
  //     zIndex,
  //     step,
  //     usedBlocks,
  //     isActiveEmployeeInCellTime,
  //   };
  // }

  // calculateLeftAndGap = (props) => {
  //   const {
  //     appointments, providers, rooms, selectedFilter, pickerMode, selectedProvider, displayMode, cellWidth, appointment,
  //   } = props;
  //   const date = moment(appointment.date);
  //   const startTime = moment(appointment.fromTime, 'HH:mm');
  //   let cardWidth = cellWidth - 1;
  //   let zIndex = 1;
  //   let left = 0;
  //   switch (selectedFilter) {
  //     case 'rooms':
  //       left = providers.findIndex(room => room.id === appointment.room.id) * cellWidth;
  //       break;
  //     case 'resources':
  //       left = providers.findIndex(resource => resource.id === appointment.resource.id) * cellWidth;
  //       break;
  //     case 'deskStaff':
  //     case 'providers':
  //       if (selectedProvider === 'all') {
  //         const firstCellWidth = selectedFilter === 'providers' ? 130 : 0;
  //         left = providers.findIndex(provider => provider.id === appointment.employee.id) * cellWidth + firstCellWidth;
  //       } else if (selectedProvider !== 'all' && displayMode === 'week') {
  //         const apptDate = moment(appointment.date).format('YYYY-DD-MM');
  //         left = providers.findIndex(date => date.format('YYYY-DD-MM') === apptDate) * cellWidth;
  //       }
  //       break;
  //     default:
  //       left = 0;
  //       break;
  //   }
  //   for (let i = 0; i < appointments.length; i += 1) {
  //     const currentAppt = appointments[i];
  //     const currentDate = moment(currentAppt.date);
  //     if (date.format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD')
  //   && get(currentAppt.employee, 'id', false) === get(appointment.employee, 'id', false)) {
  //       if (currentAppt.id !== appointment.id) {
  //         const currentStartTime = moment(currentAppt.fromTime, 'HH:mm');
  //         const currentEndTime = moment(currentAppt.toTime, 'HH:mm');
  //         if (startTime.isSameOrAfter(currentStartTime)
  //         && startTime.isBefore(currentEndTime)) {
  //           cardWidth -= 8;
  //           zIndex += 1;
  //           left += 8;
  //         }
  //       } else {
  //         return { cardWidth, zIndex, left };
  //       }
  //     }
  //   }
  //   return { cardWidth, zIndex, left };
  // }

  handleOnLongPress = ({ verticalPositions, left }) => {
    // this.props.onDrag(
    //   false, this.props.appointment, this.state.left - this.props.calendarOffset.x,
    //   this.state.top._value - this.props.calendarOffset.y, this.state.cardWidth, this.state.height._value,
    // );
    if (!this.props.isActive) {
      this.state.pan.setOffset({ x: left, y: verticalPositions[0].top });
      if (verticalPositions.length > 1) {
        this.state.pan2.setOffset({ x: left, y: verticalPositions[1].top });
      }
      this.props.onDrag(
        false, this.props.appointment, 0,
        0, 0, 0,
      );
    }
  }

  renderAssistant = () => {
    const {
      cardHeight,
    } = this.state;
    return (
      <View
        key={Math.random()}
        style={{
          position: 'absolute',
          top: 6,
          right: 4,
          width: 15,
          height: cardHeight - 10,
          backgroundColor: 'rgba(47, 49, 66, 0.3)',
          borderRadius: 2,
          zIndex: 99,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Text
          style={{
            fontSize: 10,
            lineHeight: 10,
            minHeight: 10,
            width: cardHeight,
            textAlign: 'center',
            margin: 0,
            padding: 0,
            color: 'white',
            transform: [{ rotate: '-90deg' }],
          }}
          numberOfLines={1}
        >Assistant Assigned
        </Text>
      </View>
    );
  }

  renderBadges = () => {
    const { appointment } = this.props;
    const { badgeData } = appointment;
    const users = appointment.isMultipleProviders ? <Icon color="#082E66" size={16} name="users" type="solid" /> : null;
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
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  renderSingleBlock = () => {
    const {
      client,
      service,
      mainServiceColor,
    } = this.props.appointment;
    const { usedBlocks } = this.state;
    const clientName = `${client.name} ${client.lastName}`;
    const serviceName = service.description;
    const serviceTextColor = '#1D1E29';
    const clientTextColor = '#2F3142';
    const color = colors[mainServiceColor] ? mainServiceColor : 0;
    const flexWrap = this.state.height._value > 30 ? { flexWrap: 'wrap' } : { ellipsizeMode: 'tail'};
    return (
      <View style={{ minHeight: 28, width: '100%', height: '100%' }}>
        <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 2 }}>
          {this.renderBadges()}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                numberOfLines={this.state.height._value > 30 ? 0 : 1}
                style={[styles.clientText, { flex: 1, color: clientTextColor }, flexWrap]}
              >
                {clientName}
              </Text>
            </View>
            { usedBlocks > 1 && (
              <Text
                numberOfLines={1}
                style={[styles.serviceText, { color: serviceTextColor }]}
              >
                {serviceName}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  renderMultiBlock = () => {
    const {
      client,
      mainServiceColor,
    } = this.props.appointment;
    const {
      step,
      usedBlocks,
    } = this.state;
    const clientName = `${client.name} ${client.lastName}`;
    const clientTextColor = '#2F3142';
    const color = colors[mainServiceColor] ? mainServiceColor : 0;

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 2 }}>
          {this.renderBadges()}
          <View>
            {times(usedBlocks).map(index => (
              <Text
                numberOfLines={1}
                style={[styles.clientText, { lineHeight: 30, color: clientTextColor }]}
              >
                {clientName}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  }

  renderStripes = ({ height, width, contentColor }) => {
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
                return (<Stop key={`${index}${width}`} offset={`${index + gap}%`} stopColor={contentColor} stopOpacity="0.4" />);
              }
              countOpacity2 += 1;
                return (<Stop key={`${index}${width}`} offset={`${index + gap}%`} stopColor={contentColor} />);
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
      } = this.props.appointment;
    const {
      showFirstAvailable,
      showAssistant,
      isActive,
      isInBuffer
    } = this.props;
    const color = colors[mainServiceColor] ? mainServiceColor : 0;
    const borderColor = colors[color].dark;
    const contentColor = colors[color].light;
    const clientName = `${client.name} ${client.lastName}`;
    const clientTextColor = '#2F3142';
    const borderStyle = showFirstAvailable && isFirstAvailable ? 'dashed' : 'solid';
    const serviceTextColor = '#1D1E29';
    const position = isActive ? this.state.pan.getLayout() : '';
    const position2 = isActive ? this.state.pan2.getLayout() : '';
    return (
      <React.Fragment>
        {
            verticalPositions.map(({ height, top }, index) => (
              <Animated.View
                {...this.panResponder.panHandlers}
                style={[styles.container,
                  {
                width,
                height,
                borderColor,
                backgroundColor: colors[color].light,
                left,
                top,
                opacity,
                borderStyle,
              }, index === 0 ? position : position2]}

              >
                {!isActiveEmployeeInCellTime ?
                  this.renderStrippes({ height, width, contentColor }) : null}
                <TouchableOpacity
                  onPress={() => {
                    //this.props.onPress(this.props.appointment)
                  }}
                  onLongPress={() => this.handleOnLongPress({ left, verticalPositions })}
                  disabled={isActive || isInBuffer}
                >
                  <View style={{ width: '100%', height: '100%' }}>
                    <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
                    <View style={{ flexDirection: 'row', paddingHorizontal: 2 }}>
                      {this.renderBadges()}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            numberOfLines={height > 30 ? 0 : 1}
                            style={[styles.clientText, { flex: 1, color: clientTextColor }, { flexWrap: 'wrap' }]}
                          >
                            {clientName}
                          </Text>
                        </View>
                        { height > 30 && (
                          <Text
                            numberOfLines={1}
                            style={[styles.serviceText, { color: serviceTextColor }]}
                          >
                            {service.description}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
        }
      </React.Fragment>
    );
  }

  // render() {
  //   this.state = this.calcualteStateValues(this.props);
  //   const {
  //     client,
  //     service,
  //     fromTime,
  //     toTime,
  //     id,
  //     mainServiceColor,
  //     isFirstAvailable,
  //   } = this.props.appointment;
  //   const { showFirstAvailable, showAssistant, isActive, isInBuffer } = this.props;
  //   const {
  //     zIndex, cardWidth, left, isActiveEmployeeInCellTime,
  //   } = this.state;
  //   const color = colors[mainServiceColor] ? mainServiceColor : 0;
  //   const { height } = this.state;
  //   const borderColor = colors[color].dark;
  //   const contentColor = colors[color].light;
  //   let countOpacity2 = 0;
  //   let countGap2 = 0;
  //   const borderStyle = showFirstAvailable && isFirstAvailable ? 'dashed' : 'solid';
  //   const opacity = isActive && this.props.isResizeing ? 0 : 1;
  //   return (
  //     <Animated.View key={id} style={{ position: 'absolute', zIndex, opacity }}>
  //       <Animated.View
  //         style={[styles.container,
  //           {
  //         width: cardWidth,
  //         height,
  //         borderColor,
  //         backgroundColor: colors[color].light,
  //         left,
  //         top: this.state.top,
  //         opacity: this.state.opacity,
  //         borderStyle,
  //         }]}
  //
  //       >
  //         {!isActiveEmployeeInCellTime ?
  //           <Svg
  //             height={height._value - 2}
  //             width={cardWidth - 2}
  //             style={styles.stripesContainer}
  //           >
  //             <Defs>
  //               <LinearGradient
  //                 id="grad"
  //                 x1={0}
  //                 y1={cardWidth > height._value ? cardWidth : height._value}
  //                 x2={cardWidth > height._value ? cardWidth : height._value}
  //                 y2={0}
  //               >
  //                 {
  //                  times(50).map((index) => {
  //                   const gap = countGap2;
  //                   countGap2 = index % 2 === 0 ? countGap2 + 2 : countGap2;
  //                   if (countOpacity2 > 0 && countOpacity2 % 2 === 0) {
  //                     countOpacity2 = index % 2 === 0 ? countOpacity2 : 0;
  //                     return (<Stop key={`${index}${cardWidth}`} offset={`${index + gap}%`} stopColor={contentColor} stopOpacity="0.4" />);
  //                   }
  //                   countOpacity2 += 1;
  //                     return (<Stop key={`${index}${cardWidth}`} offset={`${index + gap}%`} stopColor={contentColor} />);
  //                 })
  //                 }
  //               </LinearGradient>
  //             </Defs>
  //             <Rect
  //               width={cardWidth}
  //               height={height._value}
  //               fill="url(#grad)"
  //               strokeLinecap="round"
  //             />
  //           </Svg>
  //           : null
  //         }
  //         <TouchableOpacity
  //           onPress={() => {
  //             this.props.onPress(this.props.appointment)
  //           }}
  //           onLongPress={this.handleOnLongPress}
  //           disabled={isActive || isInBuffer}
  //         >
  //           {this.props.isMultiBlock ? this.renderMultiBlock() : this.renderSingleBlock()}
  //           { showAssistant ? this.renderAssistant() : null }
  //         </TouchableOpacity>
  //       </Animated.View>
  //     </Animated.View>
  //   );
  // }
}

export default Card;
