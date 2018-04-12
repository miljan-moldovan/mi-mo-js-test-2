import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from '../../../components/UI/Icon';
import SalonCalendar from '../../../components/SalonCalendar';
import SalonDayCalendar from '../../../components/SalonDayCalendar';
import SalonWeekCalendar from '../../../components/SalonWeekCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import SalonNewAppointmentSlide from '../../../components/slidePanels/SalonNewAppointmentSlide';
import SalonAppointmentSlide from '../../../components/slidePanels/SalonAppointmentSlide';
import SalonAvatar from '../../../components/SalonAvatar';

import BottomTabBar from '../../../components/bottomTabBar';

export default class AppointmentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let title = (
      <Text style={{
        fontSize: 17, lineHeight: 22, fontFamily: 'Roboto-Medium', color: '#FFFFFF',
      }}
      >All Providers
      </Text>);

    if (params && 'filterProvider' in params) {
      title = (
        <View style={{ flexDirection: 'row' }}>
          <SalonAvatar
            wrapperStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              marginRight: 6,
            }}
            width={20}
            borderWidth={3}
            borderColor="white"
            image={{ uri: 'https://qph.fs.quoracdn.net/main-qimg-60b27864c5d69bdce69e6413b9819214' }}
          />
          <Text style={{
          fontSize: 17, lineHeight: 22, fontFamily: 'Roboto-Medium', color: '#FFFFFF',
        }}
          >{params.filterProvider.fullName}
          </Text>
        </View>
      );
    }

    return {
      header: (
        <View style={{
          height: 63,
          paddingBottom: 10,
          backgroundColor: '#115ECD',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
        >
          <TouchableOpacity
            style={{
              flex: 1 / 5,
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              marginLeft: 16,
            }}
            onPress={() => navigation.state.params.onPressMenu()}
          >
            <Icon
              name="bars"
              type="regular"
              color="white"
              size={19}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 3 / 5,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
            onPress={() => navigation.state.params.onPressTitle()}
          >
            {title}
            <Icon
              style={{ marginLeft: 5 }}
              name="caretDown"
              type="regular"
              color="white"
              size={17}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1 / 5,
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 16,
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.state.params.onPressEllipsis()}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                name="ellipsisH"
                type="regular"
                color="white"
                size={22}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.state.params.onPressCalendar()}
              style={{
                marginLeft: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                name="calendar"
                type="regular"
                color="white"
                size={19}
              />
            </TouchableOpacity>
          </View>
        </View>
      ),
      // headerLeft: (

      // ),
      // headerRight: (

      // ),
    };
  };

  constructor(props) {
    super(props);

    let filterProvider = false;
    if ('params' in this.props.navigation.state && 'filterProvider' in this.props.navigation.state.params) {
      filterProvider = this.props.navigation.state.params.filterProvider;
    }

    this.state = {
      visible: false,
      filterProvider,
      visibleNewAppointment: false,
      visibleAppointment: false,
      selectedDate: moment(),
      calendarPickerMode: 'day',

    };

    this.props.navigation.setParams({
      onPressMenu: this.onPressMenu,
      onPressEllipsis: this.onPressEllipsis,
      onPressCalendar: this.onPressCalendar,
      onPressTitle: this.onPressTitle,
    });
  }



  componentWillMount() {
    if (!this.state.filterProvider) {
      this.props.appointmentCalendarActions.getAppoinmentsCalendar(this.state.selectedDate.format('YYYY-MM-DD'));
    }
  }

  componentDidMount() {
  }

  onPressMenu = () => alert('Not Implemented');

  onPressEllipsis = () => this.props.navigation.navigate('ApptBookViewOptions');

  onPressCalendar = () => alert('Not Implemented');

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', { dismissOnSelect: true, onChangeProvider: this.selectFilterProvider });

  selectFilterProvider = filterProvider => {
    this.props.navigation.setParams({ filterProvider })
    this.setState({ filterProvider })
  };

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

  handleDateChange = (startDate, endDate) => {
    if (this.state.filterProvider) {
      if (startDate === endDate) {
        this.props.appointmentCalendarActions.setProviderScheduleDates([moment(startDate)]);
        this.props.appointmentCalendarActions.getProviderCalendar(
          this.state.filterProvider.id,
          startDate.format('YYYY-MM-DD'),
          startDate.format('YYYY-MM-DD'),
        );
      } else {
        const diff = endDate.diff(startDate, 'days');
        const dates = [];
        for (let i = 0; i <= diff; i += 1) {
          dates.push(moment(startDate.add(1, 'days')));
        }
        this.props.appointmentCalendarActions.setProviderScheduleDates(dates);
        // debugger //eslint-disable-line
        this.props.appointmentCalendarActions.getProviderCalendar(
          this.props.navigation.state.params.filterProvider.id,
          startDate.format('YYYY-MM-DD'),
          startDate.add(1, 'weeks').format('YYYY-MM-DD'),
        );
      }
    } else {
      this.props.appointmentCalendarActions.getAppoinmentsCalendar(this.state.selectedDate.format('YYYY-MM-DD'));
    }
    this.setState({ selectedDate: startDate });
  }

  render() {
    const {
      apptGridSettings, providerAppointments, isLoading, dates,
    } = this.props.appointmentScreenState;
    const { appointments } = this.props.appointmentState;
    const { providers } = this.props.providersState;

    let calendar = (
      <SalonCalendar
        apptGridSettings={apptGridSettings}
        dataSource={providerAppointments}
        appointments={appointments}
        providers={providers}
        onDrop={this.props.appointmentActions.postAppointmentMove}
        onResize={this.props.appointmentActions.postAppointmentResize}
      />
    );

    if (this.state.filterProvider) {
      calendar = this.state.calendarPickerMode === 'week' ? (
        <SalonWeekCalendar
          apptGridSettings={apptGridSettings}
          dataSource={providerAppointments}
          appointments={appointments}
          displayMode={this.state.calendarPickerMode}
          dates={dates}
          onDrop={this.props.appointmentActions.postAppointmentMove}
        />
      ) : (
        <SalonDayCalendar
          apptGridSettings={apptGridSettings}
          dataSource={providerAppointments}
          appointments={appointments}
          displayMode={this.state.calendarPickerMode}
          dates={dates}
          onDrop={this.props.appointmentActions.postAppointmentMove}
        />
      );
    }
    return (
      <View style={{ flex: 1 }}>

        <SalonDatePickerBar
          calendarColor="#FFFFFF"
          mode={this.state.calendarPickerMode}
          onCalendarSelected={() => this.setState({ visible: true })}
          onDateChange={this.handleDateChange}
          selectedDate={this.state.selectedDate}
        />

        {
          isLoading ?
            <ActivityIndicator size="large" color="#0000ff" /> : <View style={{ flex: 1 }}>{calendar}</View>
      }
        {
        this.state.filterProvider ?
          <ChangeViewFloatingButton handlePress={(isWeek) => {
            const calendarPickerMode = isWeek ? 'week' : 'day';
              this.setState({ calendarPickerMode });
            }}
          /> : null
        }

        <SalonDatePickerSlide
          mode={this.state.calendarPickerMode}
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
