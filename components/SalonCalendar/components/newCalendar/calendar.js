import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';
import { times, groupBy } from 'lodash';
import moment from 'moment';

import Board from './board';
import Header from './header';
import TimeColumn from './timeColumn';
import Card from './card';
import CurrentTime from '../currentTime';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 1000,
    width: 1000,
  },
  headerContainer: {
    position: 'absolute',
    left: 138,
    top: 0,
    right: 0,
  },
  boardContainer: {
    marginTop: 40,
    marginLeft: 36,
  },
  columnContainer: {
    position: 'absolute',
    left: 0,
    top: 40,
    right: 0,
  },
});

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.setCellsByColumn();
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
    };
  }

  componentWillUpdate() {
    this.setCellsByColumn();
  }

  setCellsByColumn = () => {
    const { apptGridSettings, headerData, appointments } = this.props;
    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      this.schedule = times(apptGridSettings.numOfRow, this.createSchedule);
      //this.groupedAppointments = groupBy(appointments, 'employee.id');
      this.size = {
        width: headerData.length * 130 + 138,
        height: apptGridSettings.numOfRow * 30 + 40,
      };
    }
  }

  createSchedule = (index) => {
    const { apptGridSettings } = this.props;
    const time = moment(apptGridSettings.startTime).add(index * apptGridSettings.step, 'm');
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

  handleOnDrag = (isScrollEnabled) => {
    this.setState({ isScrollEnabled });
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

  handleResize = (appointmentId, params) => {
    this.props.onResize(appointmentId, params);
  }

  renderCards = () => {
    const { appointments } = this.props;
    if (appointments) {
      return appointments.map(this.renderCard);
    }
    return null;
  }

  renderCard = (appointment) => {
    const { apptGridSettings, headerData } = this.props;
    const { calendarMeasure, calendarOffset } = this.state;
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
        />);
    }
    return null;
  }

  render() {
    const { headerData, apptGridSettings, dataSource } = this.props;
    const { isScrollEnabled } = this.state;
    if (apptGridSettings.numOfRow > 0 && headerData && headerData.length > 0) {
      return (
        <ScrollView
          bounces={false}
          bouncesZoom
          maximumZoomScale={1.1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, this.size]}
          style={styles.container}
          scrollEnabled={isScrollEnabled}
          onScroll={this.handleScroll}
          ref={(board) => { this.board = board; }}
          onLayout={this.measureScrollView}
        >
          <ScrollViewChild
            scrollDirection="both"
            style={styles.boardContainer}
          >
            <Board
              columns={headerData}
              rows={this.schedule}
              apptGridSettings={apptGridSettings}
              groupedAppointments={this.groupedAppointments}
              timeSchedules={dataSource}
            />
            { this.renderCards() }
          </ScrollViewChild>
          <ScrollViewChild scrollDirection="vertical" style={styles.columnContainer}>
            <TimeColumn schedule={this.schedule} />
            <CurrentTime apptGridSettings={apptGridSettings} />
          </ScrollViewChild>
          <ScrollViewChild scrollDirection="horizontal" style={styles.headerContainer}>
            <Header dataSource={headerData} />
          </ScrollViewChild>
        </ScrollView>
      );
    }
    return null;
  }
}
