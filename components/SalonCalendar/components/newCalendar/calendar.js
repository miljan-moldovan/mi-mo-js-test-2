import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';
import { get, times, groupBy, filter, reverse } from 'lodash';
import moment from 'moment';

import Board from './board';
import Header from './header';
import TimeColumn from './timeColumn';
import Card from './card';
import CurrentTime from '../currentTime';
import Buffer from '../calendarBuffer';
import SalonAlert from '../../../SalonAlert';
import BlockTime from './blockCard';
import EmptyScreen from './EmptyScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 1000,
    width: 1000,
    borderColor: '#C0C1C6',
  },
  headerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  boardContainer: {
    marginLeft: 36,
  },
  columnContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const dayWidth = screenWidth - 36;
const weekWidth = (screenWidth - 36) / 7;
const providerWidth = 130;
const headerHeight = 40;

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.offset = { x: 0, y: 0 };
    this.setCellsByColumn(props);
    this.state = {
      alert: null,
      calendarMeasure: {
        width: 0,
        height: 0,
      },
      calendarOffset: {
        x: 0,
        y: 0,
      },
      buffer: [],
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
      pan2: new Animated.ValueXY({ x: 0, y: 0 }),
      isResizeing: false,
    };
    this.size = { width: 0, height: 0 };
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.activeCard && !this.state.alert,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.activeCard && !this.state.alert,
      onPanResponderMove: (e, gesture) => {
        const { dy, dx } = gesture;
        if (this.state.activeCard) {
          if (!this.state.isResizeing) {
            this.moveX = dx;
            this.moveY = dy;
            return Animated.event([null, {
              dx: this.state.pan.x,
              dy: this.state.pan.y,
            },
            {
              dx: this.state.pan2.x,
              dy: this.state.pan2.y,
            }])(e, gesture, gesture);
          }
          const size = this.moveY ? dy - this.moveY : dy;
          this.moveY = dy;
          if (this.resizeCard) {
            const lastIndex = this.state.activeCard.verticalPositions.length - 1;
            this.state.activeCard.verticalPositions[lastIndex].height = this.resizeCard.resizeCard(size);
          }
        }
        return null;
      },
      onPanResponderRelease: (e, gesture) => {
        if (this.state.activeCard) {
          if (this.state.isResizeing) {
            this.handleResizeCard();
          } else if (this.moveX && this.moveY) {
            this.handleCardDrop();
          }
        }
      },
    });
  }

  componentWillUpdate(nextProps) {
    if ((!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading)
      || nextProps.displayMode !== this.props.displayMode) {
      this.setCellsByColumn(nextProps);
    }
    if (nextProps.displayMode !== this.props.displayMode || nextProps.selectedProvider !== this.props.selectedProvider) {
      this.state.buffer = [];
      nextProps.manageBuffer(false);
    }

    if (nextProps.isLoading) {
      this.clearActive();
    }
  }

  componentDidUpdate() {
    if (this.goToPosition && !this.props.isLoading) {
      const top = this.goToPosition.top - (this.state.calendarMeasure.height / 2);
      const left = this.goToPosition.left - (this.state.calendarMeasure.width / 2);
      this.board.scrollTo({ x: left >= 0 ? left : 0, y: top >= 0 ? top : 0, animated: true });
      this.goToPosition.highlightCard();
      this.props.clearGoToAppointment();
      this.goToPosition = null;
    }
  }

  setGoToPositon = ({ left, top, highlightCard }) => {
    this.goToPosition = {
      left,
      top,
      highlightCard,
    };
  }

  setCellsByColumn = (nextProps) => {
    const {
      apptGridSettings,
      headerData,
      selectedFilter,
      selectedProvider,
      startDate,
      displayMode,
    } = nextProps;
    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      if (selectedFilter === 'providers' || selectedFilter === 'deskStaff') {
        if (selectedProvider === 'all') {
          const firstColumnWidth = selectedFilter === 'providers' ? 166 : 36;
          this.size = {
            width: headerData.length * providerWidth + firstColumnWidth,
            height: apptGridSettings.numOfRow * 30 + headerHeight,
          };
          this.cellWidth = providerWidth;
          this.groupedProviders = groupBy(headerData, 'id');
        } else if (displayMode === 'week') {
          this.size = {
            width: headerData.length * weekWidth + 36,
            height: apptGridSettings.numOfRow * 30 + headerHeight,
          };
          this.cellWidth = weekWidth;
        } else {
          this.size = {
            width: headerData.length * dayWidth + 36,
            height: apptGridSettings.numOfRow * 30,
          };
          this.cellWidth = dayWidth;
          this.groupedProviders = groupBy(selectedProvider, 'id');
        }
      } else {
        this.size = {
          width: headerData.length * providerWidth + 36,
          height: apptGridSettings.numOfRow * 30 + headerHeight,
        };
        this.cellWidth = providerWidth;
        this.groupedProviders = groupBy(headerData, 'id');
      }
    }
  }

  createSchedule = (index, props) => {
    const { apptGridSettings } = props;
    const time = moment(apptGridSettings.minStartTime, 'HH:mm').add(index * apptGridSettings.step, 'm');
    return time.format('h:mm A').toString();
  }

  measureScrollView = ({ nativeEvent: { layout: { width, height } } }) => {
    const { calendarMeasure } = this.state;
    const newWidth = width - 36;
    const newHeight = height - 40;
    if (calendarMeasure.width === newWidth || calendarMeasure.height !== newHeight) {
      this.calendar.measureInWindow((x, y) => { this.calendarPosition = { x, y }; });
      this.setState({
        calendarMeasure: {
          height: newHeight,
          width: newWidth,
        },
      });
    }
  }

  createAlert = (alert) => {
    this.setState({ alert });
  }

  scrollAnimation = () => {
    const { cellWidth, moveX, moveY } = this;
    const {
      selectedProvider, headerData, apptGridSettings, bufferVisible, displayMode,
      isRoom, isResource
    } = this.props;
    const { calendarMeasure, pan, activeCard } = this.state;
    let dx = 0;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    const bufferHeights = this.isBufferCollapsed ? 35 : 110;
    const bufferHeight = bufferVisible ? bufferHeights : 0;
    if (activeCard) {
      if (moveX && moveY) {
        if (!this.props.bufferVisible && this.moveY > 10) {
          this.props.manageBuffer(true);
        }
        const { cardWidth } = activeCard;
        const maxWidth = headerData.length * cellWidth - calendarMeasure.width + 130;
        const scrollHorizontalBoundRight = calendarMeasure.width - boundLength - cardWidth;
        const scrollHorizontalBoundLeft = boundLength + 36;
        const newMoveX = moveX + pan.x._offset;
        if (scrollHorizontalBoundRight < newMoveX) {
          dx = newMoveX - scrollHorizontalBoundRight;
        } else if (scrollHorizontalBoundLeft > newMoveX) {
          dx = newMoveX - scrollHorizontalBoundLeft;
        }
        if (selectedProvider === 'all' && dx !== 0) {
          dx = Math.abs(dx) > boundLength ? boundLength * Math.sign(dx) : dx;
          dx = dx * maxScrollChange / boundLength;
          this.offset.x += dx;
          if (this.offset.x > maxWidth) {
            this.offset.x = maxWidth;
          }
          if (this.offset.x < 0) {
            this.offset.x = 0;
          }
          this.scrollToX(this.offset.x);
        } else {
          const headerSize = displayMode === 'week' || selectedProvider === 'all' || isRoom || isResource ? headerHeight : 0;
          const maxHeigth = apptGridSettings.numOfRow * 30 - calendarMeasure.height + bufferHeight;
          const scrollVerticalBoundTop = calendarMeasure.height - boundLength - activeCard.height - bufferHeight + headerSize;
          const scrollVerticalBoundBottom = headerHeight + boundLength;
          const newMoveY = moveY + pan.y._offset;
          const isInBufferArea = bufferVisible && newMoveY > calendarMeasure.height - bufferHeight - activeCard.height + headerSize;
          if (scrollVerticalBoundTop < newMoveY && !isInBufferArea) {
            dy = newMoveY - scrollVerticalBoundTop;
          } else if (scrollVerticalBoundBottom > newMoveY) {
            dy = newMoveY - scrollVerticalBoundBottom;
          }
          if (dy !== 0) {
            dy = Math.abs(dy) > boundLength ? boundLength * Math.sign(dy) : dy;
            dy = dy * maxScrollChange / boundLength;
            this.offset.y += dy;
            if (this.offset.y > maxHeigth) {
              this.offset.y = maxHeigth;
            }
            if (this.offset.y < 0) {
              this.offset.y = 0;
            }
            this.scrollToY(this.offset.y);
          }
        }
      }
      requestAnimationFrame(this.scrollAnimation);
    }
  }

  scrollAnimationResize = () => {
    const {
      selectedProvider, apptGridSettings, bufferVisible, displayMode,
      isRoom, isResource
    } = this.props;
    const {
      calendarMeasure, activeCard, isResizeing,
    } = this.state;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    if (isResizeing) {
      if (this.moveY) {
        const lastIndex = activeCard.verticalPositions.length - 1;
        const headerSize = displayMode === 'week' || selectedProvider === 'all' || isRoom || isResource ? headerHeight : 0;

        const coordinatesY = activeCard.verticalPositions[lastIndex].top - this.fixOffsetY;
        const maxHeigth = apptGridSettings.numOfRow * 30 - calendarMeasure.height;
        const scrollVerticalBoundTop = this.offset.y + calendarMeasure.height - boundLength;// - headerSize;
        const scrollVerticalBoundBottom = this.offset.y + boundLength;
        const newMoveY = coordinatesY + activeCard.verticalPositions[lastIndex].height;
        if (scrollVerticalBoundTop < newMoveY) {
          dy = this.offset.y < maxHeigth ? newMoveY - scrollVerticalBoundTop : 0;
        } else if (scrollVerticalBoundBottom > newMoveY) {
          dy = newMoveY - scrollVerticalBoundBottom;
        }
        if (dy !== 0) {
          dy = Math.abs(dy) > boundLength ? boundLength * Math.sign(dy) : dy;
          dy = dy * maxScrollChange / boundLength;
          this.offset.y += dy;
          if (this.offset.y > maxHeigth) {
            this.offset.y = maxHeigth;
          }
          if (this.offset.y < 0) {
            this.offset.y = 0;
          }
          this.state.activeCard.verticalPositions[lastIndex].height = this.resizeCard.resizeCard(dy);
          this.scrollToY(this.offset.y);
        }
      }
      requestAnimationFrame(this.scrollAnimationResize);
    }
  }

  handleOnDrag = (isScrollEnabled, appointment, left, cardWidth, verticalPositions, isBufferCard) => {
    let newState;
    this.moveX = null;
    this.moveY = null;
    if (!isScrollEnabled) {
      const offsetY = isBufferCard ? -this.calendarPosition.y : 40 - this.offset.y;
      const offsetX = isBufferCard ? -this.calendarPosition.x : 36 - this.offset.x;
      this.fixOffsetY = offsetY;
      const { pan, pan2 } = this.state;
      const newVerticalPositions = [];
      for (let i = 0; i < verticalPositions.length; i += 1) {
        const item = verticalPositions[i];
        const newItem = { ...item, top: item.top + offsetY };
        newVerticalPositions.push(newItem);
      }
      const newTop = newVerticalPositions[0].top;
      const newLeft = left + offsetX;
      this.state.pan.setOffset({ x: newLeft, y: newTop });
      this.state.pan.setValue({ x: 0, y: 0 });
      if (verticalPositions.length > 1) {
        let newTop = newVerticalPositions[1].top;
        this.state.pan2.setOffset({ x: newLeft, y: newTop });
        this.state.pan2.setValue({ x: 0, y: 0 });
      }
      let { height } = verticalPositions[0];
      if (verticalPositions.length > 1) {
        const reversePosition = reverse(verticalPositions);
        height = 0;
        for (let i = 0; i < reversePosition.length; i += 1) {
          const item = reversePosition[i];
          if (i === 0) {
            height = item.top + item.height;
          } else {
            height -= item.top;
          }
        }
      }
      newState = {
        activeCard: {
          appointment,
          left,
          cardWidth,
          verticalPositions: newVerticalPositions,
          isBufferCard,
          height
        },
      };
      this.setState(newState, this.scrollAnimation);
    } else {
      newState = {
        activeCard: null,
      };
      this.setState(newState);
    }
  }

  handleOnResize = () => {
    const { activeCard, isResizeing } = this.state;
    if (!isResizeing) {
      this.moveX = 0;
      this.moveY = 0;
      const newState = {
        isResizeing: true,
      };
      this.setState(newState, this.scrollAnimationResize);
    }
  }

  handleScroll = (ev) => {
    const { activeCard } = this.state;
    if (!activeCard) {
      this.offset.x = ev.nativeEvent.contentOffset.x;
      this.offset.y = ev.nativeEvent.contentOffset.y;
    }
  }

  scrollToX = (dx) => {
    this.board.scrollTo({ x: dx, y: this.offset.y, animated: false });
  }

  scrollToY = (dy) => {
    this.board.scrollTo({ y: dy, x: this.offset.x, animated: false });
  }

  handleDrop = (appointmentId, params) => {
    this.props.onDrop(appointmentId, params);
  }

  handleResizeCard = () => {
    this.moveX = null;
    this.moveY = null;
    const { apptGridSettings } = this.props;
    const { activeCard } = this.state;
    const lastIndex = activeCard.verticalPositions.length - 1;
    const { verticalPositions } = activeCard;
    const newHeight = Math.round(verticalPositions[lastIndex].height / 30);
    const params = { newLength: newHeight };

    const clientName = `${activeCard.appointment.client.name} ${activeCard.appointment.client.lastName}`;
    const date = moment(activeCard.appointment.date, 'YYYY-MM-DD').format('MMM DD');

    const fromTime = moment(activeCard.appointment.fromTime, 'HH:mm').format('h:mma');
    const oldToTime = moment(activeCard.appointment.toTime, 'HH:mm').format('h:mma');
    const newToTime = moment(activeCard.appointment.fromTime, 'HH:mm').add(newHeight * apptGridSettings.step, 'm').format('h:mma');
    const timeHasChanged = oldToTime !== newToTime;
    if (timeHasChanged) {
      const alert = {
        title: 'Resize Appointment',
        description: `Resize ${clientName} Appt. from ${date} ${fromTime}-${oldToTime} to ${date} ${fromTime}-${newToTime}?`,
        btnLeftText: 'Cancel',
        btnRightText: 'Resize',
        onPressRight: () => {
          this.props.onResize(activeCard.appointment.id, params, activeCard.appointment);
          this.hideAlert();
        },
      };
      this.createAlert(alert);
    } else {
      this.setState({
        alert: null,
        activeCard: null,
        isResizeing: false,
      });
    }
  }

  handleCardDrop = () => {
    if (this.props.bufferVisible) {
      const {
        buffer, activeCard, pan, calendarMeasure: { height },
      } = this.state;
      const { appointment } = activeCard;
      const top = pan.y._value + pan.y._offset;
      const bufferHeight = 110;
      if (top > height - bufferHeight) {
        if (!activeCard.isBufferCard && buffer.length < 4) {
          buffer.push(activeCard.appointment);
        }
        this.setState({ activeCard: null });
      } else {
        this.handleReleaseCard();
      }
    } else {
      this.handleReleaseCard();
    }
  }

  handleMove = ({ date, newTime, employeeId, appointmentId, resourceId = null, resourceOrdinal = null, roomId = null, roomOrdinal = null }) => {
    const { onDrop, appointments } = this.props;
    const { buffer } = this.state;
    const index = buffer.findIndex(appt => appt.id === appointmentId);
    let oldAppointment = null;
    if (index > -1) {
      oldAppointment = buffer[index];
      buffer.splice(index, 1);
      if (buffer.length < 1) {
        this.props.manageBuffer(false);
      }
    } else {
      oldAppointment = appointments.find(item => item.id === appointmentId);
    }
    onDrop(
      appointmentId,
      {
        date,
        newTime,
        employeeId,
        resourceId,
        resourceOrdinal,
        roomId,
        roomOrdinal,
      },
      oldAppointment,
    );
    this.handleOnDrag(true);
    this.hideAlert();
  }

  handleReleaseCard = () => {
    this.moveX = null;
    this.moveY = null;
    const cellHeight = 30;
    const { pan, activeCard: { appointment }, buffer } = this.state;
    const {
      cellWidth,
      headerData,
      apptGridSettings,
      onDrop,
      selectedProvider,
      selectedFilter,
      startDate,
      displayMode,
    } = this.props;
    const { toTime, fromTime } = appointment;
    const headerOffset = selectedProvider !== 'all' && displayMode === 'day' ? 0 : 40;
    const dx = pan.x._value + pan.x._offset + this.offset.x;
    const dy = pan.y._value + pan.y._offset + this.offset.y - headerOffset;
    const xIndex = (dx / this.cellWidth).toFixed() - 1;
    const yIndex = (dy / cellHeight).toFixed();
    const isOutOfBounds = xIndex < 0 || xIndex >= headerData.length
    || yIndex < 0 || yIndex >= apptGridSettings.schedule.length;
    if (!isOutOfBounds) {
      const employeeId = selectedFilter === 'providers' && selectedProvider === 'all' ? headerData[xIndex].id : selectedProvider.id;
      const dateMoment = selectedProvider === 'all' || displayMode === 'day' ? startDate : moment(headerData[xIndex], 'YYYY-MM-DD');
      const newTimeMoment = moment(apptGridSettings.schedule[yIndex], 'h:mm A');
      const oldDate = moment(appointment.date, 'YYYY-MM-DD').format('MMM DD');
      const oldFromTime = moment(appointment.fromTime, 'HH:mm');
      const oldToTime = moment(appointment.toTime, 'HH:mm');
      const duration = oldToTime.diff(oldFromTime, 'minutes');
      const clientName = `${appointment.client.name} ${appointment.client.lastName}`;
      const newToTime = moment(newTimeMoment).add(duration, 'm').format('h:mma');
      const newTime = newTimeMoment.format('HH:mm');
      const appointmentId = appointment.id;
      const date = dateMoment.format('YYYY-MM-DD');
      this.setState({
        alert: {
          title: 'Move Appointment',
          description: `Move ${clientName} Appt. from ${oldDate} ${oldFromTime.format('h:mma')}-${oldToTime.format('h:mma')} to ${dateMoment.format('MMM DD')} ${newTimeMoment.format('h:mma')}-${newToTime}?`,
          btnLeftText: 'Cancel',
          btnRightText: 'Move',
          onPressRight: () => this.handleMove({
            date, newTime, employeeId, appointmentId,
          }),
        },
      });
    } else {
      this.setState({ activeCard: null });
    }
  }

  hideAlert = () => {
    if (this.props.bufferVisible && this.state.buffer.length < 1) {
      this.props.manageBuffer(false);
    }
    this.setState({ alert: null, activeCard: null, isResizeing: false });
  }

  closeBuffer = () => {
    const { buffer } = this.state;
    const alert = buffer.length > 0 ? {
      title: 'Close Move Bar',
      description: 'You still have appointments in the move bar. Do you want to return all of these appointments to their original place and close the move bar?',
      btnLeftText: 'No',
      btnRightText: 'Yes',
      onPressRight: () => {
        this.props.manageBuffer(false);
        this.setState({ buffer: [], alert: null });
        this.isBufferCollapsed = false;
      },
    } : null;

    if (!alert) {
      this.props.manageBuffer(false);
      this.isBufferCollapsed = false;
      this.setState({ buffer: [] });
    } else {
      this.createAlert(alert);
    }
  }

  setBufferCollapsed= (isCollapsed) => {
    this.isBufferCollapsed = isCollapsed;
  }

  clearActive = () => {
    if (this.state.activeCard) {
      this.setState({ activeCard: null });
    }
  }

  handleCellPressed = (cell, colData) => {
    this.clearActive();
    this.props.onCellPressed(cell, colData);
  }

  handleOnPressAvailability = (startTime) => {
    this.clearActive();
    const firstAvailableProvider = {
      isFirstAvailable: true,
      id: 0,
      name: 'First',
      lastName: 'Available',
    };
    this.props.onCellPressed(startTime, firstAvailableProvider);
  }

  getOverlapingCards = (appointment) => {
    const { appointments } = this.props;
    const { id, fromTime, toTime, employee, date } = appointment;
    let currentAppt = null;
    let currentDate = null;
    let numberOfOverlaps = 0;
    const formatedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const apptFromTimeMoment = moment(fromTime, 'HH:mm');
    const apptToTimeMoment = moment(toTime, 'HH:mm');
    for (let i = 0; i < appointments.length; i += 1) {
      currentAppt = appointments[i];
      if (currentAppt.id !== id) {
        currentDate = moment(currentAppt.date).format('YYYY-MM-DD');
        if (formatedDate === currentDate && get(currentAppt.employee, 'id', -1) === get(employee, 'id', -2)) {
          const currentStartTime = moment(currentAppt.fromTime, 'HH:mm');
          const currentEndTime = moment(currentAppt.toTime, 'HH:mm');
          if(apptFromTimeMoment.isSame(currentStartTime)
          && apptToTimeMoment.isSame(currentEndTime)) {
            numberOfOverlaps += this.processedCardsIds[currentAppt.id] ? 0 : 1;
          } else if (apptFromTimeMoment.isSameOrAfter(currentStartTime)
          && apptToTimeMoment.isSameOrBefore(currentEndTime)) {
            let aux = this.processedCardsIds[currentAppt.id];
            if (aux) {
              numberOfOverlaps = aux + 1;
            } else {
              numberOfOverlaps += 1;
            }
          } else {
            if (apptFromTimeMoment.isSameOrAfter(currentStartTime)
            && apptFromTimeMoment.isBefore(currentEndTime)) {
              let aux = this.processedCardsIds[currentAppt.id];
              if (aux) {
                numberOfOverlaps = aux + 1;
              } else {
                numberOfOverlaps += 1;
              }
            }
          }
        }
      }
    }
    this.processedCardsIds[id] = numberOfOverlaps;
    return numberOfOverlaps;
  }

  renderCards = () => {
    const {
      appointments, rooms, selectedFilter,
      selectedProvider, displayMode, startDate,
    } = this.props;
    this.processedCardsIds = [];
    if (appointments) {
      const isAllProviderView = selectedFilter === 'providers' && selectedProvider === 'all';
      const isRoom = selectedFilter === 'rooms';
      const isResource = selectedFilter === 'resources';
      if (isRoom) {
        const filteredAppointments = filter(appointments, appt => appt.room !== null);
        return filteredAppointments.map(this.renderCard);
      }
      if (isResource) {
        const filteredAppointments = filter(appointments, appt => appt.resource !== null);
        return filteredAppointments.map(this.renderCard);
      }
      if (!isAllProviderView && displayMode === 'day') {
        const filteredAppointments = filter(appointments, appt => startDate.format('YYYY-MM-DD')
        === moment(appt.date).format('YYYY-MM-DD'));
        return filteredAppointments.map(this.renderCard);
      }
      return appointments.map(this.renderCard);
    }
    return null;
  }

  renderBlockTimes = () => {
    const {
      blockTimes, rooms, selectedFilter,
      selectedProvider, displayMode, startDate,
    } = this.props;
    const isAllProviderView = selectedFilter === 'providers' && selectedProvider === 'all';
    const isRoom = selectedFilter === 'rooms';
    const isResource = selectedFilter === 'resources';
    if (blockTimes) {
      if (isRoom) {
        const filteredBlocks = filter(blockTimes, block => block.room !== null);
        return filteredBlocks.map(this.renderBlock);
      }
      if (isResource) {
        const filteredBlocks = filter(blockTimes, block => block.resource !== null);
        return filteredBlocks.map(this.renderBlock);
      }
      if (!isAllProviderView && displayMode === 'day') {
        const filteredBlocks = filter(blockTimes, block => startDate.format('YYYY-MM-DD')
        === moment(block.date).format('YYYY-MM-DD'));
        return filteredBlocks.map(this.renderBlock);
      }
      return blockTimes.map(this.renderBlock);
    }
    return null;
  }

  renderBlock = (blockTime) => {
    const {
      apptGridSettings, headerData, selectedProvider, selectedFilter,
      displayMode, appointments, providerSchedule, isLoading, filterOptions,
    } = this.props;
    const {
      calendarMeasure, calendarOffset, activeBlock,
    } = this.state;
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    const isActive = activeBlock && activeBlock.blockTime.id === blockTime.id;
    if (blockTime) {
      return (
        <BlockTime
          onPress={this.props.onCardPressed}
          isResizeing={this.state.isResizeing}
          isActive={isActive}
          key={blockTime.id}
          providers={headerData}
          block={blockTime}
          apptGridSettings={apptGridSettings}
          onDrag={this.handleOnDrag}
          calendarOffset={calendarOffset}
          onDrop={this.handleDrop}
          onResize={this.handleResize}
          cellWidth={this.cellWidth}
          startTime={startTime}
          groupedProviders={this.groupedProviders}
          isLoading={isLoading}
          providerSchedule={providerSchedule}
          selectedProvider={selectedProvider}
          displayMode={displayMode}
        />
      );
    }
    return null;
  }

  renderCard = (appointment) => {
    const {
      apptGridSettings, headerData, selectedProvider, selectedFilter,
      displayMode, appointments, providerSchedule, isLoading, filterOptions, providers,
      goToAppointmentId, storeSchedule, startDate
    } = this.props;
    const {
      calendarMeasure, calendarOffset, activeCard, buffer,
    } = this.state;
    const isAllProviderView = selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = isAllProviderView ?
      providers.find(item => item.id === get(appointment.employee, 'id', false)) : selectedProvider;
    if (isAllProviderView) {
      if (!provider) {
        return null;
      }
    }
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    const isActive = activeCard && activeCard.appointment.id === appointment.id;
    const isInBuffer = buffer.findIndex(appt => appt.id === appointment.id) > -1;
    const panResponder = (activeCard &&
      activeCard.appointment.id !== appointment.id) || isInBuffer ? null : this.panResponder;
    if (appointment.employee) {
      const numberOfOverlaps = this.getOverlapingCards(appointment);
      return (
        <Card
          setGoToPositon={this.setGoToPositon}
          goToAppointmentId={goToAppointmentId}
          provider={provider}
          headerData={headerData}
          panResponder={panResponder}
          onPress={this.props.onCardPressed}
          isResizeing={this.state.isResizeing}
          isMultiBlock={filterOptions.showMultiBlock}
          showAssistant={filterOptions.showAssistantAssignments}
          isActive={isActive}
          isInBuffer={isInBuffer}
          key={appointment.id}
          providers={headerData}
          appointment={appointment}
          apptGridSettings={apptGridSettings}
          onDrag={this.handleOnDrag}
          calendarMeasure={calendarMeasure}
          onScrollX={this.scrollToX}
          onScrollY={this.scrollToY}
          calendarOffset={calendarOffset}
          onDrop={this.handleDrop}
          onResize={this.handleResize}
          cellWidth={this.cellWidth}
          selectedFilter={selectedFilter}
          displayMode={displayMode}
          selectedProvider={selectedProvider}
          startTime={startTime}
          appointments={appointments}
          groupedProviders={this.groupedProviders}
          isLoading={isLoading}
          storeSchedule={storeSchedule}
          startDate={startDate}
          numberOfOverlaps={numberOfOverlaps}
        />
      );
    }
    return null;
  }

  renderActiveCard =() => {
    const {
      apptGridSettings, headerData, selectedProvider, displayMode, appointments,
      filterOptions, startDate
    } = this.props;
    const { activeCard, calendarMeasure, isResizeing, pan, pan2 } = this.state;
    return activeCard ? (
      <Card
        pan={pan}
        pan2={pan2}
        activeCard={activeCard}
        panResponder={this.panResponder}
        appointment={activeCard.appointment}
        apptGridSettings={apptGridSettings}
        onScrollY={this.scrollToY}
        calendarMeasure={calendarMeasure}
        calendarOffset={this.offset}
        onResize={this.handleOnResize}
        cardWidth={activeCard.cardWidth}
        height={activeCard.height}
        onDrop={this.handleCardDrop}
        isActive
        opacity={isResizeing ? 0 : 1}
        isResizeing={this.state.isResizeing}
        isMultiBlock={filterOptions.showMultiBlock}
        showAssistant={filterOptions.showAssistantAssignments}
        startDate={startDate}
      />) : null;
  }

  renderResizeCard =() => {
    const {
      apptGridSettings, headerData, selectedProvider, displayMode,
      appointments, providerSchedule, filterOptions,
      providers, selectedFilter
    } = this.props;
    const { activeCard, calendarMeasure, isResizeing } = this.state;
    const isAllProviderView = selectedFilter === 'providers' && selectedProvider === 'all';
    const provider = activeCard && isAllProviderView ?
      providers.find(item => item.id === get(activeCard.appointment.employee, 'id', false)) : selectedProvider;
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    if (provider && isResizeing && activeCard) {
      const numberOfOverlaps = this.getOverlapingCards(activeCard.appointment);
    return (
      <Card
        ref={(card) => { this.resizeCard = card; }}
        numberOfOverlaps={numberOfOverlaps}
        panResponder={this.panResponder}
        appointment={activeCard.appointment}
        apptGridSettings={apptGridSettings}
        onScrollY={this.scrollToY}
        calendarMeasure={calendarMeasure}
        calendarOffset={this.offset}
        onResize={this.handleOnResize}
        cardWidth={activeCard.cardWidth}
        height={activeCard.height}
        onDrop={this.handleCardDrop}
        opacity={isResizeing ? 1 : 0}
        isActive
        isResizeing={this.state.isResizeing}
        isBufferCard={activeCard.isBufferCard}
        top={activeCard.top}
        left={activeCard.left}
        pan={this.state.pan}
        pan2={this.state.pan2}
        isResizeCard
        activeCard={activeCard}
        provider={provider}
        headerData={headerData}
        onPress={this.props.onCardPressed}
        isMultiBlock={filterOptions.showMultiBlock}
        showAssistant={filterOptions.showAssistantAssignments}
        providers={headerData}
        onDrag={this.handleOnDrag}
        cellWidth={this.cellWidth}
        selectedFilter={selectedFilter}
        displayMode={displayMode}
        selectedProvider={selectedProvider}
        startTime={startTime}
        appointments={appointments}
        groupedProviders={this.groupedProviders}
        providerSchedule={providerSchedule}
      />)
    }
      return null;
  }

  render() {
    const {
      isLoading, headerData, apptGridSettings, dataSource, selectedFilter,
      selectedProvider, displayMode, providerSchedule, availability, bufferVisible,
      isRoom, isResource, filterOptions, setSelectedProvider, setSelectedDay, storeSchedule,
      startDate, storeScheduleExceptions
    } = this.props;

    const isDate = selectedProvider !== 'all' && selectedFilter === 'providers';
    const showHeader = displayMode === 'week' || selectedProvider === 'all' || isRoom || isResource;
    const {
      alert, activeCard, isResizeing,
    } = this.state;
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    let size = {
      width: this.size.width,
      height: bufferVisible ? this.size.height + 110 : this.size.height,
    };
    const showAvailability = selectedFilter === 'providers' && selectedProvider === 'all';
    const areProviders = apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0;
    size = areProviders ? size : { width: 0, height: 0, opacity: 0 };
    return (
      <View style={{ flex: 1 }} ref={(view) => { this.calendar = view; }}>
        { !areProviders && !isLoading ? <EmptyScreen /> : null}
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, size, { borderTopWidth: !showHeader ? 1 : 0 }]}
          style={styles.container}
          scrollEnabled={!activeCard && !isLoading}
          onScroll={this.handleScroll}
          ref={(board) => { this.board = board; }}
          onLayout={this.measureScrollView}
          scrollEventThrottle={16}
        >
          <ScrollViewChild
            scrollDirection="both"
            style={[styles.boardContainer, { marginTop: showHeader ? headerHeight : 0 }]}
          >
            <Board
              createAlert={this.createAlert}
              startDate={startDate}
              onPressAvailability={this.handleOnPressAvailability}
              onCellPressed={this.handleCellPressed}
              columns={headerData}
              startTime={startTime}
              apptGridSettings={apptGridSettings}
              showAvailability={showAvailability}
              cellWidth={this.cellWidth}
              displayMode={displayMode}
              selectedProvider={selectedProvider}
              selectedFilter={selectedFilter}
              showRoomAssignments={filterOptions.showRoomAssignments}
              providerSchedule={providerSchedule}
              availability={availability}
              isLoading={isLoading}
              hideAlert={this.hideAlert}
              storeScheduleExceptions={storeScheduleExceptions}
            />
            { this.renderCards() }
            { this.renderBlockTimes() }
            {this.renderResizeCard()}
          </ScrollViewChild>
          <ScrollViewChild scrollDirection="vertical" style={[styles.columnContainer, { top: showHeader ? headerHeight : 0 }]}>
            <TimeColumn schedule={apptGridSettings.schedule} />
            <CurrentTime apptGridSettings={apptGridSettings} startTime={startTime} />
          </ScrollViewChild>
          { showHeader ?
            <ScrollViewChild scrollDirection="horizontal" style={styles.headerContainer}>
              <Header
                dataSource={headerData}
                isDate={isDate}
                selectedFilter={selectedFilter}
                cellWidth={this.cellWidth}
                setSelectedProvider={setSelectedProvider}
                setSelectedDay={setSelectedDay}
              />
            </ScrollViewChild> : null
          }
        </ScrollView>
        <Buffer
          panResponder={this.panResponder}
          dataSource={this.state.buffer}
          visible={this.props.bufferVisible}
          manageBuffer={this.props.manageBuffer}
          onCardLongPress={this.handleOnDrag}
          screenHeight={screenHeight}
          closeBuffer={this.closeBuffer}
          setBufferCollapsed={this.setBufferCollapsed}
          activeCard={activeCard}
          startDate={startDate}
        />
        { this.renderActiveCard() }
        <SalonAlert
          visible={!!alert}
          title={alert ? alert.title : ''}
          description={alert ? alert.description : ''}
          btnLeftText={alert ? alert.btnLeftText : ''}
          btnRightText={alert ? alert.btnRightText : ''}
          onPressLeft={this.hideAlert}
          onPressRight={alert ? alert.onPressRight : null}
        />
      </View>
    );
  }
}
