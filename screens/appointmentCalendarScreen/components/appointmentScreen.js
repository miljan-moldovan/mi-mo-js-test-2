import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from '../../../components/UI/Icon';
import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import SalonNewAppointmentSlide from '../../../components/slidePanels/SalonNewAppointmentSlide';
import SalonAppointmentSlide from '../../../components/slidePanels/SalonAppointmentSlide';

import BottomTabBar from '../../../components/bottomTabBar';

export default class AppointmentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let title = 'All Providers';

    if (params && 'filterProvider' in params) {
      title = params.filterProvider.name;
    }

    return {
      headerTitle: (
        <TouchableOpacity
          style={{
          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        }}
          onPress={() => navigation.state.params.onPressTitle()}
        >
          <Text style={{
            fontSize: 17, lineHeight: 22, fontFamily: 'Roboto-Medium', color: '#FFFFFF',
          }}
          >{title}
          </Text>
          <Icon
            name="caretDown"
            type="solid"
            color="white"
          />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          style={{ alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.state.params.onPressMenu()}
        >
          <Icon
            name="bars"
            type="regular"
            color="white"
            size={20}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <View
          style={{
          flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
        }}
        >
          <TouchableOpacity
            onPress={() => navigation.state.params.onPressEllipsis()}
            style={{
            flex: 1,
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <Icon
              name="ellipsisH"
              type="regular"
              color="white"
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.state.params.onPressCalendar()}
            style={{
            flex: 1,
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <Icon
              name="calendar"
              type="regular"
              color="white"
              size={20}
            />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.props.navigation.setParams({
      onPressMenu: this.onPressMenu,
      onPressEllipsis: this.onPressEllipsis,
      onPressCalendar: this.onPressCalendar,
      onPressTitle: this.onPressTitle,
    });
  }

  state = {
    visible: false,
    visibleNewAppointment: false,
    visibleAppointment: false,
    selectedDate: moment(),
  }

  componentWillMount() {
    this.props.appointmentCalendarActions.getAppoinmentsCalendar('2018-03-20');
  }

  componentDidMount() {
  }

  onPressMenu = () => alert('Not Implemented');

  onPressEllipsis = () => alert('Not Implemented');

  onPressCalendar = () => alert('Not Implemented');

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', { dismissOnSelect: true, onChangeProvider: this.selectFilterProvider });

  selectFilterProvider = provider => this.props.navigation.setParams({ filterProvider: provider });

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
