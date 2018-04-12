import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import moment from 'moment';

import HeaderTop from './headerTop';
import FirstAvBtn from './firstAvailableBtn';
import TimeHeader from './timeColumn';
import AvHeader from './availabilityColumn';
import AppointmentBlock from './appointmentBlock';
import CalendarCells from './calendarCells';
import CurrentTime from './currentTime';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
    paddingTop: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
    zIndex: 1,
  },
  firstAvBtn: {
    position: 'absolute',
    zIndex: 9
  },
});

export default class SalonCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerLeftY: new Animated.Value(0),
      isEnabled: true,
      calendarMeasure: { x: 0, y: 0, width: 0, height: 0 },
      calendarOffset: { x: 0, y: 0 },
    };
  }

  handleScrollVertical = (ev) => {
    this.setState({ headerLeftY: -ev.nativeEvent.contentOffset.y });
    if (this.state.isEnabled) {
      this.setState({ calendarOffset: { ...this.state.calendarOffset, y: ev.nativeEvent.contentOffset.y } });
    }
  }

  handleHorizontalScroll = (ev) => {
    if (this.state.isEnabled) {
      this.setState({ calendarOffset: { ...this.state.calendarOffset, x: ev.nativeEvent.contentOffset.x } });
    }
  }

  handleOnDrag = (isEnabled) => {
    this.setState({ isEnabled });
  }

  measureScrollX = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    if (this.state.isEnabled) {
      this.setState({
        calendarMeasure: {
          ...this.state.calendarMeasure,
          x,
          width,
        },
      });
    }
  }

  measureScrollY = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    if (this.state.isEnabled) {
      this.setState({
        calendarMeasure: {
          ...this.state.calendarMeasure,
          y,
          height,
        },
      });
    }
  }

  handleScrollX = (dx, callback) => {
    this.horizontalView.scrollTo({ x: dx, y: 0, animated: false });
    this.setState({ calendarOffset: { ...this.state.calendarOffset, x: dx } }), callback();
  }

  handleScrollY = (dy, callback) => {
    this.verticalView.scrollTo({ x: 0, y: dy, animated: false });
    this.setState({ calendarOffset: { ...this.state.calendarOffset, y: dy } }), callback();
  }

  handleDrop = (appointmentId, params) => {
    this.props.onDrop(appointmentId, params);
  }

  handleResize = (appointmentId, params) => {
    this.props.onResize(appointmentId, params);
  }

  render() {
    const { apptGridSettings, providers, dataSource } = this.props;
    const { calendarMeasure, calendarOffset } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          horizontal
          ref={(scrollView1) => { this.horizontalView = scrollView1; }}
          bounces={false}
          scrollEnabled={this.state.isEnabled}
          onLayout={this.measureScrollX}
          onScroll={this.handleHorizontalScroll}
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
            onLayout={this.measureScrollY}
          >
            <View>
              <HeaderTop dataSource={providers} />
            </View>
            <CalendarCells
              dataSource={dataSource}
              providers={providers}
              apptGridSettings={apptGridSettings}
            />
            {this.props.appointments ?
            this.props.appointments.map((appointment) => {
              if (appointment.employee) {
                return (
                  <AppointmentBlock
                    key={appointment.id}
                    providers={providers}
                    appointment={appointment}
                    apptGridSettings={apptGridSettings}
                    onDrag={this.handleOnDrag}
                    calendarMeasure={calendarMeasure}
                    onScrollX={this.handleScrollX}
                    onScrollY={this.handleScrollY}
                    calendarOffset={calendarOffset}
                    onDrop={this.handleDrop}
                    onResize={this.handleResize}
                  />);
            }
              return null;
            }) : null}
          </ScrollView>
        </ScrollView>
        <View style={[styles.fixedColumn, { top: this.state.headerLeftY }]}>
          <TimeHeader apptGridSettings={apptGridSettings} />
          <AvHeader
            apptGridSettings={apptGridSettings}
            providers={providers}
            timeSchedules={dataSource}
          />
          <CurrentTime apptGridSettings={apptGridSettings} />
        </View>
        <FirstAvBtn rootStyles={styles.firstAvBtn} />
      </View>
    );
  }
}
