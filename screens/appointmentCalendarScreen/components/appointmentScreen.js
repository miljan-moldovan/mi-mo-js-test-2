import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { filter, map, find } from 'lodash';

import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import { Client } from '../../../utilities/apiWrapper';
import SalonCalendar from '../../../components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '../../../components/SalonDatePickerBar';
import SalonDatePickerSlide from '../../../components/slidePanels/SalonDatePickerSlide';
import SalonAppointmentSlide from '../../../components/slidePanels/SalonCardDetailsSlide';
import SalonAvatar from '../../../components/SalonAvatar';
import EditTypes from '../../../constants/EditTypes';
import ApptCalendarHeader from './ApptCalendarHeader';
import SalonToast from './SalonToast';
import NewApptSlide from '../../../components/NewApptSlide';
import { DefaultAvatar } from '../../../components/formHelpers';
import BookAnother from './bookAnother';
import RebookAppointment from './rebookAppointment';
import SalonAlert from '../../../components/SalonAlert';
import BarsActionSheet from '../../../components/BarsActionSheet';

import styles from './styles';
import appointmentOverlapHelper from './appointmentOverlapHelper';

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
      <Text style={styles.titleText}>{currentFilter}</Text>);

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
          onPressMenu={params ? params.onPressMenu : null}
          onPressTitle={params ? params.onPressTitle : null}
          onPressEllipsis={params ? params.onPressEllipsis : null}
          onPressCalendar={params ? params.onPressCalendar : null}
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
    rebookAppointmentEnabled: false,
    screenHeight: 0,
    selectedApptId: -1,
    goToAppointmentId: null,
    crossedAppointments: [],
    crossedAppointmentsIdAfter: [],
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


    const { params } = this.props.navigation.state;

    if (params && 'rebookAppointment' in params) {
      this.selectFilter('providers', 'all');

      const { newAppointmentActions, appointmentCalendarActions } = this.props;
      const { rebookProviders, selectedAppointment } = params;

      newAppointmentActions.cleanForm();
      newAppointmentActions.setClient(selectedAppointment.client);
      appointmentCalendarActions.setProviderScheduleDates(params.date, params.date);
      appointmentCalendarActions.setGridView();


      if (rebookProviders.length === 1) {
        appointmentCalendarActions.setPickerMode('week');
        this.selectFilter('providers', rebookProviders[0]);
      } else {
        this.selectFilter('rebookAppointment', rebookProviders);
      }

      this.handleRebook(true);
    }
  }

  onPressMenu = () => {
    if (this.BarsActionSheet) {
      this.BarsActionSheet.show();
    }
  };

  onPressEllipsis = () => this.props.navigation.navigate('ApptBookViewOptions');

  onChangeClient = (client) => {
    this.goToShowAppt(client);
  }

  handleClientScreenGoBack = (navigation) => {
    navigation.goBack();
  }

  handleClientScreenNewClient = (navigation) => {
    navigation.navigate('NewClient', { onChangeClient: navigation.state.params.onChangeClient });
  }

  onPressCalendar = () => {
    const headerProps = {
      title: 'Appointment List',
      subTitle: null,
      leftButtonOnPress: this.handleClientScreenGoBack,
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
    };

    this.props.navigation.navigate('ApptBookClient', { onChangeClient: this.onChangeClient, headerProps, hideAddButton: true });
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
    const { allCrossedAppointments, appointmentAfter } = appointmentOverlapHelper(
      this.props.appointments,
      this.props.blockTimes,
      appointment,
    );
    this.props.modifyApptActions.setSelectedAppt(appointment);
    // this.props.rootDrawerNavigatorAction.changeShowTabBar(false);
    this.props.navigation.setParams({ tabBarVisible: false });
    this.setState({
      crossedAppointments: allCrossedAppointments,
      crossedAppointmentsIdAfter: map(appointmentAfter, 'id'),
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
    if (this.state.bookAnotherEnabled || this.state.rebookAppointmentEnabled) {
      newAppointmentActions.setClient(client);
    }
    if (selectedFilter === 'providers' || selectedFilter === 'deskStaff' || selectedFilter === 'rebookAppointment') {
      if (selectedProvider === 'all') {
        newAppointmentActions.setMainEmployee(colData);
        newAppointmentActions.setDate(startDate);
        newAppointmentActions.setQuickApptRequested(!colData.isFirstAvailable);
      } else {
        newAppointmentActions.setMainEmployee(selectedProvider);
        newAppointmentActions.setDate(colData);
        newAppointmentActions.setQuickApptRequested(true);
      }
    } else {
      newAppointmentActions.setMainEmployee(null);
      newAppointmentActions.setDate(startDate);
    }
    newAppointmentActions.setStartTime(startTime);


    if (this.state.rebookAppointmentEnabled) {

      const { params } = this.props.navigation.state;
      const {
        selectedAppointment, rebookProviders, rebookServices, filterProvider,
      } = params;
      let mainEmployee = null;
      const services = JSON.parse(JSON.stringify(rebookServices));

      if (filterProvider !== null && typeof filterProvider === 'object') {
        mainEmployee = filterProvider;
      } else {
        mainEmployee = rebookProviders.length === 1 ? rebookProviders[0] : colData;
      }

      const date = rebookProviders.length === 1 ? colData : startDate;

      for (let i = 0; i < services.length; i += 1) {
        services[i].employee = mainEmployee;
      }

      newAppointmentActions.cleanForm();
      newAppointmentActions.populateStateFromRebookAppt(selectedAppointment, services, mainEmployee, date, startTime);
      this.props.navigation.navigate('NewAppointment', { rebook: true });
      newAppointmentActions.isBookingQuickAppt(false);
    } else {
      newAppointmentActions.isBookingQuickAppt(true);
      this.setState({
        newApptActiveTab: 0,
        visibleNewAppointment: true,
      });
    }
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

  setRebookAppointment = () => {
    this.setState({ rebookAppointmentEnabled: false }, () => {
      this.selectFilter('providers', 'all');
      // this.props.appointmentCalendarActions.setGridView();
    });
  };

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


  handleRebook = (rebookAppointmentEnabled) => {
    this.setState({
      rebookAppointmentEnabled,
    });
  }

  handleRebookAppt = (appointment) => {
    if (appointment !== null) {
      this.props.navigation.navigate('RebookDialog', {
        appointment,
        ...this.props,
      });
    }
  }

  handleModifyAppt = () => {
    const { selectedAppointment: { appointmentGroupId, ...selectedAppointment } } = this.state;
    const { appointments, newAppointmentActions, navigation: { navigate } } = this.props;
    const groupData = appointments.filter(appt => appt.appointmentGroupId === appointmentGroupId);
    this.setState({
      visibleAppointment: false,
      crossedAppointments: [],
      crossedAppointmentsIdAfter: [],
    }, () => {
      this.props.navigation.setParams({ tabBarVisible: true });
    });
    if (this.state.selectedAppointment.isBlockTime) {
      Client.getClient(this.state.selectedAppointment.bookedByEmployeeId).then((resp) => {
        navigate('BlockTime', {
          fromTime: this.state.selectedAppointment.fromTime,
          employee: this.state.selectedAppointment.employee,
          date: moment(this.state.selectedAppointment.date),
          bookedByEmployee: resp,
          reason: this.state.selectedAppointment.reason,
          toTime: this.state.selectedAppointment.toTime,
          id: this.state.selectedAppointment.id,
          editType: EditTypes.edit,
        });
      });
    } else {
      newAppointmentActions.populateStateFromAppt(selectedAppointment, groupData);
      navigate('NewAppointment');
    }
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
      case 'rebookAppointment': {
        this.props.navigation.setParams({ filterProvider: null, currentFilter: filter });
        this.props.appointmentCalendarActions.setSelectedFilter('rebookAppointment');

        this.props.appointmentCalendarActions.setSelectedProviders(filterProvider);
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
    const hiddenAddonsLenght = appointments.filter(appt => (appt.id !== appointment.id
      && appt.appointmentGroupId === appointment.appointmentGroupId));
    const onPressRight = () => {
      this.setState(
        {
          visibleAppointment: false,
          crossedAppointments: [],
          crossedAppointmentsIdAfter: [],
        },
        () => {
          this.props.navigation.setParams({ tabBarVisible: true });
          // this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
          this.props.navigation.navigate('CancelAppointmentScreen', { appointments });
          if (appointments.length > 1) {
            this.hideAlert();
          }
        },
      );
    };
    const onPressLeft = () => {
      this.setState(
        {
          visibleAppointment: false,
          crossedAppointments: [],
          crossedAppointmentsIdAfter: [],
        },
        () => {
          this.props.navigation.setParams({ tabBarVisible: true });
          // this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
          this.props.navigation.navigate('CancelAppointmentScreen', { appointments: [appointment] });
          if (appointments.length > 1) {
            this.hideAlert();
          }
        },
      );
    };
    if (appointments.length - hiddenAddonsLenght.length > 1) {
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
      {
        visibleAppointment: false,
        crossedAppointments: [],
        crossedAppointmentsIdAfter: [],
      },
      () => {
        // this.props.rootDrawerNavigatorAction.changeShowTabBar(true);
        this.props.navigation.setParams({ tabBarVisible: true });
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
    this.setState({
      visibleAppointment: false,
      crossedAppointments: [],
      crossedAppointmentsIdAfter: [],
    }, () => {
      this.props.navigation.setParams({ tabBarVisible: true });
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

  handleUndo = () => {
    const { appointmentActions, blockTimeActions, appointmentScreenState: { toast } } = this.props;
    if (toast.isBlockTime) {
      blockTimeActions.undoMove();
    } else {
      appointmentActions.undoMove();
    }
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
      bufferVisible,
      bookAnotherEnabled,
      rebookAppointmentEnabled,
      screenHeight,
      goToAppointmentId,
      alert,
      crossedAppointmentsIdAfter,
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
      case 'rebookAppointment': {
        isDate = false;
        headerData = providers;
        dataSource = providerAppointments;
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
        <BarsActionSheet
          ref={item => this.BarsActionSheet = item}
          onLogout={this.props.auth.logout}
          navigation={this.props.navigation}
          onChangeStore={this.props.storeActions.reselectMainStore}
        />
        <SalonDatePickerBar
          calendarColor="#FFFFFF"
          mode={pickerMode}
          onCalendarSelected={() => this.setState({ visible: true })}
          onDateChange={this.handleChangeDate}
          selectedDate={moment(startDate)}
        />
        <SalonCalendar
          navigation={this.props.navigation}
          checkConflicts={this.props.checkConflicts}
          checkConflictsBlock={this.props.checkConflictsBlock}
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
          onDropBlock={this.props.blockTimeActions.putBlockTimeMove}
          onResizeBlock={this.props.blockTimeActions.putBlockTimeResize}
          onResize={this.props.appointmentActions.postAppointmentResize}
          selectedFilter={selectedFilter}
          selectedProvider={selectedProvider}
          displayMode={pickerMode}
          providerSchedule={providerSchedule}
          availability={availability}
          rooms={rooms}
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
          crossedAppointmentAfter={crossedAppointmentsIdAfter}
        />
        {
          isLoading ?
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
            </View> : null
        }
        {selectedFilter === 'providers' && selectedProvider !== 'all' && (
          <ChangeViewFloatingButton
            bottomDistance={(this.state.bookAnotherEnabled || this.state.rebookAppointmentEnabled) ? 60 : 16}
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
          appointments={appointments}
          navigation={this.props.navigation}
          visible={this.state.visibleAppointment}
          appointmentId={this.state.selectedApptId}
          onHide={this.hideApptSlide}
          isBlockTime={this.state.selectedAppointment && this.state.selectedAppointment.isBlockTime}
          handleModify={this.handleModifyAppt}
          handleRebook={this.handleRebookAppt}
          goToCancelAppt={this.goToCancelAppt}
          goToShowAppt={this.goToShowAppt}
          handleCheckin={appointmentActions.postAppointmentCheckin}
          handleCheckout={appointmentActions.postAppointmentCheckout}
          updateAppointments={this.props.appointmentCalendarActions.setGridView}
          crossedAppointments={this.state.crossedAppointments}
          crossedAppointmentsIdAfter={this.state.crossedAppointmentsIdAfter}
          changeAppointment={this.onCardPressed}
        />
        {
          toast ? (
            <SalonToast
              timeout={2500}
              type={toast.type}
              description={toast.description}
              hide={appointmentCalendarActions.hideToast}
              undo={this.handleUndo}
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
        {
          rebookAppointmentEnabled ? (
            <RebookAppointment
              hide={this.setRebookAppointment}
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
