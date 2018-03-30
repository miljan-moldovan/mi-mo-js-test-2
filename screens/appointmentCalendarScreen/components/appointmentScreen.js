import React, { Component } from 'react';
import { View } from 'react-native';

import SalonCalendar from '../../../components/SalonCalendar';

export default class AppointmentScreen extends Component {
  componentWillMount() {
    this.props.appointmentCalendarActions.getAppoinmentsCalendar('2018-03-20');
  }

  render() {
    const { startTime, endTime, providerAppointments } = this.props.appointmentScreenState;
    const { appointments } = this.props.appointmentState;
    const { providers } = this.props.providersState;
    return (
      <View style={{ flex: 1 }}>
        <SalonCalendar
          startTime={startTime}
          endTime={endTime}
          dataSource={providerAppointments}
          appointments={appointments}
          providers={providers}
        />
      </View>
    );
  }
}
