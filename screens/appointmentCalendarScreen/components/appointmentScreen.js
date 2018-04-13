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

    if (params && 'filterProvider' in params && params.filterProvider !== null) {
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

    let filterProvider = null;
    if ('params' in this.props.navigation.state && 'filterProvider' in this.props.navigation.state.params) {
      filterProvider = this.props.navigation.state.params.filterProvider;
    }

    this.state = {
      visible: false,
      filterProvider,
      visibleNewAppointment: false,
      visibleAppointment: false,
      selectedDate: moment(),
      endDate: moment(),
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
    if (this.state.filterProvider && this.state.filterProvider !== null) {
      this.props.appointmentCalendarActions.getAppoinmentsCalendar(this.state.selectedDate.format('YYYY-MM-DD'));
    } else {
      const { selectedDate, endDate, calendarPickerMode } = this.state;
      this.handleDateChange(selectedDate, endDate, calendarPickerMode);
    }
  }

  componentDidMount() {
  }

  onPressMenu = () => alert('Not Implemented');

  onPressEllipsis = () => this.props.navigation.navigate('ApptBookViewOptions');

  onPressCalendar = () => alert('Not Implemented');

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', { dismissOnSelect: true, onChangeProvider: this.selectFilterProvider });

  selectFilterProvider = (filterProvider) => {
    if (filterProvider === 'all') {
      this.props.navigation.setParams({ filterProvider: null });
      this.setState({ filterProvider: null }, () => this.handleDateChange(this.state.selectedDate));
    } else {
      this.props.navigation.setParams({ filterProvider });
      this.setState({ filterProvider }, () => this.handleDateChange(this.state.selectedDate));
    }
    // const { selectedDate, endDate, calendarPickerMode } = this.state;
    // this.handleDateChange(selectedDate, endDate, calendarPickerMode);
  };

  gotToSales = () => {
    alert('Not Implemented');
  }

  gotToQueue = () => {
    alert('Not Implemented');
  }

  gotToApptBook = () => {
    // this.setState({ visibleNewAppointment: true, visibleAppointment: false });
    alert('Not Implemented');
  }

  gotToClients = () => {
    // this.props.navigation.navigate('Clients');
    alert('Not Implemented');
  }

  gotToScoreCard = () => {
    // this.setState({ visibleAppointment: true, visibleNewAppointment: false });
    alert('Not Implemented');
  }

  handleDateChange = (selectedDate, endDate, calendarPickerMode) => {
    if (!selectedDate) {
      selectedDate = this.state.selectedDate;
    }
    if (!endDate) {
      endDate = this.state.endDate;
    }
    if (!calendarPickerMode) {
      calendarPickerMode = this.state.calendarPickerMode;
    }
    // this.setState({ selectedDate, endDate, calendarPickerMode });
    if (this.state.filterProvider && this.state.filterProvider !== null) {
      if (calendarPickerMode === 'week') {
        const dates = [];
        // endDate.add(1, 'week');
        for (let i = 0; i < 7; i += 1) {
          dates.push(moment(endDate.add(1, 'days')));
        }

        this.props.appointmentCalendarActions.setProviderScheduleDates(dates);
        // this.props.appointmentCalendarActions.getProviderCalendar(
        //   this.state.filterProvider.id,
        //   startDate.format('YYYY-MM-DD'),
        //   startDate.format('YYYY-MM-DD'),
        // );
      } else {
        this.props.appointmentCalendarActions.setProviderScheduleDates([moment(selectedDate)]);
      }
    }
    this.setState({ selectedDate, endDate });
    this.getCalendarData();
  }

  getCalendarData = () => {
    const {
      selectedDate,
      endDate,
      filterProvider,
      calendarPickerMode,
    } = this.state;

    if (filterProvider && filterProvider !== null) {
      if (calendarPickerMode === 'week') {
        this.props.appointmentCalendarActions.getProviderCalendar(
          this.props.navigation.state.params.filterProvider.id,
          moment(selectedDate).format('YYYY-MM-DD'),
          moment(endDate).format('YYYY-MM-DD'),
        );
      } else {
        this.props.appointmentCalendarActions.getProviderCalendar(
          this.props.navigation.state.params.filterProvider.id,
          moment(selectedDate).format('YYYY-MM-DD'),
          moment(selectedDate).format('YYYY-MM-DD'),
        );
      }
    } else {
      this.props.appointmentCalendarActions.getAppoinmentsCalendar(moment(selectedDate).format('YYYY-MM-DD'));
    }
  }

  render() {
    const {
      apptGridSettings, providerAppointments, providerSchedule, isLoading, dates,
    } = this.props.appointmentScreenState;
    const { appointments } = this.props.appointmentState;
    const { providers } = this.props.appointmentScreenState;
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

    if (this.state.filterProvider && this.state.filterProvider !== null) {
      calendar = this.state.calendarPickerMode === 'week' ? (
        <SalonWeekCalendar
          apptGridSettings={apptGridSettings}
          dataSource={providerSchedule}
          appointments={appointments}
          displayMode={this.state.calendarPickerMode}
          dates={dates}
          onDrop={this.props.appointmentActions.postAppointmentMove}
        />
      ) : (
        <SalonDayCalendar
          apptGridSettings={apptGridSettings}
          dataSource={providerSchedule}
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
          onDateChange={(selectedDate, endDate) => this.handleDateChange(selectedDate, endDate, this.state.calendarPickerMode)}
          selectedDate={moment(this.state.selectedDate)}
        />

        {
          isLoading ?
            <ActivityIndicator size="large" color="#0000ff" /> : <View style={{ flex: 1 }}>{calendar}</View>
        }
        { this.state.filterProvider ?
          <ChangeViewFloatingButton handlePress={(isWeek) => {
            const calendarPickerMode = isWeek ? 'week' : 'day';
            const { selectedDate, endDate } = this.state;
            this.setState({ calendarPickerMode });
            this.handleDateChange(selectedDate, endDate, calendarPickerMode);
            // this.handleDateChange(this.state.selectedDate, null, calendarPickerMode);
          }}
        /> : null
      }

        <SalonDatePickerSlide
          mode={this.state.calendarPickerMode}
          visible={this.state.visible}
          selectedDate={moment(this.state.selectedDate)}
          onHide={() => {
            this.setState({ visible: false });
          }}
          onDateSelected={(date) => {
            this.setState({ visible: false });
            this.handleDateChange(date);
          }}
          onPressArrowLeft={() => {
            this.setState({ selectedDate: moment(this.state.selectedDate).subtract(1, this.state.calendarPickerMode) });
          }}
          onPressArrowRight={() => {
            this.setState({ selectedDate: moment(this.state.selectedDate).add(1, this.state.calendarPickerMode) });
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
