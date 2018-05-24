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

  shouldComponentUpdate(nextProps) {
    return nextProps.isActive !== this.props.isActive
    || nextProps.cellWidth !== this.props.cellWidth ||
      !nextProps.isLoading && this.props.isLoading ||
      (this.props.isActive && nextProps.isResizeing !== this.props.isResizeing);
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
    const opacity = !props.isActive ? 1 : 0.7;
    return {
      pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top: new Animated.Value(top),
      height: new Animated.Value(height),
      isResizeing: false,
      opacity,
      cardWidth,
      zIndex,
      step,
      usedBlocks,
      isActiveEmployeeInCellTime,
    };
  }

  calculateLeftAndGap = (props) => {
    const {
      appointments, providers, rooms, selectedFilter, pickerMode, selectedProvider, displayMode, cellWidth, appointment,
    } = props;
    const date = moment(appointment.date);
    const startTime = moment(appointment.fromTime, 'HH:mm');
    let cardWidth = cellWidth - 1;
    let zIndex = 1;
    let left = 0;
    switch (selectedFilter) {
      case 'rooms':
        left = providers.findIndex(room => room.id === appointment.room.id) * cellWidth;
        break;
      case 'rooms':
        left = providers.findIndex(resource => resource.id === appointment.resource.id) * cellWidth;
        break;
      case 'providers':
        if (selectedProvider === 'all') {
          left = providers.findIndex(provider => provider.id
          === appointment.employee.id) * cellWidth + 64;
        } else if (selectedProvider !== 'all' && displayMode === 'week') {
          const apptDate = moment(appointment.date).format('YYYY-DD-MM');
          left = providers.findIndex(date => date.format('YYYY-DD-MM') === apptDate) * cellWidth;
        }
        break;
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
    //this.setState({ opacity: 0.7 })
    // Animated.timing(
    //   this.state.opacity,
    //   {
    //     toValue: 0.7,
    //   },
    // ).start();
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
    this.state = this.calcualteStateValues(this.props);
    this.state.opacity = this.props.isActive ? this.state.opacity : 1;
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
    const opacity = this.props.isActive && this.props.isResizeing ? 0 : 1;
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
      </Animated.View>
    );
  }
}

export default Card;
