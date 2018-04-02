import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import moment from 'moment';

import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';

export default class AppointmentScreen extends Component {
  state = {
    visible: false,
    selectedDate: moment(),
  }

  componentWillMount() {
    this.props.appointmentCalendarActions.getAppoinmentsCalendar('2018-03-20');
  }

  render() {
    const {
      startTime, endTime, providerAppointments, isLoading,
    } = this.props.appointmentScreenState;
    const { appointments } = this.props.appointmentState;
    const { providers } = this.props.providersState;
    return (
      <View style={{ flex: 1 }}>

        <SalonDatePickerBar
          calendarColor="#FFFFFF"
          onCalendarSelected={() => this.setState({ visible: true })}
          onDateChange={(date) => {
            this.setState({ selectedDate: date });
          }}
          selectedDate={this.state.selectedDate}
        />

        {
          isLoading ?
            <ActivityIndicator size="large" color="#0000ff" /> :
            <SalonCalendar
              startTime={startTime}
              endTime={endTime}
              dataSource={providerAppointments}
              appointments={appointments}
              providers={providers}
            />
      }

        <ChangeViewFloatingButton handlePress={(isWeek) => {
          const message = isWeek ? 'week' : 'day';
          alert(`TODO ${message}`);
        }}
        />

        <SalonDatePickerSlide
          visible={this.state.visible}
          selectedDate={moment(this.state.selectedDate).format('YYYY-MM-DD')}
          onHide={() => {
            this.setState({ visible: false });
          }}
          onDateSelected={(date) => {
            this.setState({ selectedDate: date, visible: false });
          }}
        />
      </View>
    );
  }
}
