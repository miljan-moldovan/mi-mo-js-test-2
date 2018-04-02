import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';

export default class AppointmentScreen extends Component {
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

        <ChangeViewFloatingButton />
      </View>
    );
  }
}
