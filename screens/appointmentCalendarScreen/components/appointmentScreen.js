import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { groupBy } from 'lodash';
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
            image={{ uri: params.filterProvider.imagePath }}
            defaultComponent={(<DefaultAvatar
              size={20}
              provider={params.filterProvider}
              fontSize={8}
            />)}
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

  onPressMenu = () => {
    this.props.appointmentCalendarActions.setToast({
      description: 'Not Implemented',
      type: 'warning',
      btnRightText: 'DISMISS',
    });
    // this.props.navigation.navigate('ApptBookProducts');
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
    // const groupData = this.props.appointments.filter(appt => appt.appointmentGroupId === appointment.appointmentGroupId);
    // this.props.newAppointmentActions.setSelectedAppt(appointment, groupData);
    // this.props.navigation.navigate('NewAppointment');
    this.props.modifyApptActions.setSelectedAppt(appointment);
    this.setState({
      selectedAppointment: appointment,
      visibleAppointment: true,
      selectedApptId: appointment.id,
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
  //     newApptActiveTab: 0,
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
    const { client } = this.props.newAppointmentState;
    newAppointmentActions.cleanForm();
    if (this.state.bookAnotherEnabled) {
      newAppointmentActions.setClient(client);
    }
    // const newState = {
    //   newApptStartTime: startTime,
    // };
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

  handleModifyAppt = () => {
    const { selectedAppointment: { appointmentGroupId, ...selectedAppointment } } = this.state;
    const { appointments, newAppointmentActions, navigation: { navigate } } = this.props;
    const groupData = appointments.filter(appt => appt.appointmentGroupId === appointmentGroupId);
    this.setState({ visibleAppointment: false });
    newAppointmentActions.populateStateFromAppt(selectedAppointment, groupData);
    navigate('NewAppointment');
  }

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

  changeNewApptSlideTab = newApptActiveTab => this.setState({ newApptActiveTab });

  showNewApptSlide = () => this.setState({ visibleNewAppointment: true })

  hideNewApptSlide = () => this.setState({ visibleNewAppointment: false });

  setBookAnother = () => this.setState({ bookAnotherEnabled: false });

  goToCancelAppt = (appointment) => {
    this.setState(
      { visibleAppointment: false },
      () => { this.props.navigation.navigate('CancelAppointmentScreen', { appointment }); },
    );
  }

  goToShowAppt = (client) => {
    const { startDate } = this.props.appointmentScreenState;
    this.setState(
      { visibleAppointment: false },
      () => {
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
    this.setState({ visibleAppointment: false });
  }

  handleChangeDate = (startDate, endDate) => {
    this.props.appointmentCalendarActions.setProviderScheduleDates(startDate, endDate);
    this.props.appointmentCalendarActions.setGridView();
  }

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
      apptGridSettings,
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
    const { availability, appointments, blockTimes } = this.props;
    const {
      bufferVisible, bookAnotherEnabled, screenHeight, goToAppointmentId,
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
        style={{ flex: 1 }}
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
      </View>
    );
  }
}
