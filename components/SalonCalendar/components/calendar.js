import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';

import HeaderTop from './headerTop';
import FirstAvBtn from './firstAvailableBtn';
import TimeHeader from './timeColumn';
import AvHeader from './availabilityColumn';
import AppointmentBlock from './appointmentBlock';

const hours = [
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00',
  '15:15',
  '15:30',
  '15:45',
  '16:00',
  '16:15',
  '16:30',
  '16:45',
  '17:00',
];
const styles = StyleSheet.create({
  panResponder: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerCell2: {
    height: 30,
    width: 130,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
});

export default class SalonCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerLeftY: new Animated.Value(0),
    };
  }

  componentWillMount() {
    this.props.providersActions.getProviders();
    this.props.appointmentActions.getAppoinments('2018-03-20');
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

  renderRow = provider => (
    <View style={styles.headerCell2} key={provider.id} />
  );

  renderCell = hour => (
    <View style={{ flexDirection: 'row' }} key={hour}>
      {this.props.providersState.providers.map(provider => this.renderRow(provider))}
    </View>
  );

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View style={{ width: 500, height: 100, backgroundColor: 'white', zIndex: 1 }} />
        <ScrollView
          style={{ marginLeft: 138 }}
          horizontal
          ref={(scrollView1) => { this.horizontalView = scrollView1; }}
          bounces={false}
        >
          <ScrollView
            ref={(scrollView) => { this.verticalView = scrollView; }}
            onScroll={this.onScrollVertical}
            scrollEventThrottle={50}
            stickyHeaderIndices={[0]}
            bounces={false}
          >
            <View>
              <HeaderTop dataSource={this.props.providersState.providers} />
            </View>
            {hours.map(hour => this.renderCell(hour))}
            {this.props.appointmentState.appointments ?
            this.props.appointmentState.appointments.map(appointment =>
              <AppointmentBlock providers={this.props.providersState.providers} appointment={appointment} initialTime={hours[0]} />) : null}
          </ScrollView>
        </ScrollView>
        <Animated.View style={{ position: 'absolute', top: this.state.headerLeftY, paddingTop: 140, backgroundColor: 'white', flexDirection: 'row' }}>
          <TimeHeader dataSource={hours} />
          <AvHeader dataSource={hours} />
        </Animated.View>
        <FirstAvBtn rootStyles={{ position: 'absolute', top: 100 }} />
      </View>
    )
  }
}
