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
