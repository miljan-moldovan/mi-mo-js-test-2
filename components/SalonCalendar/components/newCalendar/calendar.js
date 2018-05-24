import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, Alert, Modal, Text } from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';
import { times, groupBy, filter } from 'lodash';
import moment from 'moment';

import Board from './board';
import Header from './header';
import TimeColumn from './timeColumn';
import Card from './card';
import NewCard from './newCard';
import CurrentTime from '../currentTime';
import Buffer from '../calendarBuffer';
import SalonAlert from './SalonAlert';

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
      showFirstAvailable: false,
      buffer: [],
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
      isResizeing: false,
    };
    this.size = { width: 0, height: 0 };
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.activeCard,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.activeCard,
      onPanResponderMove: (e, gesture) => {
        const { dy, dx } = gesture;
        if (this.state.activeCard) {
          if (!this.state.isResizeing) {
            this.moveX = dx;
            this.moveY = dy;
            return Animated.event([null, {
              dx: this.state.pan.x,
              dy: this.state.pan.y,
            }])(e, gesture);
          }
          const size = this.moveY ? dy - this.moveY : dy;
          this.moveY = dy;
          if (this.resizeCard) {
            this.state.activeCard.height = this.resizeCard.resizeCard(size);
          }
        }
        return null;
      },
      onPanResponderRelease: (e, gesture) => {
        if (this.state.activeCard) {
          if (!this.state.isResizeing) {
            this.handleCardDrop();
          } else {
            this.handleResizeCard();
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
      this.schedule = times(apptGridSettings.numOfRow, index => this.createSchedule(index, nextProps));
      if (selectedFilter === 'providers') {
        if (selectedProvider === 'all') {
          this.size = {
            width: headerData.length * providerWidth + 100,
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

  scrollAnimation = () => {
    const { cellWidth, moveX, moveY } = this;
    const {
      selectedProvider, headerData, apptGridSettings, bufferVisible, displayMode,
    } = this.props;
    const { calendarMeasure, pan, activeCard } = this.state;
    let dx = 0;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    const bufferHeight = bufferVisible ? 110 : 0;
    if (activeCard) {
      if (moveX && moveY) {
        const maxWidth = headerData.length * cellWidth - calendarMeasure.width + 64;
        const scrollHorizontalBoundRight = calendarMeasure.width - boundLength - cellWidth + 36;
        const scrollHorizontalBoundLeft = boundLength;
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
          const headerHeight = 40;
          const maxHeigth = apptGridSettings.numOfRow * 30 - calendarMeasure.height + bufferHeight;
          const scrollVerticalBoundTop = calendarMeasure.height - boundLength - activeCard.height - bufferHeight + headerHeight;
          const scrollVerticalBoundBottom = boundLength;
          const newMoveY = moveY + pan.y._offset;
          const isInBufferArea = bufferVisible && newMoveY > calendarMeasure.height - bufferHeight - activeCard.height + headerHeight;
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
    const { cellWidth, moveY } = this;
    const {
      selectedProvider, headerData, apptGridSettings, bufferVisible, displayMode,
    } = this.props;
    const { calendarMeasure, pan, activeCard, isResizeing } = this.state;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15
    if (isResizeing) {
      const coordinatesY = activeCard.top;
      const maxHeigth = apptGridSettings.numOfRow * 30 - calendarMeasure.height;
      const scrollVerticalBoundTop = this.offset.y + calendarMeasure.height - boundLength;
      const scrollVerticalBoundBottom = this.offset.y + boundLength;
      const newMoveY = coordinatesY + activeCard.height;
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
        activeCard.height = this.resizeCard.resizeCard(dy);
        this.scrollToY(this.offset.y);
      }
      requestAnimationFrame(this.scrollAnimationResize);
    }
  }

  handleOnDrag = (isScrollEnabled, appointment, left, top, cardWidth, height, isBufferCard) => {
    let newState;
    this.moveX = null;
    this.moveY = null;
    if (!isScrollEnabled) {
      if (!this.props.bufferVisible) {
        this.props.manageBuffer(true);
      }
      const offsetY = isBufferCard ? -this.calendarPosition.y : 40 - this.offset.y;
      const offsetX = isBufferCard ? -this.calendarPosition.x : 36 - this.offset.x;
      const { pan } = this.state;
      const newTop = top + offsetY;
      const newLeft = left + offsetX;
      this.state.pan.setOffset({ x: newLeft, y: newTop });
      this.state.pan.setValue({ x: 0, y: 0 });
      pan.setOffset({ x: newLeft, y: newTop });
      pan.setValue({ x: 0, y: 0 });
      newState = {
        activeCard: {
          appointment,
          left,
          top,
          cardWidth,
          height,
          isBufferCard,
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
    const newHeight = Math.round(activeCard.height / 30);
    activeCard.height = newHeight * 30;
    const params = { newLength: newHeight };

    const clientName = `${activeCard.appointment.client.name} ${activeCard.appointment.client.lastName}`;
    const date = moment(activeCard.appointment.date, 'YYYY-MM-DD').format('MMM DD');

    const fromTime = moment(activeCard.appointment.fromTime, 'HH:mm').format('h:mma');
    const oldToTime = moment(activeCard.appointment.toTime, 'HH:mm').format('h:mma');
    const newToTime = moment(activeCard.appointment.fromTime, 'HH:mm').add(newHeight * apptGridSettings.step, 'm').format('h:mma');
    const alert = {
      title: 'Resize Appointment',
      description: `Resize ${clientName} Appt. from ${date} ${fromTime}-${oldToTime} to ${date} ${fromTime}-${newToTime}?`,
      btnLeftText: 'Cancel',
      btnRightText: 'Resize',
      handleMove: () => {
        this.props.onResize(activeCard.appointment.id, params, activeCard.appointment);
        this.hideAlert();
      }
    }
    this.setState({
      alert,
      activeCard,
    });
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
    }
  }

  handleMove = (date, newTime, employeeId, appointmentId) => {
    const { onDrop, appointments } = this.props;
    const { buffer } = this.state;
    const index = buffer.findIndex(appt => appt.id === appointmentId);
    let oldAppointment = null;
    if (index > -1) {
      oldAppointment = buffer[index];
      buffer.splice(index, 1);
    } else {
      oldAppointment = appointments.find(item => item.id === appointmentId);
    }

    onDrop(
      appointmentId,
      {
        date,
        newTime,
        employeeId,
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
    || yIndex < 0 || yIndex >= this.schedule.length;
    if (!isOutOfBounds) {
      const employeeId = selectedFilter === 'providers' && selectedProvider === 'all' ? headerData[xIndex].id : selectedProvider.id;
      const date = selectedProvider === 'all' || displayMode === 'day' ? startDate : moment(headerData[xIndex], 'YYYY-MM-DD');
      const newTime = moment(this.schedule[yIndex], 'h:mm A');
      const oldDate = moment(appointment.date, 'YYYY-MM-DD').format('MMM DD');
      const oldFromTime = moment(appointment.fromTime, 'HH:mm');
      const oldToTime = moment(appointment.toTime, 'HH:mm');
      const duration = oldToTime.diff(oldFromTime, 'minutes');
      const clientName = `${appointment.client.name} ${appointment.client.lastName}`;
      const newToTime = moment(newTime).add(duration, 'm').format('h:mma');
      this.setState({
        alert: {
          title: 'Move Appointment',
          description: `Move ${clientName} Appt. from ${oldDate} ${oldFromTime.format('h:mma')}-${oldToTime.format('h:mma')} to ${date.format('MMM DD')} ${newTime.format('h:mma')}-${newToTime}?`,
          btnLeftText: 'Cancel',
          btnRightText: 'Move',
          handleMove: () => this.handleMove(date.format('YYYY-MM-DD'), newTime.format('HH:mm'), employeeId, appointment.id),
        },
      });
    }
  }

  hideAlert = () => this.setState({ alert: null, activeCard: null, isResizeing: false });

  handleShowfirstAvailalble = () => {
    const { showFirstAvailable } = this.state;
    this.setState({ showFirstAvailable: !showFirstAvailable });
  }

  renderCards = () => {
    const {
      appointments, rooms, selectedFilter,
      selectedProvider, displayMode, startDate,
    } = this.props;
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

  renderCard = (appointment) => {
    const {
      apptGridSettings, headerData, selectedProvider, selectedFilter,
      displayMode, appointments, providerSchedule, isLoading, filterOptions,
    } = this.props;
    const {
      calendarMeasure, calendarOffset, showFirstAvailable, activeCard, buffer,
    } = this.state;
    const isAllProviderView = selectedFilter === 'providers' && selectedProvider === 'all';
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    const isActive = activeCard && activeCard.appointment.id === appointment.id || buffer.findIndex(appt => appt.id === appointment.id) > -1;
    if (appointment.employee) {
      return (
        <Card
          isResizeing={this.state.isResizeing}
          isMultiBlock={filterOptions.showMultiBlock}
          isActive={isActive}
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
          showFirstAvailable={showFirstAvailable}
          groupedProviders={this.groupedProviders}
          providerSchedule={providerSchedule}
          isLoading={isLoading}
        />);
    }
    return null;
  }

  renderActiveCard =() => {
    const {
      apptGridSettings, headerData, selectedProvider, displayMode, appointments, providerSchedule, isLoading,
    } = this.props;
    const { activeCard, calendarMeasure, isResizeing } = this.state;
    return activeCard ? (
      <NewCard
        appointment={activeCard.appointment}
        apptGridSettings={apptGridSettings}
        onScrollY={this.scrollToY}
        calendarMeasure={calendarMeasure}
        calendarOffset={this.offset}
        onResize={this.handleOnResize}
        cardWidth={activeCard.cardWidth}
        height={activeCard.height}
        onDrop={this.handleCardDrop}
        pan={this.state.pan}
        isActive
        opacity={isResizeing ? 0 : 1}
        isResizeing={this.state.isResizeing}
        isBufferCard={activeCard.isBufferCard}
      />) : null;
  }

  renderResizeCard =() => {
    const {
      apptGridSettings, headerData, selectedProvider, displayMode, appointments, providerSchedule, isLoading,
    } = this.props;
    const { activeCard, calendarMeasure, isResizeing } = this.state;
    const offsetY = this.offset.y - 40;
    const offsetX = this.offset.x - 36;
    const { pan } = this.state;
    const newTop = pan.y._value + pan.y._offset + offsetY;
    const newLeft = pan.x._value + pan.x._offset + offsetX;
    const newPan = new Animated.ValueXY({ x: newLeft, y: newTop });
    return isResizeing && activeCard ? (
      <NewCard
        ref={(card) => { this.resizeCard = card; }}
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
        pan={newPan}
        isActive
        isResizeing={this.state.isResizeing}
        isBufferCard={activeCard.isBufferCard}
      />) : null;
  }

  render() {
    const {
      isLoading, headerData, apptGridSettings, dataSource, selectedFilter,
      selectedProvider, displayMode, providerSchedule, availability, bufferVisible,
      isRoom, isResource,
    } = this.props;
    const isDate = selectedProvider !== 'all' && selectedFilter === 'providers';
    const showHeader = displayMode === 'week' || selectedProvider === 'all' || isRoom || isResource;
    const { alert, activeCard, showFirstAvailable, isResizeing } = this.state;
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    const size = {
      width: this.size.width,
      height: bufferVisible ? this.size.height + 110 : this.size.heigh,
    };
    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }} {...this.panResponder.panHandlers} ref={(view) => { this.calendar = view; }}>
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
                onPressAvailability={this.props.onPressAvailability}
                onCellPressed={this.props.onCellPressed}
                columns={headerData}
                rows={this.schedule}
                apptGridSettings={apptGridSettings}
                timeSchedules={dataSource}
                showAvailability={!isDate && !isRoom && !isResource}
                cellWidth={this.cellWidth}
                isDate={isDate}
                isRoom={isRoom}
                isResource={isResource}
                providerSchedule={providerSchedule}
                availability={availability}
                displayMode={displayMode}
                isLoading={isLoading}
              />
              { this.renderCards() }
              {this.renderResizeCard()}
            </ScrollViewChild>
            <ScrollViewChild scrollDirection="vertical" style={[styles.columnContainer, { top: showHeader ? headerHeight : 0 }]}>
              <TimeColumn schedule={this.schedule} />
              <CurrentTime apptGridSettings={apptGridSettings} startTime={startTime} />
            </ScrollViewChild>
            { showHeader ?
              <ScrollViewChild scrollDirection="horizontal" style={styles.headerContainer}>
                <Header
                  dataSource={headerData}
                  isDate={isDate}
                  isRoom={isRoom}
                  isResource={isResource}
                  cellWidth={this.cellWidth}
                  handleShowfirstAvailalble={this.handleShowfirstAvailalble}
                  showFirstAvailable={showFirstAvailable}
                />
              </ScrollViewChild> : null
            }
          </ScrollView>
          <Buffer
            dataSource={this.state.buffer}
            visible={this.props.bufferVisible}
            manageBuffer={this.props.manageBuffer}
            onCardLongPress={this.handleOnDrag}
            screenHeight={screenHeight}
          />
          { this.renderActiveCard() }
          <SalonAlert
            visible={!!alert}
            title={alert ? alert.title : ''}
            description={alert ? alert.description : ''}
            btnLeftText={alert ? alert.btnLeftText : ''}
            btnRightText={alert ? alert.btnRightText : ''}
            onPressLeft={this.hideAlert}
            onPressRight={alert ? alert.handleMove : null}
          />
        </View>
      );
    }
    return null;
  }
}
