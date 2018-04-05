import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';

import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import BottomTabBar from '../../../components/bottomTabBar';

export default class AppointmentScreen extends Component {
  state = {
    visible: false,
    selectedDate: moment(),
  }

  componentWillMount() {
    this.props.appointmentCalendarActions.getAppoinmentsCalendar('2018-03-20');
  }

  gotToSales = () => {
    alert('Not Implemented');
  }

  gotToQueue = () => {
    alert('Not Implemented');
  }

  gotToApptBook = () => {
  }

  gotToClients = () => {
    this.props.navigation.navigate('Clients');
  }

  gotToScoreCard = () => {
    alert('Not Implemented');
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

        <BottomTabBar
          tabs={[
          {
            icon: 'lineChart', title: 'Sales', callback: this.gotToSales,
          },
          {
           icon: 'calendar', title: 'Appt. Book', callback: this.gotToApptBook,
          },
          {
           icon: 'signIn', title: 'Queue', callback: this.gotToQueue,
          },
          {
           icon: 'driversLicense', title: 'Clients', callback: this.gotToClients,
          },
          {
           icon: 'clipboard', title: 'ScoreCard', callback: this.gotToScoreCard,
          },
        ]}
        />
      </View>
    );
  }
}
