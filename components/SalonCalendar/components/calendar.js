import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import moment from 'moment';

import HeaderTop from './headerTop';
import FirstAvBtn from './firstAvailableBtn';
import TimeHeader from './timeColumn';
import AvHeader from './availabilityColumn';
import AppointmentBlock from './appointmentBlock';

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
    };
  }

  onScrollVertical = (ev) => {
    Animated.timing(
      this.state.headerLeftY,
      {
        toValue: -ev.nativeEvent.contentOffset.y,
        duration: 300,
      },
    ).start();
  }

  handleOnDrag = () => {
    this.setState({ isEnabled: false });
  }

  renderRow = (providerScheudle, hour, key) => {
    const time = moment(this.props.startTime, 'HH:mm').add(hour * 15, 'm');
    const style = providerScheudle && providerScheudle.scheduledIntervals
    && providerScheudle.scheduledIntervals.length > 0
    && time.isSameOrAfter(moment(providerScheudle.scheduledIntervals[0].start, 'HH:mm'))
    && time.isSameOrBefore(moment(providerScheudle.scheduledIntervals[0].end, 'HH:mm')) ? styles.headerCell : styles.headerCellDisabled;
    return (
      <View style={style} key={key} />
    );
  }

  renderCell = hour => (
    <View style={styles.row} key={hour}>
      {this.props.providers.map(provider =>
        this.renderRow(this.props.dataSource[provider.id], hour, provider.id))}
    </View>
  );

  render() {
    const { startTime, endTime } = this.props;
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
        >
          <ScrollView
            ref={(scrollView) => { this.verticalView = scrollView; }}
            onScroll={this.onScrollVertical}
            scrollEventThrottle={50}
            stickyHeaderIndices={[0]}
            bounces={false}
            scrollEnabled={this.state.isEnabled}
          >
            <View>
              <HeaderTop dataSource={this.props.providers} />
            </View>
            {hours.map(hour => this.renderCell(hour))}
            {this.props.appointments ?
            this.props.appointments.map((appointment) => {
              if (appointment.employee) {
                return (
                  <AppointmentBlock
                    providers={this.props.providers}
                    appointment={appointment}
                    initialTime={startTime}
                    onDrag={this.handleOnDrag}
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
