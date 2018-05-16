import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
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
      calendarMeasure: {
        width: 0,
        height: 0,
      },
      calendarOffset: {
        x: 0,
        y: 0,
      },
      isScrollEnabled: true,
      showFirstAvailable: false,
      buffer: [],
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
    };
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.activeCard,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.activeCard,
      onPanResponderMove: (e, gesture) => {
        if (!this.state.isScrollEnabled) {
          this.moveX = gesture.dx;
          this.moveY = gesture.dy;
          return Animated.event([null, {
            dx: this.state.pan.x,
            dy: this.state.pan.y,
          }])(e, gesture);
        }
        return null;
      },
      onPanResponderRelease: (e, gesture) => {
        if (!this.state.isScrollEnabled && this.state.activeCard) {
          this.handleBufferDrop();
        }
      },
      // onPanResponderGrant: () => {
      //   if (!this.state.isScrollEnabled && this.state.activeCard) {
      //     this.state.pan.setOffset({ x: this.state.activeCard.left, y: this.state.activeCard.top });
      //     this.state.pan.setValue({ x: 0, y: 0 });
      //   }
      // },
    });
  }

  componentWillUpdate(nextProps) {
    if ((!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading)
      || nextProps.displayMode !== this.props.displayMode) {
      this.setCellsByColumn(nextProps);
    }
  }

  setCellsByColumn = (nextProps) => {
    const {
      apptGridSettings,
      headerData,
      selectedProvider,
      displayMode,
      startDate,
    } = nextProps;

    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      //this.startTime = apptGridSettings.weeklySchedule[startDate.format('E') - 1].start1;
      this.schedule = times(apptGridSettings.numOfRow, index => this.createSchedule(index, nextProps));
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
    const { selectedProvider, headerData, apptGridSettings, bufferVisible } = this.props;
    const { calendarMeasure, pan, activeCard } = this.state;
    let dx = 0;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    const bufferHeight = bufferVisible ? 110 : 0;
    if (activeCard) {
      if (moveX && moveY) {
        if (selectedProvider === 'all') {
          const maxWidth = headerData.length * cellWidth - calendarMeasure.width + 64;
          const scrollHorizontalBoundRight = calendarMeasure.width - boundLength - cellWidth + 36;
          const scrollHorizontalBoundLeft = boundLength;
          const newMoveX = moveX + pan.x._offset;
          if (scrollHorizontalBoundRight < newMoveX) {
            dx = newMoveX - scrollHorizontalBoundRight;
          } else if (scrollHorizontalBoundLeft > newMoveX) {
            dx = newMoveX - scrollHorizontalBoundLeft;
          }
          if (dx !== 0) {
            dx = Math.abs(dx) > boundLength ? boundLength * Math.sign(dx) : dx;
            dx = dx * maxScrollChange / boundLength;
            this.offset.x += dx;
            if (this.offset.x > maxWidth) {
              this.offset.x =  maxWidth;
            }
            if (this.offset.x < 0) {
              this.offset.x = 0;
            }
            this.scrollToX(this.offset.x, () => {
              pan.setOffset({
                x: pan.x._offset + dx,
                y: pan.y._offset,
              });
              pan.setValue({ x: pan.x._value, y: pan.y._value, });
            });
          } else {
            const maxHeigth = apptGridSettings.numOfRow * 30 - calendarMeasure.height + bufferHeight;
            const scrollVerticalBoundTop = calendarMeasure.height - boundLength - activeCard.height._value;
            const scrollVerticalBoundBottom = boundLength;
            const newMoveY = moveY + pan.y._offset;
            if (scrollVerticalBoundTop < newMoveY) {
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
              this.scrollToY(this.offset.y, () => {
                pan.setOffset({
                  y: pan.y._offset + dy,
                  x: pan.x._offset,
                });
                pan.setValue({ y: pan.y._value, x: pan.x._value });
              });
            }
          }
        }
      }
      requestAnimationFrame(this.scrollAnimation);
    }
  }

  handleOnDrag = (isScrollEnabled, appointment, left, top, cardWidth, height) => {
    let newState;
    if (!isScrollEnabled) {
      this.props.manageBuffer(true);
      const { pan } = this.state;
      const newTop =  top + 40 - this.offset.y;
      const newLeft = left + 36 - this.offset.x;
      this.state.pan.setOffset({ x: newLeft, y: newTop });
      this.state.pan.setValue({ x: 0, y: 0 });
      pan.setOffset({ x: newLeft, y: newTop });
      pan.setValue({ x: 0, y: 0 });
      newState = {
        isScrollEnabled,
        activeCard: {
          appointment,
          left: newLeft,
          top: newTop,
          cardWidth,
          height,
        },
      };
      this.setState(newState, this.scrollAnimation);
    } else {
      this.moveX = null;
      this.moveY = null;
      newState = {
        isScrollEnabled,
        activeCard: null,
      }
      this.setState(newState);
    }
  }

  handleScroll = (ev) => {
    const { isScrollEnabled } = this.state;
    if (isScrollEnabled) {
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

  handleBufferDrop=()=>{
    if (this.props.bufferVisible) {
      const { buffer, activeCard, pan } = this.state;
      const top = pan.y._value + pan.y._offset;
      if (top > screenHeight - 110 - 133) {
        buffer.push(activeCard.appointment)
        this.setState({ buffer, activeCard: null });
      } else {
        this.handleReleaseAll();
      }
    }
  }

  handleReleaseAll = () => {
    this.moveX = null;
    this.moveY = null;
    const cellHeight = 30;
    const { pan, activeCard: { appointment } } = this.state;
    const { cellWidth, headerData, apptGridSettings, onDrop, selectedProvider, startDate, displayMode } = this.props;
    const { toTime, fromTime } = appointment;
    const dx = pan.x._value + pan.x._offset + this.offset.x - 64;
    const dy = pan.y._value + pan.y._offset + this.offset.y - 40;
    const xIndex = (dx / this.cellWidth).toFixed();
    const yIndex = (dy / cellHeight).toFixed();
    const isOutOfBounds = xIndex < 0 || xIndex >= headerData.length
    || yIndex < 0 || yIndex >= this.schedule.length;
    if (!isOutOfBounds) {
      const employeeId = selectedProvider === 'all' ? headerData[xIndex].id : selectedProvider.id;
      const date = selectedProvider === 'all' || displayMode === 'day' ? startDate.format('YYYY-MM-DD') : headerData[xIndex];
      const newTime = moment(this.schedule[yIndex], 'h:mm A').format('HH:mm');
      onDrop(appointment.id, {
        date,
        newTime,
        employeeId,
      });
      this.handleOnDrag(true);
    }
  }

  handleResize = (appointmentId, params) => {
    this.props.onResize(appointmentId, params);
  }

  renderCards = () => {
    const {
      appointments, selectedProvider, displayMode, startDate,
    } = this.props;
    if (appointments) {
      const isAllProviderView = selectedProvider === 'all';
      if (!isAllProviderView && displayMode === 'day') {
        const filteredAppointments = filter(appointments, appt => startDate.format('YYYY-MM-DD')
        === moment(appt.date).format('YYYY-MM-DD'));
        return filteredAppointments.map(this.renderCard);
      }
      return appointments.map(this.renderCard);
    }
    return null;
  }

  handleShowfirstAvailalble = () => {
    const { showFirstAvailable } = this.state;
    this.setState({ showFirstAvailable: !showFirstAvailable });
  }

  renderCard = (appointment) => {
    const { apptGridSettings, headerData, selectedProvider, displayMode, appointments, providerSchedule, isLoading } = this.props;
    const { calendarMeasure, calendarOffset,showFirstAvailable } = this.state;
    const isAllProviderView = selectedProvider === 'all';
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    if (appointment.employee) {
      return (
        <Card
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
          displayMode={isAllProviderView ? 'all' : displayMode}
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
    const { apptGridSettings, headerData, selectedProvider, displayMode, appointments, providerSchedule, isLoading } = this.props;
    const { activeCard } = this.state;
    return activeCard ? (
      <NewCard
        appointment={activeCard.appointment}
        left={activeCard.left}
        top={activeCard.top}
        cardWidth={activeCard.cardWidth}
        height={activeCard.height}
        onDrop={this.handleBufferDrop}
        pan={this.state.pan}
      />) : null
  }

  render() {
    const { isLoading, headerData, apptGridSettings, dataSource, selectedProvider, displayMode, providerSchedule, availability } = this.props;
    const isDate = selectedProvider !== 'all';
    const showHeader = displayMode === 'week' || selectedProvider === 'all';
    const { isScrollEnabled, showFirstAvailable } = this.state;
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm');
    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      return (
        <View style={{flex: 1}} {...this.panResponder.panHandlers}>
          <ScrollView
            bounces={false}
            //bouncesZoom
            //maximumZoomScale={1.1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.contentContainer, this.size, { borderTopWidth: !showHeader ? 1 : 0 }]}
            style={styles.container}
            scrollEnabled={isScrollEnabled && !isLoading}
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
                onCellPressed={this.props.onCellPressed}
                columns={headerData}
                rows={this.schedule}
                apptGridSettings={apptGridSettings}
                timeSchedules={dataSource}
                showAvailability={!isDate}
                cellWidth={this.cellWidth}
                isDate={isDate}
                providerSchedule={providerSchedule}
                availability={availability}
                displayMode={displayMode}
                isLoading={isLoading}
              />
              { this.renderCards() }
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
                  cellWidth={this.cellWidth}
                  handleShowfirstAvailalble={this.handleShowfirstAvailalble}
                  showFirstAvailable={showFirstAvailable}
                />
              </ScrollViewChild> : null
            }
          </ScrollView>
          <Buffer dataSource={this.state.buffer} visible={this.props.bufferVisible} manageBuffer={this.props.manageBuffer} />
          {this.renderActiveCard()}
        </View>
      );
    }
    return null;
  }
}
