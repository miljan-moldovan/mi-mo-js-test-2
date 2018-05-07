import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from '../../../components/UI/Icon';
import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import SalonNewAppointmentSlide from '../../../components/slidePanels/SalonNewAppointmentSlide';
import SalonAppointmentSlide from '../../../components/slidePanels/SalonAppointmentSlide';
import SalonAvatar from '../../../components/SalonAvatar';
import apiWrapper from '../../../utilities/apiWrapper';
import ApptCalendarHeader from './ApptCalendarHeader';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

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
            image={{ uri: apiWrapper.getEmployeePhoto(params.filterProvider.id) }}
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
          title={title}
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
    props.appointmentCalendarActions.setStoreWeeklySchedule();
    let filterProvider = 'all';
    const { params } = this.props.navigation.state;
    if (params !== undefined) {
      if ('filterProvider' in params) {
        filterProvider = this.props.navigation.state.params.filterProvider;
      }
    }

    this.state = {
      visible: false,
      newAppointmentFilter: 0,
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

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', {
    dismissOnSelect: true,
    onChangeProvider: this.selectFilterProvider,
    onChangeRoom: this.selectFilterRoom,
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

    this.setState({ newAppointmentFilter: 0, visibleNewAppointment: true });
  }

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

  selectFilterRoom = room => alert(`Selected Room ${room.name}s`)

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
          availability={availability}
          startDate={startDate}
          isLoading={isLoading}
        />
        {
           isLoading ?
             <View style={{
 position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cccccc4d',
}}
             ><ActivityIndicator />
             </View> : null
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
          onHide={() => this.setState({ visible: false })}
          onDateSelected={(startDate, endDate) => {
            this.setState({ visible: false });

            this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
            this.props.appointmentCalendarActions.setGridView();
          }}
        />

        <SalonNewAppointmentSlide
          navigation={this.props.navigation}
          selectedFilter={this.state.newAppointmentFilter}
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
              // this.props.appointmentCalendarActions.getCalendarData();
            };
            this.props.newAppointmentActions.bookNewAppt(callback);
          }}
          handlePressMore={() => {
              this.setState({ visibleNewAppointment: false });
              this.props.navigation.navigate('NewAppointment');
          }}
          handlePressProvider={() => {
            this.props.navigation.navigate('Providers', {
              actionType: 'update',
              dismissOnSelect: true,
              onChangeProvider: (provider) => {
                this.props.newAppointmentActions.setNewApptEmployee(provider);
                this.setState({ visibleNewAppointment: true });
              },
            });
          }}
          handlePressService={() => {
            this.props.navigation.navigate('Services', {
              actionType: 'update',
              dismissOnSelect: true,
              onChangeService: (service) => {
                this.props.newAppointmentActions.setNewApptService(service);
                this.setState({ visibleNewAppointment: true });
              },
            });
          }}
          handlePressClient={() => {
            this.props.navigation.navigate('ChangeClient', {
              actionType: 'update',
              dismissOnSelect: true,
              onChangeClient: (client) => {
                this.props.newAppointmentActions.setNewApptClient(client);
                this.setState({ visibleNewAppointment: true });
              },
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
