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
      onMoveShouldSetPanResponder: (evt, gestureState) => !this.state.isScrollEnabled && this.state.activeCard,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => !this.state.isScrollEnabled && this.state.activeCard,
      onPanResponderMove: (e, gesture) => {
        if(!this.state.isScrollEnabled) {
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
      appointments,
      selectedProvider,
      displayMode,
      startDate,
    } = nextProps;

    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      this.startTime = apptGridSettings.weeklySchedule[startDate.format('E') - 1].start1;
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

  createSchedule = (index) => {
    const { apptGridSettings } = this.props;
    const time = moment(this.startTime, 'HH:mm').add(index * apptGridSettings.step, 'm');
    return time.format('h:mm A').toString();
  }

  measureScrollView = ({ nativeEvent: { layout: { width, height } } }) => {
    if (this.state.calendarMeasure.width === 0 && this.state.calendarMeasure.height === 0) {
      this.setState({
        calendarMeasure: {
          height: height - 40,
          width: width - 36,
        },
      });
    }
  }

  handleOnDrag = (isScrollEnabled, appointment, left, top, cardWidth, height) => {
    if (!isScrollEnabled) {
      this.props.manageBuffer(true);
    }
    this.state.pan.setOffset({ x: left + 36, y: top + 40});
    this.state.pan.setValue({ x: 0, y: 0 });
    this.setState({ isScrollEnabled, activeCard: {appointment, left: left + 36, top: top + 40, cardWidth, height} });
  }

  handleScroll = (ev) => {
    const { isScrollEnabled } = this.state;
    if (isScrollEnabled) {
      this.setState({
        calendarOffset: {
          x: ev.nativeEvent.contentOffset.x,
          y: ev.nativeEvent.contentOffset.y,
        },
      });
    }
  }

  scrollToX = (dx, callback) => {
    const { calendarOffset } = this.state;
    this.board.scrollTo({ x: dx, y: calendarOffset.y, animated: false });
    this.setState({ calendarOffset: { ...calendarOffset, x: dx } }), callback();
  }

  scrollToY = (dy, callback) => {
    const { calendarOffset } = this.state;
    this.board.scrollTo({ y: dy, x: calendarOffset.x, animated: false });
    this.setState({ calendarOffset: { ...calendarOffset, y: dy } }), callback();
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
      }
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
    const { apptGridSettings, headerData, selectedProvider, displayMode, appointments, providerSchedule, isLoading, filterOptions } = this.props;
    const { calendarMeasure, calendarOffset,showFirstAvailable } = this.state;
    const isAllProviderView = selectedProvider === 'all';
    const startTime = moment(this.startTime, 'HH:mm');
    if (appointment.employee) {
      return (
        <Card
          isMultiBlock={filterOptions.showMultiBlock}
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
    const startTime = moment(this.startTime, 'HH:mm');
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
