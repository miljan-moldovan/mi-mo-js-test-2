import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from '../../../components/UI/Icon';
import SalonCalendar from '../../../components/SalonCalendar';
import SalonProviderCalendar from '../../../components/SalonProviderCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import SalonNewAppointmentSlide from '../../../components/slidePanels/SalonNewAppointmentSlide';
import SalonAppointmentSlide from '../../../components/slidePanels/SalonAppointmentSlide';
import SalonAvatar from '../../../components/SalonAvatar';

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
    props.appointmentCalendarActions.setStoreWeeklySchedule();
    let filterProvider = null;
    if ('params' in this.props.navigation.state && 'filterProvider' in this.props.navigation.state.params) {
      filterProvider = this.props.navigation.state.params.filterProvider;
    }

    this.state = {
      visible: false,
      visibleNewAppointment: false,
      visibleAppointment: false,
      isLoading: true,
    };
    // props.appointmentCalendarActions.getAppoinmentsCalendar(this.state.selectedDate.format('YYYY-MM-DD'));

    this.props.navigation.setParams({
      onPressMenu: this.onPressMenu,
      onPressEllipsis: this.onPressEllipsis,
      onPressCalendar: this.onPressCalendar,
      onPressTitle: this.onPressTitle,
    });
    this.props.appointmentCalendarActions.setGridView();
  }

  componentWillUpdate(nextProps, nextState) {
    this.state.isLoading = nextProps.appointmentScreenState.isLoading || nextProps.appointmentScreenState.isLoadingSchedule;
  }

  onPressMenu = () => alert('Not Implemented');

  onPressEllipsis = () => this.props.navigation.navigate('ApptBookViewOptions');

  onPressCalendar = () => alert('Not Implemented');

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', { dismissOnSelect: true, onChangeProvider: this.selectFilterProvider });

  selectFilterProvider = (filterProvider) => {
    if (filterProvider === 'all') {
      this.props.navigation.setParams({ filterProvider: null });
      this.props.appointmentCalendarActions.setPickerMode('day');
    } else {
      this.props.navigation.setParams({ filterProvider });
    }

    this.props.appointmentCalendarActions.setSelectedProvider(filterProvider);
    this.props.appointmentCalendarActions.setGridView();
  }

  render() {
    const {
      dates,
      pickerMode,
      startDate,
      endDate,
      selectedProvider,
      providerSchedule,
      apptGridSettings,
      providerAppointments,
      providers,
      appointments,
      availability,
    } = this.props.appointmentScreenState;
    const { isLoading } = this.state;
    const isLoadingDone = !isLoading && apptGridSettings.numOfRow > 0 && providers && providers.length > 0;
    const headerData = selectedProvider === 'all' ? providers : dates;
    return (
      <View style={{ flex: 1 }}>
        <SalonDatePickerBar
          calendarColor="#FFFFFF"
          mode={pickerMode}
          onCalendarSelected={() => this.setState({ visible: true })}
          onDateChange={(startDate, endDate) => {
            this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
            this.props.appointmentCalendarActions.setGridView();
          }}
          selectedDate={moment(startDate)}
        />
        {
          isLoading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View> :
            <SalonCalendar
              apptGridSettings={apptGridSettings}
              dataSource={providerAppointments}
              appointments={appointments}
              headerData={headerData}
              onDrop={this.props.appointmentActions.postAppointmentMove}
              onResize={this.props.appointmentActions.postAppointmentResize}
              selectedProvider={selectedProvider}
              displayMode={pickerMode}
              providerSchedule={providerSchedule}
              availability={availability}
              startDate={startDate}
            />
        }
        {selectedProvider !== 'all' && (
          <ChangeViewFloatingButton
            handlePress={(isWeek) => {
              const pickerMode = isWeek ? 'week' : 'day';
              this.props.appointmentCalendarActions.setPickerMode(pickerMode);
            }}
          />
        )}

        <SalonDatePickerSlide
          mode={pickerMode}
          visible={this.state.visible}
          selectedDate={moment(startDate)}
          onHide={() => {
            this.setState({ visible: false });
          }}
          onDateSelected={(startDate, endDate) => {
            this.setState({ visible: false });

            this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
            this.props.appointmentCalendarActions.setGridView();
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
      </View>
    );
  }
}
