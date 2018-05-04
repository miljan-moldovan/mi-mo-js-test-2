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
    this.state = this.calcualteStateValues(props);
    // this.state.pan.x.addListener((value) => this.animatedValueX = value.value);
    // this.state.pan.y.addListener((value) => this.animatedValueY = value.value);
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.isActive && !this.state.isResizeing,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.isActive && !this.state.isResizeing,
      onPanResponderMove: (e, gesture) => {
        this.moveX = gesture.dx;
        this.moveY = gesture.dy;
        return Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gesture);
      },
      onPanResponderGrant: () => {
        if (this.state.isActive) {
          this.state.pan.setOffset({ x: this.state.left, y: this.state.top._value });
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },
      onPanResponderRelease: (e, gesture) => {
        switch (this.props.displayMode) {
          case 'all':
            this.handleReleaseAll();
            break;
          case 'day':
            this.handleReleaseDay();
            break;
          case 'week':
            this.handleReleaseWeek();
            break;
          default:
            break;
        }
      },
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { calendarOffset } = this.props;
    const newX = nextProps.calendarOffset.x;
    const newY = nextProps.calendarOffset.y;
    return (newX === calendarOffset.x && newY === calendarOffset.y)
    || (nextState.isActive || this.state.isActive) || (nextProps.showFirstAvailable !== this.props.showFirstAvailable) //|| nextProps.displayMode !== this.props.displayMode;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.cellWidth !== this.props.cellWidth || (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading)) {
      this.setState(this.calcualteStateValues(nextProps));
    }
  }

  calcualteStateValues = (props) => {
    const { toTime, fromTime, employee, date } = props.appointment;
    const { step } = props.apptGridSettings;
    const { startTime, cellWidth, displayMode, selectedProvider, groupedProviders, providerSchedule } = props;
    const apptDate = moment(date).format('YYYY-MM-DD');
    const provider = displayMode === 'all' ? groupedProviders[employee.id] ? groupedProviders[employee.id][0] : null : providerSchedule[apptDate] ? providerSchedule[apptDate][0] : null;
    const start = moment(fromTime, 'HH:mm');
    const top = (start.diff(startTime, 'minutes') / step) * 30;
    const end = moment(toTime, 'HH:mm');
    const { left, cardWidth, zIndex } = this.calculateLeftAndGap(props);
    const height = ((end.diff(start, 'minutes') / step) * 30) - 1;
    let isActiveEmployeeInCellTime = false;
    if (provider &&
      provider.scheduledIntervals && provider.scheduledIntervals[0]) {
      const employeeTime = provider.scheduledIntervals[0];
      const employeeStartTime = moment(employeeTime.start, 'HH:mm');
      const employeeEndTime = moment(employeeTime.end, 'HH:mm');
      isActiveEmployeeInCellTime = start.diff(employeeStartTime, 'm') >= 0 &&
        end.diff(employeeEndTime, 'm') <= 0;
    }
    return {
      pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top: new Animated.Value(top),
      height: new Animated.Value(height),
      isActive: false,
      isResizeing: false,
      opacity: new Animated.Value(0),
      cardWidth,
      zIndex,
      isActiveEmployeeInCellTime,
    };
  }

  handleReleaseAll = () => {
    this.moveX = null;
    this.moveY = null;
    const { pan, left, top } = this.state;
    const { cellWidth, providers, appointment, onDrop, apptGridSettings } = this.props;
    const { toTime, fromTime } = appointment;
    const availabilityOffset = pan.x._value + pan.x._offset < left ? 64 : 0
    const dx = pan.x._value + pan.x._offset - left - availabilityOffset;
    const remainderX = dx % cellWidth;
    const xOffset = cellWidth - remainderX > cellWidth / 2 ? dx - remainderX : dx + cellWidth - remainderX;
    const providerIndex = Math.round(Math.abs((xOffset + left) - 64) / cellWidth);
    const provider = providers[providerIndex];
    // calculate new coordinates x
    const x = ((providerIndex * cellWidth) + 64) - this.state.pan.x._offset;

    const dy = pan.y._value + pan.y._offset - top._value;
    const remainderY = dy % 30;
    const yOffset = 30 - remainderY > 30 / 2 ? dy - remainderY : dy + 30 - remainderY;
    const newFromTime = moment(fromTime, 'HH:mm').add((yOffset / 30) * apptGridSettings.step, 'minutes').format('HH:mm');
    // calculate new coordinates y
    const y = 30 - remainderY > 30 / 2 ? pan.y._value - remainderY : pan.y._value + 30 - remainderY;
    onDrop(appointment.id,{
      date: appointment.date,
      newTime: newFromTime,
      employeeId: provider.id,
    });
    Animated.parallel([
      Animated.spring(
        this.state.pan,
        { toValue: { x, y } }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0
        }
      )
    ]).start(() => this.setState({
      isActive: false,
      left: providerIndex * cellWidth + 64 ,
      top: new Animated.Value(top._value + yOffset)
    },
    () => {
      this.props.onDrag(true);
    }));
  }

  handleReleaseDay = () => {
    this.moveX = null;
    this.moveY = null;
    const { pan, top } = this.state;
    const { selectedProvider, appointment, onDrop, apptGridSettings } = this.props;
    const { toTime, fromTime } = appointment;
    const dy = pan.y._value + pan.y._offset - top._value;
    const remainderY = dy % 30;
    const yOffset = 30 - remainderY > 30 / 2 ? dy - remainderY : dy + 30 - remainderY;
    const newFromTime = moment(fromTime, 'HH:mm').add((yOffset / 30) * apptGridSettings.step, 'minutes').format('HH:mm');
    // calculate new coordinates y
    const y = 30 - remainderY > 30 / 2 ?
      this.state.pan.y._value - remainderY : this.state.pan.y._value + 30 - remainderY;
    onDrop(appointment.id,{
      date: appointment.date,
      newTime: newFromTime,
      employeeId: selectedProvider.id,
    });
    Animated.parallel([
      Animated.spring(
        this.state.pan,
        { toValue: { x: 0, y } }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0
        }
      )
    ]).start(() => this.setState({
      isActive: false,
      left: 0,
      top: new Animated.Value(top._value + yOffset)
    },
    () => {
      this.props.onDrag(true);
    }));
  }

  handleReleaseWeek = () => {
    this.moveX = null;
    this.moveY = null;
    const { pan, left, top } = this.state;
    const { cellWidth, providers, appointment, onDrop, apptGridSettings, selectedProvider } = this.props;
    const { toTime, fromTime } = appointment;
    const dx = pan.x._value + pan.x._offset - left;
    const remainderX = dx % cellWidth;
    const xOffset = cellWidth - remainderX > cellWidth / 2 ? dx - remainderX : dx + cellWidth - remainderX;
    let dateIndex = Math.round(Math.abs((xOffset + left)) / cellWidth);
    dateIndex = dateIndex >= providers.length ? providers.length - 1 : dateIndex < 0 ? 0 : dateIndex;
    const date = providers[dateIndex];
    // calculate new coordinates x
    const x = (dateIndex * cellWidth) - this.state.pan.x._offset;

    const dy = pan.y._value + pan.y._offset - top._value;
    const remainderY = dy % 30;
    const yOffset = 30 - remainderY > 30 / 2 ? dy - remainderY : dy + 30 - remainderY;
    const newFromTime = moment(fromTime, 'HH:mm').add((yOffset / 30) * apptGridSettings.step, 'minutes').format('HH:mm');
    // calculate new coordinates y
    const y = 30 - remainderY > 30 / 2 ? pan.y._value - remainderY : pan.y._value + 30 - remainderY;
    onDrop(appointment.id,{
      date: date.format('YYYY-MM-DD').toString(),
      newTime: newFromTime,
      employeeId: selectedProvider.id,
    });
    Animated.parallel([
      Animated.spring(
        this.state.pan,
        { toValue: { x, y } }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0
        }
      )
    ]).start(() => this.setState({
      isActive: false,
      left: dateIndex * cellWidth,
      top: new Animated.Value(top._value + yOffset)
    },
    () => {
      this.props.onDrag(true);
    }));
  }

  calculateLeftAndGap = (props) => {
    const { appointments, providers, displayMode, cellWidth, appointment } = props;
    const date = moment(appointment.date)
    const startTime = moment(appointment.fromTime, 'HH:mm');
    let cardWidth = cellWidth - 1;
    let zIndex = 1;
    let left = 0;
    switch (displayMode) {
      case 'all':
        left = providers.findIndex(provider => provider.id
        === appointment.employee.id) * cellWidth + 64;
        break;
      case 'week': {
        const apptDate = moment(appointment.date).format('YYYY-DD-MM');
        left = providers.findIndex(date => date.format('YYYY-DD-MM') === apptDate) * cellWidth;
        break;
      }
      default:
        left = 0;
        break;
    }
    for (let i = 0; i < appointments.length; i += 1) {
      const currentAppt = appointments[i];
      const currentDate = moment(currentAppt.date);
      if (date.format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD')
    && currentAppt.employee.id === appointment.employee.id) {
        if (currentAppt.id !== appointment.id) {
          const currentStartTime = moment(currentAppt.fromTime, 'HH:mm');
          const currentEndTime = moment(currentAppt.toTime, 'HH:mm');
          if (startTime.isSameOrAfter(currentStartTime)
          && startTime.isBefore(currentEndTime)) {
            cardWidth -= 8;
            zIndex += 1;
            left += 8;
          }
        } else {
          return { cardWidth, zIndex, left };
        }
      }
    }
    return { cardWidth, zIndex, left };
  }

  handleOnLongPress = () => {
    this.setState({ isActive: true }, this.scrollAnimation);
    this.offset = { x: this.props.calendarOffset.x, y: this.props.calendarOffset.y }
    this.props.onDrag(false);
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0.7
      }
    ).start();
  }

  scrollAnimation = () => {
    const { cellWidth, displayMode } = this.props;
    let dx = 0;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    if (this.state.isActive) {
      if (this.moveX && this.moveY) {
        if (displayMode === 'all') {
          if (Math.abs(this.moveX/this.props.calendarMeasure.width) >= Math.abs(this.moveY/this.props.calendarMeasure.height)) {
            const maxWidth = this.props.providers.length * cellWidth - this.props.calendarMeasure.width;
            const scrollHorizontalBoundRight = (this.props.calendarMeasure.width
              + this.offset.x) - boundLength - cellWidth;
            const scrollHorizontalBoundLeft = this.offset.x + boundLength;
            const moveX = this.moveX + this.state.pan.x._offset;
            if (scrollHorizontalBoundRight < moveX) {
              dx = moveX - scrollHorizontalBoundRight;
            } else if (scrollHorizontalBoundLeft > moveX) {
              dx = moveX - scrollHorizontalBoundLeft;
            }
            if (Math.abs(dx) > 0) {
              dx = Math.abs(dx) > boundLength ? boundLength * Math.sign(dx) : dx;
              dx = dx * maxScrollChange / boundLength;
              this.offset.x += dx;
              if (this.offset.x > maxWidth) {
                this.offset.x =  maxWidth;
              }
              if (this.offset.x < 0) {
                this.offset.x = 0;
              }
              const cordiantesX = this.state.pan.x._offset + this.state.pan.x._value + dx;
              if (cordiantesX + cellWidth > maxWidth + this.props.calendarMeasure.width) {
                dx = maxWidth + this.props.calendarMeasure.width
                - this.state.pan.x._offset - this.state.pan.x._value - cellWidth;
              }
              if (cordiantesX < 0) {
                dx = 0;
              }
              this.props.onScrollX(this.offset.x, () => {
                this.state.pan.setOffset({
                  x: this.state.pan.x._offset + dx,
                  y: this.state.pan.y._offset,
                });
                this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value });
              });
            }
          } else {
            const maxHeigth = this.props.apptGridSettings.numOfRow * 30 - this.props.calendarMeasure.height;
            const scrollVerticalBoundTop = (this.props.calendarMeasure.height
              + this.offset.y) - boundLength - this.state.height._value;
            const scrollVerticalBoundBottom = this.offset.y + boundLength;
            const moveY = this.moveY + this.state.pan.y._offset;
            if (scrollVerticalBoundTop < moveY) {
              dy = moveY - scrollVerticalBoundTop;
            } else if (scrollVerticalBoundBottom > moveY) {
              dy = moveY - scrollVerticalBoundBottom;
            }
            if (Math.abs(dy) > 0) {
              dy = Math.abs(dy) > boundLength ? boundLength * Math.sign(dy) : dy;
              dy = dy * maxScrollChange / boundLength;
              this.offset.y += dy;
              if (this.offset.y > maxHeigth) {
                this.offset.y = maxHeigth;
              }
              if (this.offset.y < 0) {
                this.offset.y = 0;
              }
              const cordiantesY = this.state.pan.y._offset + this.state.pan.y._value + dy;
              if (cordiantesY + this.state.height._value > maxHeigth + this.props.calendarMeasure.height) {
                dy = maxHeigth + this.props.calendarMeasure.height
                - this.state.pan.y._offset - this.state.pan.y._value - this.state.height._value;
              }
              if (cordiantesY < 0) {
                dy = 0;
              }
              this.props.onScrollY(this.offset.y, () => {
                this.state.pan.setOffset({
                  x: this.state.pan.x._offset,
                  y: this.state.pan.y._offset + dy,
                });
                this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value });
              });
            }
          }
        } else {
          const maxHeigth = this.props.apptGridSettings.numOfRow * 30 - this.props.calendarMeasure.height;
          const scrollVerticalBoundTop = (this.props.calendarMeasure.height
            + this.offset.y) - boundLength - this.state.height._value;
          const scrollVerticalBoundBottom = this.offset.y + boundLength;
          const moveY = this.moveY + this.state.pan.y._offset;
          if (scrollVerticalBoundTop < moveY) {
            dy = moveY - scrollVerticalBoundTop;
          } else if (scrollVerticalBoundBottom > moveY) {
            dy = moveY - scrollVerticalBoundBottom;
          }
          if (Math.abs(dy) > 0) {
            dy = Math.abs(dy) > boundLength ? boundLength * Math.sign(dy) : dy;
            dy = dy * maxScrollChange / boundLength;
            this.offset.y += dy;
            if (this.offset.y > maxHeigth) {
              this.offset.y = maxHeigth;
            }
            if (this.offset.y < 0) {
              this.offset.y = 0;
            }
            const cordiantesY = this.state.pan.y._offset + this.state.pan.y._value + dy;
            if (cordiantesY + this.state.height._value > maxHeigth + this.props.calendarMeasure.height) {
              dy = maxHeigth + this.props.calendarMeasure.height
              - this.state.pan.y._offset - this.state.pan.y._value - this.state.height._value;
            }
            if (cordiantesY < 0) {
              dy = 0;
            }
            this.props.onScrollY(this.offset.y, () => {
              this.state.pan.setOffset({
                x: this.state.pan.x._offset,
                y: this.state.pan.y._offset + dy,
              });
              this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value });
            });
          }
        }
      }
      requestAnimationFrame(this.scrollAnimation);
    }
  }

  resizeTop = (size) => {
    const { height } = this.state;
    if (height._value - size >= 30) {
      this.setState({ height: new Animated.Value(height._value - size), top: new Animated.Value(this.state.top._value + size) });
      this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value + size });
    }
  }

  resizeBottom = (size) => {
    const { height } = this.state;
    if (height._value + size >= 30) {
      this.setState({ height: new Animated.Value(height._value + size) });
    }
  }

  handleResizeReleaseTop = () => {
    const { height, top, pan } = this.state;
    const remainderH = height._value % 30;
    const remainderT = top._value % 30;
    const newSize = remainderH < 30 / 2 ? height._value - remainderH : height._value + 30 - remainderH;
    const newTop = remainderH < 30 / 2 ? top._value + remainderH : top._value - 30 + remainderH;
    Animated.parallel([Animated.spring(this.state.height, { toValue: newSize }),
    Animated.spring(this.state.top, { toValue: newTop }),
    Animated.spring(
      this.state.pan,
      { toValue: { x: pan.x._value, y: newTop - pan.y._offset } }
    )]).start(() => {
      this.setState({ isResizeing: false });
      this.props.onResize(this.props.appointment.id,{
        newLength: (this.state.height._value / 30) * this.props.apptGridSettings.step,
      });
    });
  }

  handleResizeReleaseBottom = () => {
    const { height } = this.state;
    const remainder = this.state.height._value % 30;
    const newSize = remainder < 30 / 2 ? height._value - remainder : height._value + 30 - remainder;
    Animated.spring(this.state.height, { toValue: newSize }).start(() => {
      this.setState({ isResizeing: false });
      this.props.onResize(this.props.appointment.id,{
        newLength: (this.state.height._value / 30) * this.props.apptGridSettings.step,
      });
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
    const { showFirstAvailable } = this.props;
    const { zIndex, cardWidth, left, isActive,isActiveEmployeeInCellTime } = this.state;
    const color = colors[mainServiceColor] ? mainServiceColor : 0;
    const clientName = `${client.name} ${client.lastName}`;
    const serviceName = service.description;
    const { height } = this.state;
    const backgroundColor = isActiveEmployeeInCellTime ? colors[color].light : 'black';
    const borderColor = colors[color].dark;
    const contentColor = isActive ? colors[color].dark : colors[color].light;
    const serviceTextColor = isActive ? '#fff' : '#1D1E29';
    const clientTextColor = isActive ? '#fff' : '#2F3142';
    let countOpacity = 0;
    let countGap = 0;
    let countOpacity2 = 0;
    let countGap2 = 0;
    const shadow = this.state.isActive ? {
      shadowColor: '#3C4A5A',
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    } : null;
    const borderStyle = showFirstAvailable && isFirstAvailable ? 'dashed' : 'solid';
    return (
      <Animated.View style={isActive ? { position: 'absolute', zIndex: 9999 } : { position: 'absolute', zIndex }}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[styles.container,
            { width: cardWidth, height, borderColor, backgroundColor: colors[color].light,
            left, top: this.state.top, opacity: this.state.opacity, borderStyle }]}

        >
          {!isActiveEmployeeInCellTime ?
            <Svg
              height={height._value - 2}
              width={cardWidth - 2}
              style={styles.stripesContainer}
            >
              <Defs>
                <LinearGradient id="grad" x1={0} y1={cardWidth > height._value ?  cardWidth : height._value}
                  x2={cardWidth > height._value ?  cardWidth : height._value}
                  y2={0}
                >
                  {
                   times(50).map((index) => {
                    const gap = countGap2;
                    countGap2 = index % 2 === 0 ? countGap2 + 2 : countGap2;
                    if (countOpacity2 > 0 && countOpacity2 % 2 === 0) {
                      countOpacity2 = index % 2 === 0 ? countOpacity2 : 0;
                      return (<Stop key={`${index}${cardWidth}`} offset={`${index + gap}%`} stopColor={contentColor} stopOpacity="0.4" />)
                    }
                    countOpacity2 += 1;
                      return (<Stop key={`${index}${cardWidth}`} offset={`${index + gap}%`} stopColor={contentColor} />)
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
            : null
          }
          <View style={[styles.header, { backgroundColor: colors[color].dark }]} />
          <Text numberOfLines={1} style={styles.clientText}>{clientName}</Text>
          <Text numberOfLines={1} style={styles.serviceText}>{serviceName}</Text>
        </Animated.View>
        <Animated.View
          {...this.panResponder.panHandlers}
          key={id}
          style={[styles.container,
            { width: cardWidth, height, borderColor, backgroundColor: contentColor, borderStyle: isActive ? 'solid' : borderStyle },
            this.state.pan.getLayout(), shadow,]}
        >
          {!isActiveEmployeeInCellTime && !isActive ?
            <Svg
              height={height._value - 2}
              width={cardWidth - 2}
              style={styles.stripesContainer}
            >
              <Defs>
                <LinearGradient id="grad" x1={0} y1={cardWidth > height._value ?  cardWidth : height._value}
                  x2={cardWidth > height._value ?  cardWidth : height._value}
                  y2={0}
                >
                  {
                   times(50).map((index) => {
                    const gap = countGap;
                    countGap = index % 2 === 0 ? countGap + 2 : countGap;
                    if (countOpacity > 0 && countOpacity % 2 === 0) {
                      countOpacity = index % 2 === 0 ? countOpacity : 0;
                      return (<Stop key={index} offset={`${index + gap}%`} stopColor={contentColor} stopOpacity="0.4" />)
                    }
                    countOpacity += 1;
                      return (<Stop key={index} offset={`${index + gap}%`} stopColor={contentColor} />)
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
            : null
          }
          <TouchableOpacity
            onLongPress={this.handleOnLongPress}
            disabled={isActive}
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
          {isActive ?
            <ResizeButton
              onPress={() => this.setState({ isResizeing: true })}
              onRelease={this.handleResizeReleaseBottom}
              onResize={this.resizeBottom}
              color={colors[color].dark}
              position={{ left: 2, bottom: -12}}
              apptGridSettings={this.props.apptGridSettings}
              height={height._value}
              calendarMeasure={this.props.calendarMeasure}
              calendarOffset={this.props.calendarOffset}
              onScrollY={this.props.onScrollY}
              top={this.state.top._value}
            /> : null }
          {isActive ?
            <ResizeButton
              onPress={() => this.setState({ isResizeing: true })}
              onRelease={this.handleResizeReleaseTop}
              onResize={this.resizeTop}
              color={colors[color].dark}
              position={{ right: 2, top: -12 }}
              apptGridSettings={this.props.apptGridSettings}
              height={height._value}
              calendarMeasure={this.props.calendarMeasure}
              calendarOffset={this.props.calendarOffset}
              onScrollY={this.props.onScrollY}
              top={this.state.top._value}
            /> : null }
        </Animated.View>
      </Animated.View>
    );
  }
}

export default Card;
