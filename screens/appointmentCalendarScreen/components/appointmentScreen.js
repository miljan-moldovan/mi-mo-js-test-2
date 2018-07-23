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
import { getEmployeePhoto } from '../../../utilities/apiWrapper';
import ApptCalendarHeader from './ApptCalendarHeader';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonToast from './SalonToast';
import NewApptSlide from '../../../components/slidePanels/NewApptSlide';

export default class AppointmentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let currentFilter = 'All Providers';

    if (params && 'currentFilter' in params) {
      switch (params.currentFilter) {
        case 'deskStaff':
          currentFilter = 'Desk Staff';
          break;
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
            image={{ uri: getEmployeePhoto(params.filterProvider.id) }}
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

  state = {
    visible: false,
    isBookingNewAppt: false,
    newAppointmentFilter: 0,
    newApptProvider: null,
    newApptDate: moment(),
    newApptStartTime: moment().startOf('day').add('7', 'hours'),
    visibleNewAppointment: false,
    visibleAppointment: false,
    isLoading: true,
    bufferVisible: false,
    isAlertVisible: false,
    selectedAppointment: null,
  };

  componentDidMount() {
    // super(props);
    const { props } = this;
    props.appointmentCalendarActions.setStoreWeeklySchedule();
    const params = props.navigation.state.params || {};
    const filterProvider = params.filterProvider || 'all';

    this.props.navigation.setParams({
      onPressMenu: this.onPressMenu,
      onPressEllipsis: this.onPressEllipsis,
      onPressCalendar: this.onPressCalendar,
      onPressTitle: this.onPressTitle,
      currentFilter: this.props.appointmentScreenState.selectedProvider,
    });

    this.props.appointmentCalendarActions.setGridView();
  }

  onPressMenu = () => alert('Not Implemented');

  onPressEllipsis = () => this.props.navigation.navigate('ApptBookViewOptions');

  onPressCalendar = () => alert('Not Implemented');

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', {
    dismissOnSelect: true,
    onChangeFilter: this.selectFilter,
  });

  onAvailabilityCellPressed = (time) => {
    const {
      startDate,
      selectedProvider,
    } = this.props.appointmentScreenState;

    const startTime = moment(time, 'HH:mm A');
    if (selectedProvider === 'all') {
      const newApptProvider = {
        isFirstAvailable: true,
        name: 'First',
        lastName: 'Available',
      };
      this.props.newAppointmentActions.setBookedBy(newApptProvider);
      this.props.newAppointmentActions.setDate(startDate);
    }
    this.props.newAppointmentActions.setStartTime(startTime);

    this.setState({
      newAppointmentFilter: 0,
      visibleNewAppointment: true,
    });
  }

  onCardPressed = (appointment) => {
    this.props.modifyApptActions.setSelectedAppt(appointment);
    this.setState({
      visibleAppointment: true,
    });
  }

  // onCalendarCellPressed = (cellId, colData) => {
  //   const {
  //     startDate,
  //     selectedFilter,
  //     selectedProvider,
  //   } = this.props.appointmentScreenState;
  //   const { newAppointmentActions } = this.props;
  //   const startTime = moment(cellId, 'HH:mm A');

  //   this.newApptSlide.resetForm();
  //   const newState = {
  //     newApptStartTime: startTime,
  //   };
  //   if (selectedFilter === 'providers') {
  //     if (selectedProvider === 'all') {
  //       newState.newApptProvider = colData;
  //       newState.newApptDate = startDate;
  //     } else {
  //       newState.newApptProvider = selectedProvider;
  //       newState.newApptDate = colData;
  //     }
  //   } else {
  //     newState.newApptProvider = null;
  //     newState.newApptDate = startDate;
  //   }


  //   this.setState({
  //     newAppointmentFilter: 0,
  //     visibleNewAppointment: true,
  //     ...newState,
  //   });
  // }

  onCalendarCellPressed = (cellId, colData) => {
    const {
      startDate,
      selectedFilter,
      selectedProvider,
    } = this.props.appointmentScreenState;
    const { newAppointmentActions } = this.props;
    const startTime = moment(cellId, 'HH:mm A');

    newAppointmentActions.cleanForm();
    // const newState = {
    //   newApptStartTime: startTime,
    // };
    if (selectedFilter === 'providers') {
      if (selectedProvider === 'all') {
        newAppointmentActions.setBookedBy(colData);
        newAppointmentActions.setDate(startDate);
      } else {
        newAppointmentActions.setBookedBy(selectedProvider);
        newAppointmentActions.setDate(colData);
      }
    } else {
      newAppointmentActions.setBookedBy(null);
      newAppointmentActions.setDate(startDate);
    }
    newAppointmentActions.setStartTime(startTime);
    newAppointmentActions.isBookingQuickAppt(true);
    this.setState({
      newAppointmentFilter: 0,
      visibleNewAppointment: true,
    });
  }

  setSelectedProvider = (provider) => {
    this.props.appointmentCalendarActions.setPickerMode('week');
    this.props.appointmentCalendarActions.setSelectedProvider(provider);
    this.props.appointmentCalendarActions.setGridView();
    this.props.navigation.setParams({
      filterProvider: provider,
    });
  }

  setSelectedDay = (day) => {
    this.props.appointmentCalendarActions.setPickerMode('day');
    this.props.appointmentCalendarActions.setProviderScheduleDates(day, day);
  }

  selectFilterProvider = (filterProvider) => {
    this.props.appointmentCalendarActions.setGridView();
    requestAnimationFrame(() => this.manageBuffer(false));
  }

  selectFilter = (filter, filterProvider = null) => {
    switch (filter) {
      case 'deskStaff': {
        if (filterProvider === 'all') {
          this.props.navigation.setParams({ filterProvider: null, currentFilter: 'deskStaff' });
          this.props.appointmentCalendarActions.setPickerMode('day');
        } else {
          this.props.navigation.setParams({ filterProvider, currentFilter: 'deskStaff' });
        }
        this.props.appointmentCalendarActions.setSelectedFilter('deskStaff');
        this.props.appointmentCalendarActions.setSelectedProvider(filterProvider);
        break;
      }
      case 'rooms':
      case 'resources': {
        this.props.navigation.setParams({ filterProvider: null, currentFilter: filter });
        this.props.appointmentCalendarActions.setPickerMode('day');
        this.props.appointmentCalendarActions.setSelectedFilter(filter);
        break;
      }
      case 'providers':
      default: {
        if (filterProvider === 'all') {
          this.props.navigation.setParams({ filterProvider: null, currentFilter: 'providers' });
          this.props.appointmentCalendarActions.setPickerMode('day');
        } else {
          this.props.navigation.setParams({ filterProvider, currentFilter: 'providers' });
        }
        this.props.appointmentCalendarActions.setSelectedFilter('providers');
        this.props.appointmentCalendarActions.setSelectedProvider(filterProvider);

        break;
      }
    }
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
      showToast,
      filterOptions,
      rooms,
      roomAppointments,
      resources,
      deskStaff,
      resourceAppointments,
      storeSchedule,
    } = this.props.appointmentScreenState;
    const { availability, appointments, blockTimes } = this.props;
    const { bufferVisible } = this.state;
    const { appointmentCalendarActions, appointmentActions } = this.props;
    const isLoading = this.props.appointmentScreenState.isLoading
      || this.props.appointmentScreenState.isLoadingSchedule;
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
      case 'deskStaff':
      case 'providers': {
        isDate = selectedProvider !== 'all';
        headerData = isDate ? dates : providers;
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
          blockTimes={blockTimes}
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
          setSelectedProvider={this.setSelectedProvider}
          setSelectedDay={this.setSelectedDay}
          storeSchedule={storeSchedule}
          providers={providers}
        />
        {
          isLoading ?
            <View style={{
              position: 'absolute', top: 60, paddingBottom: 60, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cccccc4d',
            }}
            ><ActivityIndicator />
            </View> : null
        }
        {selectedFilter === 'providers' && selectedProvider !== 'all' && (
          <ChangeViewFloatingButton
            pickerMode={pickerMode}
            handlePress={() => {
              const newPickerMode = pickerMode === 'week' ? 'day' : 'week';
              this.props.appointmentCalendarActions.setPickerMode(newPickerMode);
              if (startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD')) {
                this.props.appointmentCalendarActions.setGridView();
              }
            }}
          />
        )}

        <NewApptSlide
          ref={(newApptSlide) => {
            this.newApptSlide = newApptSlide;
            return newApptSlide;
          }}
          navigation={this.props.navigation}
          visible={this.state.visibleNewAppointment}
          startTime={this.state.newApptStartTime}
          provider={this.state.newApptProvider}
          filterProviders={providers}
          hide={() => this.setState({ visibleNewAppointment: false })}
          show={() => this.setState({ visibleNewAppointment: true })}
          handleBook={() => {
            const callback = () => {
              this.setState({
                visibleNewAppointment: false,
                isBookingNewAppt: false,
              }, () => {
                this.props.appointmentCalendarActions.setGridView();
              });
            };
            this.props.newAppointmentActions.quickBookAppt(callback);
          }}
        />

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

        {/* <SalonNewAppointmentSlide
          navigation={this.props.navigation}
          selectedFilter={this.state.newAppointmentFilter}
          isLoading={this.props.newAppointmentState.isLoading}
          hasConflicts={this.props.newAppointmentState.conflicts.length > 0}
          date={this.props.newAppointmentState.date}
          startTime={this.props.newAppointmentState.startTime}
          endTime={this.props.newAppointmentState.endTime}
          isProviderRequested={this.props.newAppointmentState.mainRequested}
          client={this.props.newAppointmentState.client}
          provider={this.props.newAppointmentState.bookedByEmployee}
          service={this.props.newAppointmentState.service}
          visible={false}
          onHide={() => {
            this.setState({ visibleNewAppointment: false });
          }}
          show={() => this.setState({ visibleNewAppointment: true })}
          handlePressBook={() => {
            const callback = () => {
              this.setState({ visibleNewAppointment: false });
              this.props.appointmentCalendarActions.setGridView();
            };
            this.props.newAppointmentActions.quickBookAppt(callback);
          }}
          handlePressMore={() => {
            const {
              date,
              service,
              client,
              startTime,
              bookedByEmployee,
              mainRequested,
            } = this.props.newAppointmentState;

            if (!bookedByEmployee) {
              return alert('Please select a provider first');
            }
            const fromTime = moment(startTime, 'HH:mm');
            const timeToAdd = service !== null ? moment.duration(service.maxDuration) : moment.duration(apptGridSettings.step, 'min');
            const toTime = moment(fromTime).add(timeToAdd);
            const newAppt = {
              date,
              bookedByEmployee,
              service,
              client,
              fromTime,
              toTime,
              requested: mainRequested,
            };
            this.setState({ visibleNewAppointment: false });
            this.props.navigation.navigate('NewAppointment', { newAppt });
          }}
          handlePressProvider={(provider) => {
            this.props.newAppointmentActions.setBookedBy(provider);
            this.setState({ visibleNewAppointment: true }, this.props.newAppointmentActions.checkConflicts());
          }}
          handlePressService={(service) => {
            this.props.newAppointmentActions.setNewApptService(service);
            this.setState({ visibleNewAppointment: true }, this.props.newAppointmentActions.checkConflicts());
          }}
          handlePressClient={(client) => {
            this.props.newAppointmentActions.setNewApptClient(client);
            this.setState({ visibleNewAppointment: true }, this.props.newAppointmentActions.checkConflicts());
          }}
          handlePressConflicts={() => {
            const { newAppointmentState: state } = this.props;
            this.setState({ visibleNewAppointment: false });
            this.props.navigation.navigate('Conflicts', {
              startTime: state.startTime,
              endTime: state.endTime,
              date: state.body.date,
              conflicts: state.conflicts,
              handleGoBack: () => {
                this.setState({ visibleNewAppointment: true });
              },
            });
          }}
          handleChangeRequested={(requested) => {
            this.props.newAppointmentActions.setNewApptRequested(!requested);
          }}
          filterProviders={providers}
        /> */}

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
