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
import SalonToast from './SalonToast';

export default class AppointmentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let currentFilter = 'All Providers';

    if (params && 'currentFilter' in params) {
      switch (params.currentFilter) {
        case 'rooms':
          currentFilter = 'All Rooms';
          break;
        case 'resources':
          currentFilter = 'All Resources';
          break;
        case 'all':
        default:
          currentFilter = 'All Providers';
          break;
      }
    }
    let title = (
      <Text style={{
        fontSize: 17, lineHeight: 22, fontFamily: 'Roboto-Medium', color: '#FFFFFF',
      }}
      >{currentFilter}
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
      tabBarVisible: params && params.hasOwnProperty('tabBarVisible') ? params.tabBarVisible : true,
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
      bufferVisible: false,
      isAlertVisible: false,
      selectedAppointment: null,
    };

    this.props.navigation.setParams({
      onPressMenu: this.onPressMenu,
      onPressEllipsis: this.onPressEllipsis,
      onPressCalendar: this.onPressCalendar,
      onPressTitle: this.onPressTitle,
      currentFilter: this.props.appointmentScreenState.selectedProvider,
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
    onChangeFilter: this.selectFilter,
  });

  onAvailabilityCellPressed = (time) => {
    const {
      startDate,
      selectedProvider,
    } = this.props.appointmentScreenState;

    const startTime = moment(time, 'HH:mm A');
    const endTime = moment(startTime).add(15, 'minute');

    if (selectedProvider === 'all') {
      this.props.newAppointmentActions.setNewApptEmployee({
        isFirstAvailable: true,
        name: 'First',
        lastName: 'Available',
      });
      this.props.newAppointmentActions.setNewApptDate(startDate);
    }

    this.props.newAppointmentActions.setNewApptTime(startTime, endTime);

    this.setState({ newAppointmentFilter: 0, visibleNewAppointment: true });
  }

  onCardPressed = (appointment) => {
    console.log('appt', appointment);
    this.props.modifyApptActions.setSelectedAppt(appointment);
    this.setState({
      visibleAppointment: true,
    });
  }

  onCalendarCellPressed = (cellId, colData) => {
    const {
      startDate,
      selectedFilter,
      selectedProvider,
    } = this.props.appointmentScreenState;
    const startTime = moment(cellId, 'HH:mm A');
    const endTime = moment(startTime).add(15, 'minute');

    if (selectedFilter === 'providers') {
      if (selectedProvider === 'all') {
        this.props.newAppointmentActions.setNewApptEmployee(colData);
        this.props.newAppointmentActions.setNewApptDate(startDate);
      } else {
        this.props.newAppointmentActions.setNewApptEmployee(selectedProvider);
        this.props.newAppointmentActions.setNewApptDate(colData);
      }
    } else {
      this.props.newAppointmentActions.setNewApptEmployee(null);
      this.props.newAppointmentActions.setNewApptDate(startDate);
    }

    this.props.newAppointmentActions.setNewApptTime(startTime, endTime);
    this.setState({ newAppointmentFilter: 0, visibleNewAppointment: true });
  }

  selectFilterProvider = (filterProvider) => {
    if (filterProvider === 'all') {
      this.props.navigation.setParams({ filterProvider: null, currentFilter: 'providers' });
      this.props.appointmentCalendarActions.setPickerMode('day');
    } else {
      this.props.navigation.setParams({ filterProvider, currentFilter: 'providers' });
    }
    this.props.appointmentCalendarActions.setSelectedFilter('providers');
    this.props.appointmentCalendarActions.setSelectedProvider(filterProvider);
    this.props.appointmentCalendarActions.setGridView();
    requestAnimationFrame(() => this.manageBuffer(false));
  }

  selectFilter = (filter) => {
    this.props.navigation.setParams({ filterProvider: null, currentFilter: filter });
    this.props.appointmentCalendarActions.setPickerMode('day');
    this.props.appointmentCalendarActions.setSelectedFilter(filter);
    this.props.appointmentCalendarActions.setGridView();
    requestAnimationFrame(() => this.manageBuffer(false));
  }

  manageBuffer = (bufferVisible) => {
    if (this.state.bufferVisible !== bufferVisible) {
      this.setState({ bufferVisible });
      requestAnimationFrame(() => this.props.navigation.setParams({ tabBarVisible: !bufferVisible }));
    }
  }

  render() {
    const {
      dates,
      pickerMode,
      startDate,
      endDate,
      selectedProvider,
      selectedFilter,
      providerSchedule,
      apptGridSettings,
      providerAppointments,
      providers,
      appointments,
      availability,
      showToast,
      filterOptions,
      rooms,
      roomAppointments,
      resources,
      deskStaff,
      resourceAppointments,
    } = this.props.appointmentScreenState;

    const { isLoading, bufferVisible } = this.state;
    const { appointmentCalendarActions, appointmentActions } = this.props;
    const isLoadingDone = !isLoading && apptGridSettings.numOfRow > 0 && providers && providers.length > 0;
    let headerData = null;
    let dataSource = null;
    let isDate = false;
    switch (selectedFilter) {
      case 'rooms': {
        headerData = rooms;
        dataSource = roomAppointments;
        break;
      }
      case 'resources': {
        headerData = resources;
        dataSource = resourceAppointments;
        break;
      }
      case 'providers': {
        isDate = selectedProvider !== 'all';
        headerData = isDate ? dates : providers;
        dataSource = providerAppointments;
        break;
      }
      case 'deskStaff': {
        headerData = deskStaff;
        dataSource = providerAppointments;
        break;
      }
      default:
        break;
    }

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
          onPressAvailability={this.onAvailabilityCellPressed}
          onCellPressed={this.onCalendarCellPressed}
          onCardPressed={this.onCardPressed}
          apptGridSettings={apptGridSettings}
          dataSource={dataSource}
          appointments={appointments}
          headerData={headerData}
          isDate={isDate}
          isRoom={selectedFilter === 'rooms'}
          isResource={selectedFilter === 'resources'}
          onDrop={this.props.appointmentActions.postAppointmentMove}
          onResize={this.props.appointmentActions.postAppointmentResize}
          selectedFilter={selectedFilter}
          selectedProvider={selectedProvider}
          displayMode={pickerMode}
          providerSchedule={providerSchedule}
          availability={availability}
          startDate={startDate}
          isLoading={isLoading}
          bufferVisible={bufferVisible}
          manageBuffer={this.manageBuffer}
          filterOptions={filterOptions}
        />
        {
           isLoading ?
             <View style={{
              position: 'absolute', top: 60, paddingBottom: 60, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cccccc4d',
              }}
             ><ActivityIndicator />
             </View> : null
        }
        {selectedProvider !== 'all' && selectedFilter === 'providers' && (
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
          markedDates={{
            [moment().format('YYYY-MM-DD')]: {
              customStyles: {
                container: {
                  borderWidth: 1,
                  borderColor: '#1DBF12',
                },
                text: {
                  fontFamily: 'Roboto',
                  fontWeight: '700',
                  color: '#1DBF12',
                },
              },
            },
          }}
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
          handlePressProvider={(provider) => {
            this.props.newAppointmentActions.setNewApptEmployee(provider);
            this.setState({ visibleNewAppointment: true });
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
            this.setState({ visibleNewAppointment: false });
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
          appointment={this.props.modifyApptState.appointment}
          onHide={() => {
            this.setState({ visibleAppointment: false });
          }}
          handleModify={() => {
            const { selectedAppointment } = this.state;
            this.setState({ visibleAppointment: false });
            this.props.navigation.navigate('ModifyAppointment');
          }}
        />
        {
          showToast ?
            <SalonToast type="success" description={showToast} hide={appointmentCalendarActions.hideToast} undo={appointmentActions.undoMove} btnRightText="OK" btnLeftText="UNDO" /> : null
        }
      </View>
    );
  }
}
