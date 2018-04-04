import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import moment from 'moment';

import HeaderTop from './headerTop';
import FirstAvBtn from './firstAvailableBtn';
import TimeHeader from './timeColumn';
import AvHeader from './availabilityColumn';
import AppointmentBlock from './appointmentBlock';
import CalendarCells from './calendarCells';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    width: 500,
    height: 100,
    backgroundColor: 'white',
    zIndex: 1,
  },
  headerCell: {
    height: 30,
    width: 130,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerCellDisabled: {
    height: 30,
    width: 130,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
  },
  scrollView: {
    marginLeft: 138,
  },
  fixedColumn: {
    position: 'absolute',
    paddingTop: 140,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  firstAvBtn: {
    position: 'absolute',
    top: 100,
  },
});

export default class SalonCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerLeftY: new Animated.Value(0),
      isEnabled: true,
      calendarMeasure: null,
      calendarOffset: { x: 0, y: 0 },
    };
  }

  handleScrollVertical = (ev) => {
    //this.setState({ calendarOffset: { y: ev.nativeEvent.contentOffset.y } });
    Animated.timing(
      this.state.headerLeftY,
      {
        toValue: -ev.nativeEvent.contentOffset.y,
        duration: 300,
      },
    ).start();
  }

  handleHorizontalScroll = (ev) => {
    if (this.state.isEnabled)
      this.setState({ calendarOffset: { x: ev.nativeEvent.contentOffset.x } });
  }

  handleOnDrag = () => {
    this.setState({ isEnabled: false });
  }

  measureScroll = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    this.setState({
      calendarMeasure: {
        x,
        y,
        width,
        height,
      },
    });
  }

  handleScrollX = (dx) => {
    this.horizontalView.scrollTo({ x: dx, y: 0, animated: false });
  }

  handleScrollY = (y) => {
    this.verticalView.scrollTo({ x: 0, y, animated: true });
  }

  render() {
    const { startTime, endTime, providers, dataSource } = this.props;
    const { calendarMeasure, calendarOffset } = this.state;
    const duration = moment(endTime).diff(moment(startTime), 'hours') * 4;
    const hours = Array.from(Array(duration).keys());
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <ScrollView
          style={styles.scrollView}
          horizontal
          ref={(scrollView1) => { this.horizontalView = scrollView1; }}
          bounces={false}
          scrollEnabled={this.state.isEnabled}
          onLayout={this.measureScroll}
          onScroll={this.handleHorizontalScroll}
          scrollEventThrottle={50}
          removeClippedSubviews={false}
        >
          <ScrollView
            ref={(scrollView) => { this.verticalView = scrollView; }}
            onScroll={this.handleScrollVertical}
            scrollEventThrottle={50}
            stickyHeaderIndices={[0]}
            bounces={false}
            scrollEnabled={this.state.isEnabled}
            removeClippedSubviews={false}
          >
            <View>
              <HeaderTop dataSource={providers} />
            </View>
            <CalendarCells
              hours={hours}
              dataSource={dataSource}
              providers={providers}
              startTime={startTime}
            />
            {this.props.appointments ?
            this.props.appointments.map((appointment) => {
              if (appointment.employee) {
                return (
                  <AppointmentBlock
                    providers={providers}
                    appointment={appointment}
                    initialTime={startTime}
                    onDrag={this.handleOnDrag}
                    calendarMeasure={calendarMeasure}
                    onScrollX={this.handleScrollX}
                    onScrollY={this.handleScrollY}
                    calendarOffset={calendarOffset}
                  />);
            }
              return null;
            }) : null}
          </ScrollView>
        </ScrollView>
        <Animated.View style={[styles.fixedColumn, { top: this.state.headerLeftY }]}>
          <TimeHeader dataSource={hours} startTime={startTime} />
          <AvHeader dataSource={hours} />
        </Animated.View>
        <FirstAvBtn rootStyles={styles.firstAvBtn} />
      </View>
    );
  }
}
