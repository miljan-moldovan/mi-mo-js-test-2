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
import ApptCalendarHeader from './ApptCalendarHeader';

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
        <ApptCalendarHeader
          {...title}
          onPressMenu={() => navigation.state.params.onPressMenu()}
          onPressTitle={() => navigation.state.params.onPressTitle()}
          onPressEllipsis={() => navigation.state.params.onPressEllipsis()}
          onPressCalendar={() => navigation.state.params.onPressCalendar()}
        />
      ),
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
  }

  componentWillMount() {
    this.getCalendarData();
  }

  componentWillUpdate(nextProps, nextState) {
    this.state.isLoading = nextProps.appointmentScreenState.isLoading;
  }

  onPressMenu = () => alert('Not Implemented');

  onPressEllipsis = () => this.props.navigation.navigate('ApptBookViewOptions');

  onPressCalendar = () => alert('Not Implemented');

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', {
    dismissOnSelect: true,
    onChangeProvider: this.selectFilterProvider,
  });

  onCalendarCellPressed = (cellId, colData) => {
    const {
      startDate,
      selectedProvider,
    } = this.props.appointmentScreenState;
    const startTime = moment(cellId, 'HH:mm A');
    const endTime = moment(startTime).add(15, 'minute');

    if (selectedProvider === 'all') {
      this.props.newAppointmentActions.setNewApptEmployee(colData);
      this.props.newAppointmentActions.setNewApptDate(startDate);
    } else {
      this.props.newAppointmentActions.setNewApptEmployee(selectedProvider);
      this.props.newAppointmentActions.setNewApptDate(colData);
    }
    this.props.newAppointmentActions.setNewApptTime(startTime, endTime);

    this.setState({ visibleNewAppointment: true });
  }

  selectFilterProvider = (filterProvider) => {
    if (filterProvider === 'all') {
      this.props.navigation.setParams({ filterProvider: null });
      this.props.appointmentCalendarActions.setPickerMode('day');
    } else {
      this.props.navigation.setParams({ filterProvider });
    }

    this.props.appointmentCalendarActions.setSelectedProvider(filterProvider);
    this.props.appointmentCalendarActions.getCalendarData();
  }

  getCalendarData = () => {
    const {
      startDate,
      endDate,
      selectedProvider,
      pickerMode,
    } = this.props.appointmentScreenState;

    if (selectedProvider && selectedProvider !== 'all') {
      if (pickerMode === 'week') {
        this.props.appointmentCalendarActions.getProviderCalendar(
          selectedProvider.id,
          moment(startDate).format('YYYY-MM-DD'),
          moment(endDate).format('YYYY-MM-DD'),
        );
      } else {
        this.props.appointmentCalendarActions.getProviderCalendar(
          selectedProvider.id,
          moment(startDate).format('YYYY-MM-DD'),
          moment(startDate).format('YYYY-MM-DD'),
        );
      }
    } else {
      this.props.appointmentCalendarActions.getAppoinmentsCalendar(moment(startDate).format('YYYY-MM-DD'));
    }
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
    } = this.props.appointmentScreenState;

    const { isLoading } = this.state;
    const { appointments } = this.props.appointmentState;
    const { providers } = this.props.appointmentScreenState;
    const isLoadingDone = !isLoading && apptGridSettings.numOfRow > 0 && providers && providers.length > 0;

    // if (selectedProvider !== 'all') {
    //   calendar = (
    //     <SalonProviderCalendar
    //       dates={dates}
    //       appointments={appointments}
    //       selectedProvider={selectedProvider}
    //       displayMode={pickerMode}
    //       apptGridSettings={apptGridSettings}
    //       dataSource={providerSchedule}
    //       onDrop={this.props.appointmentActions.postAppointmentMove}
    //     />
    //   );
    // }
    const headerData = selectedProvider === 'all' ? providers : dates;
    return (
      <View style={{ flex: 1 }}>
        <SalonDatePickerBar
          calendarColor="#FFFFFF"
          mode={pickerMode}
          onCalendarSelected={() => this.setState({ visible: true })}
          onDateChange={(startDate, endDate) => {
            this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
            this.props.appointmentCalendarActions.getCalendarData();
          }}
          selectedDate={moment(startDate)}
        />
        {
          isLoading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View> :
            <SalonCalendar
              onCellPressed={this.onCalendarCellPressed}
              apptGridSettings={apptGridSettings}
              dataSource={providerAppointments}
              appointments={appointments}
              headerData={headerData}
              onDrop={this.props.appointmentActions.postAppointmentMove}
              onResize={this.props.appointmentActions.postAppointmentResize}
              selectedProvider={selectedProvider}
              displayMode={pickerMode}
              providerSchedule={providerSchedule}
            />
        }
        {selectedProvider !== 'all' && (
          <ChangeViewFloatingButton
            handlePress={(isWeek) => {
              const pickerMode = isWeek ? 'week' : 'day';
              this.props.appointmentCalendarActions.setPickerMode(pickerMode);
              this.props.appointmentCalendarActions.getCalendarData();
            }}
          />
        )}

        <SalonDatePickerSlide
          mode={pickerMode}
          visible={this.state.visible}
          selectedDate={moment(startDate)}
          onHide={() => this.setState({ visible: false })}
          onDateSelected={(startDate, endDate) => {
            this.setState({ visible: false });

            this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
            this.props.appointmentCalendarActions.getCalendarData();
          }}
        />

        <SalonNewAppointmentSlide
          navigation={this.props.navigation}
          hasConflicts={this.props.newAppointmentState.hasConflicts}
          date={this.props.newAppointmentState.body.date}
          startTime={this.props.newAppointmentState.body.items[0].fromTime}
          endTime={this.props.newAppointmentState.body.items[0].toTime}
          isProviderRequested={this.props.newAppointmentState.body.items[0].requested}
          client={this.props.newAppointmentState.client}
          provider={this.props.newAppointmentState.employee}
          service={this.props.newAppointmentState.service}
          visible={this.state.visibleNewAppointment}
          onHide={() => {
            this.setState({ visibleNewAppointment: false });
          }}
          handlePressBook={() => {
            const callback = () => {
              this.setState({ visibleNewAppointment: false });
              this.props.appointmentCalendarActions.getCalendarData();
            };
            this.props.newAppointmentActions.bookNewAppt(callback);
          }}
          handlePressProvider={() => {
            this.props.navigation.navigate('Providers', {
              actionType: 'update',
              dismissOnSelect: true,
              onChangeProvider: provider => this.props.newAppointmentActions.setNewApptEmployee(provider),
            });
          }}
          handlePressService={() => {
            this.props.navigation.navigate('Services', {
              actionType: 'update',
              dismissOnSelect: true,
              onChangeService: service => this.props.newAppointmentActions.setNewApptService(service),
            });
          }}
          handlePressClient={() => {
            this.props.navigation.navigate('ChangeClient', {
              actionType: 'update',
              dismissOnSelect: true,
              onChangeClient: client => this.props.newAppointmentActions.setNewApptClient(client),
            });
          }}
          handleChangeRequested={(requested) => {
            this.props.newAppointmentActions.setNewApptRequested(requested);
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
