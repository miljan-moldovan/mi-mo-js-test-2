import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';

import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import SalonNewAppointmentSlide from '../../../components/slidePanels/SalonNewAppointmentSlide';
import SalonAppointmentSlide from '../../../components/slidePanels/SalonAppointmentSlide';

import BottomTabBar from '../../../components/bottomTabBar';

export default class AppointmentScreen extends Component {
  state = {
    visible: false,
    visibleNewAppointment: false,
    visibleAppointment: false,
    selectedDate: moment(),
  }

  componentWillMount() {
    this.props.appointmentCalendarActions.getAppoinmentsCalendar(this.state.selectedDate.format('YYYY-MM-DD'));
  }

  gotToSales = () => {
    alert('Not Implemented');
  }

  gotToQueue = () => {
    alert('Not Implemented');
  }

  gotToApptBook = () => {
    this.setState({ visibleNewAppointment: true, visibleAppointment: false });
  }

  gotToClients = () => {
    this.props.navigation.navigate('Clients');
  }

  gotToScoreCard = () => {
    this.setState({ visibleAppointment: true, visibleNewAppointment: false });
  }

  handleDateChange = (date) => {
    this.props.appointmentCalendarActions.getAppoinmentsCalendar(date.format('YYYY-MM-DD'));
    this.setState({ selectedDate: date });
  }

  render() {
    const {
      apptGridSettings, providerAppointments, isLoading,
    } = this.props.appointmentScreenState;
    const { appointments } = this.props.appointmentState;
    const { providers } = this.props.providersState;
    return (
      <View style={{ flex: 1 }}>

        <SalonDatePickerBar
          calendarColor="#FFFFFF"
          onCalendarSelected={() => this.setState({ visible: true })}
          onDateChange={this.handleDateChange}
          selectedDate={this.state.selectedDate}
        />

        {
          isLoading ?
            <ActivityIndicator size="large" color="#0000ff" /> :
            <SalonCalendar
              apptGridSettings={apptGridSettings}
              dataSource={providerAppointments}
              appointments={appointments}
              providers={providers}
              onDrop={this.props.appointmentActions.postAppointmentMove}
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

        <SalonNewAppointmentSlide
          navigation={this.props.navigation}
          visible={this.state.visibleNewAppointment}
          onHide={() => {
            this.setState({ visibleNewAppointment: false });
          }}
        />

        <SalonAppointmentSlide
          navigation={this.props.navigation}
          visible={this.state.visibleAppointment}
          onHide={() => {
            this.setState({ visibleAppointment: false });
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
