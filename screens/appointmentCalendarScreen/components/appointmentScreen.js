import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { filter } from 'lodash';

import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import SalonAppointmentSlide from '../../../components/slidePanels/SalonAppointmentSlide/index';
import SalonAvatar from '../../../components/SalonAvatar';
import ApptCalendarHeader from './ApptCalendarHeader';
import SalonToast from './SalonToast';
import NewApptSlide from '../../../components/NewApptSlide';
import { DefaultAvatar } from '../../../components/formHelpers';
import BookAnother from './bookAnother';
import SalonAlert from '../../../components/SalonAlert';

import styles from './styles';

class AppointmentScreen extends Component {
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
      <Text style={styles.titleText}>{currentFilter}
      </Text>);

    if (params && 'filterProvider' in params && params.filterProvider !== null) {
      const image = getEmployeePhotoSource(params.filterProvider);
      title = (
        <View style={styles.salonAvatarWrapperContainer}>
          <SalonAvatar
            wrapperStyle={styles.salonAvatarWrapper}
            width={20}
            borderWidth={3}
            borderColor="white"
            image={image}
            defaultComponent={(<DefaultAvatar
              size={20}
              provider={params.filterProvider}
              fontSize={8}
            />)}
          />
          <Text style={styles.titleText}>{params.filterProvider.fullName}
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
    newApptActiveTab: 0,
    newApptProvider: null,
    newApptStartTime: moment().startOf('day').add('7', 'hours'),
    visibleNewAppointment: false,
    visibleAppointment: false,
    bufferVisible: false,
    selectedAppointment: null,
    bookAnotherEnabled: false,
    screenHeight: 0,
    selectedApptId: -1,
    goToAppointmentId: null,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onPressMenu: this.onPressMenu,
      onPressEllipsis: this.onPressEllipsis,
      onPressCalendar: this.onPressCalendar,
      onPressTitle: this.onPressTitle,
      currentFilter: this.props.appointmentScreenState.selectedProvider,
    });

    this.props.appointmentCalendarActions.setGridView();
  }

  onPressMenu = () => {
    this.props.appointmentCalendarActions.setToast({
      description: 'Not Implemented',
      type: 'warning',
      btnRightText: 'DISMISS',
    });
  };

  onPressEllipsis = () => this.props.navigation.navigate('ApptBookViewOptions');

  onPressCalendar = () => {
    this.props.appointmentCalendarActions.setToast({
      description: 'Not Implemented',
      type: 'warning',
      btnRightText: 'DISMISS',
    });
  };

  onPressTitle = () => this.props.navigation.navigate('FilterOptions', {
    dismissOnSelect: true,
    onChangeFilter: this.selectFilter,
  });

  onAvailabilityCellPressed = (time) => {
    const {
      startDate,
      selectedProvider,
    } = this.props.appointmentScreenState;
    this.props.newAppointmentActions.cleanForm();
    const startTime = moment(time, 'hh:mm A');
    if (selectedProvider === 'all') {
      const newApptProvider = {
        id: 0,
        isFirstAvailable: true,
        name: 'First',
        lastName: 'Available',
      };
      this.props.newAppointmentActions.setQuickApptRequested(false);
      this.props.newAppointmentActions.setDate(startDate);
      this.props.newAppointmentActions.setMainEmployee(newApptProvider);
    }
    this.props.newAppointmentActions.setStartTime(startTime);

    this.setState({
      newApptActiveTab: 0,
      visibleNewAppointment: true,
    });
  }

  onCardPressed = (appointment) => {
    this.props.modifyApptActions.setSelectedAppt(appointment);
    this.props.rootDrawerNavigatorAction.changeShowTabBar(false);
    this.setState({
      selectedAppointment: appointment,
      visibleAppointment: true,
      selectedApptId: appointment.id,
    });
  }

  onCalendarCellPressed = (cellId, colData) => {
    const {
      startDate,
      selectedFilter,
      selectedProvider,
    } = this.props.appointmentScreenState;
    const { newAppointmentActions } = this.props;
    const startTime = moment(cellId, 'HH:mm A');
    const { client } = this.props.newAppointmentState;
    newAppointmentActions.cleanForm();
    if (this.state.bookAnotherEnabled) {
      newAppointmentActions.setClient(client);
    }
    if (selectedFilter === 'providers') {
      if (selectedProvider === 'all') {
        newAppointmentActions.setMainEmployee(colData);
        newAppointmentActions.setDate(startDate);
        if (colData.isFirstAvailable) {
          this.props.newAppointmentActions.setQuickApptRequested(false);
        }
      } else {
        newAppointmentActions.setMainEmployee(selectedProvider);
        newAppointmentActions.setDate(colData);
      }
    } else {
      newAppointmentActions.setMainEmployee(null);
      newAppointmentActions.setDate(startDate);
    }
    newAppointmentActions.setStartTime(startTime);
    newAppointmentActions.isBookingQuickAppt(true);
    this.setState({
      newApptActiveTab: 0,
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

  setBookAnother = () => this.setState({ bookAnotherEnabled: false });

  hideNewApptSlide = () => this.setState({ visibleNewAppointment: false });

  showNewApptSlide = () => this.setState({ visibleNewAppointment: true })

  changeNewApptSlideTab = newApptActiveTab => this.setState({ newApptActiveTab });

  handleBook = (bookAnotherEnabled) => {
    const callback = () => {
      this.setState({
        visibleNewAppointment: false,
        bookAnotherEnabled,
      }, () => {
        this.props.appointmentCalendarActions.setGridView();
        this.props.appointmentCalendarActions.setToast({
          description: 'Appointment Booked',
          type: 'green',
          btnRightText: 'DISMISS',
        });
      });
    };
    const errorCallback = () => {
      this.props.appointmentCalendarActions.setToast({
        description: 'There was an error, please try again',
        type: 'error',
        btnRightText: 'DISMISS',
      });
      this.props.newAppointmentActions.getConflicts();
    };
    this.props.newAppointmentActions.quickBookAppt(callback, errorCallback);
  }

  handleModifyAppt = () => {
    const { selectedAppointment: { appointmentGroupId, ...selectedAppointment } } = this.state;
    const { appointments, newAppointmentActions, navigation: { navigate } } = this.props;
    const groupData = appointments.filter(appt => appt.appointmentGroupId === appointmentGroupId);
    this.setState({ visibleAppointment: false }, () => {
      this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
    });
    newAppointmentActions.populateStateFromAppt(selectedAppointment, groupData);
    navigate('NewAppointment');
  }
  manageBuffer = (bufferVisible) => {
    if (this.state.bufferVisible !== bufferVisible) {
      this.setState({ bufferVisible });
      requestAnimationFrame(() => this.props.navigation.setParams({
        tabBarVisible: !bufferVisible,
      }));
    }
  }

  selectFilterProvider = () => {
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

  goToCancelAppt = (appointment) => {
    const { client, date } = appointment;
    const dateMoment = moment(date, 'YYYY-MM-DD');
    const appointments = filter(this.props.appointments, appt => (appt.client.id === client.id
      && dateMoment.isSame(moment(appt.date, 'YYYY-MM-DD'))));
    const onPressRight = () => {
      this.setState(
        { visibleAppointment: false },
        () => {
          this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
          this.props.navigation.navigate('CancelAppointmentScreen', { appointments });
          if (appointments.length > 1) {
            this.hideAlert();
          }
        },
      );
    };
    const onPressLeft = () => {
      this.setState(
        { visibleAppointment: false },
        () => {
          this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
          this.props.navigation.navigate('CancelAppointmentScreen', { appointments: [appointment] });
          if (appointments.length > 1) {
            this.hideAlert();
          }
        },
      );
    };
    if (appointments.length > 1) {
      const alert = {
        title: 'Question',
        description: 'The client has other appointments scheduled today, would you like to cancel them all?',
        btnLeftText: 'No',
        btnRightText: 'Yes',
        onPressRight,
        onPressLeft,
      };
      this.setState({ alert });
    } else {
      onPressRight();
    }
  }

  goToShowAppt = (client) => {
    const { startDate } = this.props.appointmentScreenState;
    this.setState(
      { visibleAppointment: false },
      () => {
        this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
        this.props.navigation.navigate('ShowApptScreen', {
          goToAppt: this.goToAppt, client, date: startDate.format('YYYY-MM-DD'),
        });
      },
    );
  }

  handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (this.state.screenHeight === 0) {
      this.setState({ screenHeight: height + 48 });
    }
  }

  hideApptSlide = () => {
    this.setState({ visibleAppointment: false }, () => {
      this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
    });
  }

  handleChangeDate = (startDate, endDate) => {
    this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
    this.props.appointmentCalendarActions.setGridView();
  }

  hideAlert = () => this.setState({ alert: null });

  goToAppt = ({ date, appointmentId }) => {
    const {
      startDate,
      endDate,
      selectedProvider,
      selectedFilter,
    } = this.props.appointmentScreenState;
    if (selectedFilter !== 'providers' || selectedProvider !== 'all') {
      this.selectFilter('providers', 'all');
    }
    const formatedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    if (formatedDate !== startDate.format('YYYY-MM-DD')) {
      this.handleChangeDate(date, endDate);
    }
    this.setState({ goToAppointmentId: appointmentId });
  }

  clearGoToAppointment = () => this.setState({ goToAppointmentId: null });

  render() {
    const {
      dates,
      pickerMode,
      startDate,
      endDate,
      selectedProvider,
      selectedFilter,
      providerSchedule,
      providerAppointments,
      providers,
      toast,
      filterOptions,
      rooms,
      roomAppointments,
      resources,
      deskStaff,
      resourceAppointments,
      storeSchedule,
    } = this.props.appointmentScreenState;
    const {
      storeScheduleExceptions, availability, appointments, blockTimes, apptGridSettings,
    } = this.props;
    const {
      bufferVisible, bookAnotherEnabled, screenHeight, goToAppointmentId, alert,
    } = this.state;
    const { appointmentCalendarActions, appointmentActions } = this.props;
    const isLoading = this.props.appointmentScreenState.isLoading
      || this.props.appointmentScreenState.isLoadingSchedule;
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
      <View
        style={styles.mainContainer}
        onLayout={this.handleLayout}
      >
        <SalonDatePickerBar
          calendarColor="#FFFFFF"
          mode={pickerMode}
          onCalendarSelected={() => this.setState({ visible: true })}
          onDateChange={this.handleChangeDate}
          selectedDate={moment(startDate)}
        />
        <SalonCalendar
          storeScheduleExceptions={storeScheduleExceptions}
          providers={providers}
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
          goToAppointmentId={goToAppointmentId}
          clearGoToAppointment={this.clearGoToAppointment}
        />
        {
          isLoading ?
            <View style={styles.loadingContainer}><ActivityIndicator />
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
          ref={(newApptSlide) => { this.newApptSlide = newApptSlide; }}
          maxHeight={screenHeight}
          navigation={this.props.navigation}
          visible={this.state.visibleNewAppointment}
          startTime={this.state.newApptStartTime}
          provider={this.state.newApptProvider}
          filterProviders={providers}
          hide={this.hideNewApptSlide}
          show={this.showNewApptSlide}
          handleBook={this.handleBook}
          activeTab={this.state.newApptActiveTab}
          onChangeTab={this.changeNewApptSlideTab}
        />

        <SalonDatePickerSlide
          mode={pickerMode}
          visible={this.state.visible}
          selectedDate={moment(startDate)}
          onHide={() => this.setState({ visible: false })}
          markedDates={{
            [moment().format('YYYY-MM-DD')]: {
              customStyles: {
                container: styles.dateTimeContainer,
                text: styles.dateTimeText,
              },
            },
          }}
          onDateSelected={(startDate, endDate) => {
            this.setState({ visible: false });
            this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
            this.props.appointmentCalendarActions.setGridView();
          }}
        />
        <SalonAppointmentSlide
          navigation={this.props.navigation}
          visible={this.state.visibleAppointment}
          appointmentId={this.state.selectedApptId}
          onHide={this.hideApptSlide}
          appointment={this.props.modifyApptState.appointment}
          handleModify={this.handleModifyAppt}
          goToCancelAppt={this.goToCancelAppt}
          goToShowAppt={this.goToShowAppt}
          handleCheckin={appointmentActions.postAppointmentCheckin}
          handleCheckout={appointmentActions.postAppointmentCheckout}
          updateAppointments={this.props.appointmentCalendarActions.setGridView}
        />
        {
          toast ? (
            <SalonToast
              timeout={2500}
              type={toast.type}
              description={toast.description}
              hide={appointmentCalendarActions.hideToast}
              undo={appointmentActions.undoMove}
              btnRightText={toast.btnRightText}
              btnLeftText={toast.btnLeftText}
            />
          ) : null
        }
        {
          bookAnotherEnabled ? (
            <BookAnother
              hide={this.setBookAnother}
              client={this.props.newAppointmentState.client}
            />
          ) : null
        }
        <SalonAlert
          visible={!!alert}
          title={alert ? alert.title : ''}
          description={alert ? alert.description : ''}
          btnLeftText={alert ? alert.btnLeftText : ''}
          btnRightText={alert ? alert.btnRightText : ''}
          onPressLeft={alert ? alert.onPressLeft : null}
          onPressRight={alert ? alert.onPressRight : null}
        />
      </View>
    );
  }
}

export default AppointmentScreen;
