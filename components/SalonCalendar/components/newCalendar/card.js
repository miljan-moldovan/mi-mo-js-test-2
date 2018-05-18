import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import moment from 'moment';
import Svg, {
  LinearGradient,
  Rect,
  Defs,
  Stop,
} from 'react-native-svg';
import { times } from 'lodash';

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
  }

  componentWillUpdate(nextProps) {
    if (nextProps.cellWidth !== this.props.cellWidth ||
      (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading)) {
      this.setState(this.calcualteStateValues(nextProps));
    }
    if (nextProps.isActive !== this.props.isActive) {
      if (!nextProps.isActive) {
        this.setState({ opacity: new Animated.Value(1) });
      }
    }
  }

  calcualteStateValues = (props) => {
    const {
      toTime, fromTime, employee, date,
    } = props.appointment;
    const { step } = props.apptGridSettings;
    const {
      startTime, cellWidth, displayMode, selectedProvider, groupedProviders, providerSchedule,
    } = props;
    const apptDate = moment(date).format('YYYY-MM-DD');
    const provider = displayMode === 'all' ? groupedProviders[employee.id] ? groupedProviders[employee.id][0] : null : providerSchedule[apptDate] ? providerSchedule[apptDate][0] : null;
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
    return {
      pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top: new Animated.Value(top),
      height: new Animated.Value(height),
      isResizeing: false,
      opacity: new Animated.Value(1),
      cardWidth,
      zIndex,
      step,
      usedBlocks,
      isActiveEmployeeInCellTime,
    };
  }

  calculateLeftAndGap = (props) => {
    const {
      appointments, providers, rooms, displayMode, cellWidth, appointment,
    } = props;
    const date = moment(appointment.date);
    const startTime = moment(appointment.fromTime, 'HH:mm');
    let cardWidth = cellWidth - 1;
    let zIndex = 1;
    let left = 0;
    switch (displayMode) {
      case 'rooms':
        left = providers.findIndex(room => room.id === appointment.room.id) * cellWidth;
        break;
      case 'rooms':
        left = providers.findIndex(resource => resource.id === appointment.resource.id) * cellWidth;
        break;
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
    this.props.onDrag(
      false, this.props.appointment, this.state.left - this.props.calendarOffset.x,
      this.state.top._value - this.props.calendarOffset.y, this.state.cardWidth, this.state.height._value,
    );
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0.7,
      },
    ).start();
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
        { toValue: { x: pan.x._value, y: newTop - pan.y._offset } },
      )]).start(() => {
      this.setState({ isResizeing: false });
      this.props.onResize(this.props.appointment.id, {
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
      this.props.onResize(this.props.appointment.id, {
        newLength: (this.state.height._value / 30) * this.props.apptGridSettings.step,
      });
    });
  }

  renderSingleBlock = () => {
    const {
      client,
      service,
      mainServiceColor,
    } = this.props.appointment;
    const clientName = `${client.name} ${client.lastName}`;
    const serviceName = service.description;
    const serviceTextColor = '#1D1E29';
    const clientTextColor = '#2F3142';
    const color = colors[mainServiceColor] ? mainServiceColor : 0;

    return (
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
        {times(usedBlocks).map(index => (
          <Text
            numberOfLines={1}
            style={[styles.clientText, { lineHeight: 30, color: clientTextColor }]}
          >
            {clientName}
          </Text>
        ))}
      </View>
    );
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
    const { showFirstAvailable, isActive } = this.props;
    const {
      zIndex, cardWidth, left, isActiveEmployeeInCellTime,
    } = this.state;
    const color = colors[mainServiceColor] ? mainServiceColor : 0;
    const { height } = this.state;
    const borderColor = colors[color].dark;
    const contentColor = colors[color].light;
    const countOpacity = 0;
    const countGap = 0;
    let countOpacity2 = 0;
    let countGap2 = 0;

    const borderStyle = showFirstAvailable && isFirstAvailable ? 'dashed' : 'solid';
    return (
      <Animated.View key={id} style={{ position: 'absolute', zIndex }}>
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
          borderStyle,
          }]}

        >
          {!isActiveEmployeeInCellTime ?
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
            : null
          }
          <TouchableOpacity
            onLongPress={this.handleOnLongPress}
            disabled={isActive}
          >
            {this.props.isMultiBlock ? this.renderMultiBlock() : this.renderSingleBlock()}
          </TouchableOpacity>
        </Animated.View>
        {/* <Animated.View
          // {...this.panResponder.panHandlers}
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
              position={{ left: -8, bottom: -22}}
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
              position={{ right: -8, top: -22 }}
              apptGridSettings={this.props.apptGridSettings}
              height={height._value}
              calendarMeasure={this.props.calendarMeasure}
              calendarOffset={this.props.calendarOffset}
              onScrollY={this.props.onScrollY}
              top={this.state.top._value}
            /> : null }
        </Animated.View> */}
      </Animated.View>
    );
  }
}

export default Card;
