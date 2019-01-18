import * as React from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import moment from 'moment';
import { get, filter, map, find } from 'lodash';

import getEmployeePhotoSource from '@/utilities/helpers/getEmployeePhotoSource';
import { Client } from '@/utilities/apiWrapper';
import SalonCalendar from '@/components/SalonCalendar';
import ChangeViewFloatingButton from './changeViewFloatingButton';
import SalonDatePickerBar from '@/components/SalonDatePickerBar';
import SalonDatePickerSlide from '@/components/slidePanels/SalonDatePickerSlide';
import SalonAppointmentSlide from '@/components/slidePanels/SalonCardDetailsSlide';
import SalonAvatar from '@/components/SalonAvatar';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import EditTypes from '@/constants/EditTypes';
import SalonToast from './SalonToast';
import NewApptSlide from '@/components/NewApptSlide';
import { DefaultAvatar } from '@/components/formHelpers';
import BookAnother from './bookAnother';
import RebookAppointment from './rebookAppointment';
import SalonAlert from '@/components/SalonAlert';
import BarsActionSheet from '@/components/BarsActionSheet';
import DateTime from '@/constants/DateTime';

import styles, { headerStyles } from './styles';
import appointmentOverlapHelper from './appointmentOverlapHelper';
import SalonHeader from '@/components/SalonHeader';
import Icon from '@/components/common/Icon';
import { getHeaderRoomsOrResources } from '@/screens/appointmentCalendarScreen/helpers';
import { appointmentCalendarActions } from '@/redux/actions/appointmentBook';

class AppointmentScreen extends React.Component<any, any> {
  static navigationOptions = ({ navigation }) => {
    const currentFilter = navigation.getParam('currentFilter', false);
    const tabBarVisible = navigation.getParam('tabBarVisible', true);
    const filterProvider = navigation.getParam('filterProvider', null);
    const onPressMenu = navigation.getParam('onPressMenu', null);
    const onPressTitle = navigation.getParam('onPressTitle', null);
    const onPressEllipsis = navigation.getParam('onPressEllipsis', null);
    const onPressCalendar = navigation.getParam('onPressCalendar', null);
    const filterOptions = navigation.getParam('filterOptions', {});
    let subTitleText = null;
    const { company, position } = filterOptions;
    let titleText = 'All Providers';
    if (company && !position) {
      titleText = 'Filtered by: Company';
      subTitleText = get(company, 'name', '');
    } else if (!company && position) {
      titleText = 'Filtered by: Position';
      subTitleText = get(position, 'name', '');
    } else if (company && position) {
      titleText = Dimensions.get('window').width < 375
        ? 'Filtered: Pos. + Comp'
        : 'Filtered by: Pos. + Comp';
      subTitleText = `${get(position, 'name', '')}, ${get(company, 'name', '')}`;
    }

    if (!subTitleText) {
      switch (currentFilter) {
        case 'deskStaff':
          titleText = 'Desk Staff';
          break;
        case 'rooms':
          titleText = 'All Rooms';
          break;
        case 'resources':
          titleText = 'All Resources';
          break;
        case 'all':
        default:
          titleText = 'All Providers';
          break;
      }
    }
    let titleComponent = <Text style={styles.titleText}>{titleText}</Text>;
    const subTitle = subTitleText
      ? <Text style={styles.headerSubTitleText}>{subTitleText}</Text>
      : false;
    if (filterProvider) {
      const image = getEmployeePhotoSource(filterProvider);
      titleComponent = (
        <View style={styles.salonAvatarWrapperContainer}>
          <SalonAvatar
            wrapperStyle={styles.salonAvatarWrapper}
            width={20}
            borderWidth={3}
            borderColor="white"
            image={image}
            defaultComponent={
              <DefaultAvatar size={20} provider={filterProvider} fontSize={8} />
            }
          />
          <Text style={styles.titleText}>
            {filterProvider.fullName}
          </Text>
        </View>
      );
    }
    const titleStyle = subTitle
      ? [
        headerStyles.btnTitle,
        {
          flexDirection: 'column',
          alignItems: 'center',
        },
      ]
      : [headerStyles.btnTitle, {}];
    const caretIcon = filterProvider
      ? null
      : (
        <Icon
          style={headerStyles.iconCaretDown}
          name="caretDown"
          type="solid"
          color="white"
          size={17}
        />
      );
    const title = (
      <SalonTouchableOpacity style={titleStyle} onPress={onPressTitle}>
        {titleComponent}
        {subTitle && !filterProvider ? subTitle : caretIcon}
      </SalonTouchableOpacity>
    );

    return {
      tabBarVisible,
      header: (
        <SalonHeader
          title={title}
          headerRight={
            <View style={headerStyles.rightContainer}>
              <SalonTouchableOpacity
                onPress={onPressEllipsis}
                style={headerStyles.btnElipsis}
              >
                <Icon name="ellipsisH" type="solid" color="white" size={18} />
              </SalonTouchableOpacity>
              <SalonTouchableOpacity
                onPress={onPressCalendar}
                style={headerStyles.btnCalendar}
              >
                <Icon
                  name="calendarO"
                  type="regularFree"
                  color="white"
                  size={20}
                />
                <Icon
                  name="search"
                  type="solid"
                  color="white"
                  size={8}
                  style={headerStyles.iconSearch}
                />
              </SalonTouchableOpacity>
            </View>
          }
          headerLeft={
            <SalonTouchableOpacity
              style={headerStyles.btn}
              onPress={onPressMenu}
            >
              <Icon name="bars" type="solid" color="white" size={20} />
            </SalonTouchableOpacity>
          }
        />
      ),
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
    selectedApptId: -1,
    goToAppointmentId: null,
    crossedAppointments: [],
    crossedAppointmentsIdAfter: [],
    workHeight: 0,
    isResizing: false,
  };
  private BarsActionSheet: any;
  private refsSliderPanel: any;

  componentDidMount() {
    this.props.navigation.setParams({
      onPressMenu: this.onPressMenu,
      onPressEllipsis: this.onPressEllipsis,
      onPressCalendar: this.onPressCalendar,
      onPressTitle: this.onPressTitle,
      currentFilter: this.props.appointmentScreenState.selectedProvider,
      filterOptions: this.props.apptGridSettings.filterOptions,
      hideTabBar: false,
    });

    this.props.appointmentCalendarActions.setGridView();

    this.props.navigation.addListener(
      'willFocus',
      this.loadRebookData,
    );
  }

  showCancelResizeAlert = (customLogic) => {
    const onPressRight = customLogic ? customLogic : () => {
      const { pickerMode, startDate, endDate } = this.props.appointmentScreenState;
      this.setState({
        alert: null,
      });
      const newPickerMode = pickerMode === 'week' ? 'day' : 'week';
      this.props.appointmentCalendarActions.setPickerMode(
        newPickerMode,
      );
      if (
        startDate.format('YYYY-MM-DD') ===
        endDate.format('YYYY-MM-DD')
      ) {
        this.props.appointmentCalendarActions.setGridView();
      }
    };
    console.warn('show resize alert');
    const alert = {
      title: 'Cancel resize?',
      description: 'Do you really want to cancel resize?',
      btnLeftText: 'No',
      btnRightText: 'Cancel',
      onPressRight,
      onPressLeft: () => {
        this.hideAlert();
      },
    };
    this.setState({ alert });
  };

  setResizing = isResizing => {
    return this.setState({ isResizing });
  };

  loadRebookData = () => {
    const { rebookData } = this.props.rebookState;

    if (
      rebookData &&
      'rebookAppointment' in rebookData &&
      rebookData.rebookAppointment
    ) {
      // this.selectFilter('providers', 'all');

      const { newAppointmentActions, appointmentCalendarActions } = this.props;
      const { rebookProviders, selectedAppointment } = rebookData;

      newAppointmentActions.cleanForm();
      newAppointmentActions.setClient(selectedAppointment.client);
      appointmentCalendarActions.setProviderScheduleDates(
        rebookData.date,
        rebookData.date,
      );
      appointmentCalendarActions.setGridView();

      if (rebookProviders.length === 0) {
        this.selectFilter('providers', 'all');
      } else if (rebookProviders.length === 1) {
        appointmentCalendarActions.setPickerMode('week');
        this.selectFilter('providers', rebookProviders[0]);
      } else {
        this.selectFilter('rebookAppointment', rebookProviders);
      }
    }
  };

  onPressMenu = () => {
    if (this.BarsActionSheet) {
      this.BarsActionSheet.show();
    }
  };

  onPressEllipsis = () =>
    this.props.navigation.navigate('ApptBookViewOptions', {
      transition: 'SlideFromBottom',
    });

  onChangeClient = client => {
    this.goToShowAppt(client);
  };

  handleClientScreenGoBack = navigation => {
    navigation.goBack();
  };

  handleClientScreenNewClient = navigation => {
    navigation.navigate('NewClient', {
      onChangeClient: navigation.state.params.onChangeClient,
    });
  };

  onPressCalendar = () => {
    const headerProps = {
      title: 'Appointment List',
      subTitle: null,
      leftButtonOnPress: this.handleClientScreenGoBack,
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
    };
    this.props.navigation.navigate('ApptBookClient', {
      onChangeClient: this.onChangeClient,
      headerProps,
      hideAddButton: true,
    });
  };

  hideAlertError = () => {
    this.props.appointmentCalendarActions.hideAlertError();
  };

  onPressTitle = () =>
    this.props.navigation.navigate('FilterOptions', {
      dismissOnSelect: true,
      onChangeFilter: this.selectFilter,
    });

  onAvailabilityCellPressed = time => {
    const { startDate, selectedProvider } = this.props.appointmentScreenState;
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
    }, this.hideApptSlide);
  };

  onCardPressed = appointment => {
    if (this.props.rebookState.rebookData.rebookAppointment) {
      return;
    }

    const {
      allCrossedAppointments,
      appointmentAfter,
    } = appointmentOverlapHelper(
      this.props.appointments,
      this.props.blockTimes,
      appointment,
    );
    this.props.modifyApptActions.setSelectedAppt(appointment);
    this.props.navigation.setParams({ hideTabBar: true });
    this.setState({
      crossedAppointments: allCrossedAppointments,
      crossedAppointmentsIdAfter: map(appointmentAfter, 'id'),
      selectedAppointment: appointment,
      visibleAppointment: true,
      selectedApptId: appointment.id,
    });
  };

  onCalendarCellPressed = (cellId, colData) => {
    const {
      startDate,
      selectedFilter,
      selectedProvider,
    } = this.props.appointmentScreenState;

    const { newAppointmentActions, restrictedToBookInAdvanceDays } = this.props;
    const startTime = moment(cellId, 'HH:mm A');
    const { client } = this.props.newAppointmentState;
    let date = selectedFilter === ('providers' ||
      selectedFilter === 'deskStaff' ||
      selectedFilter === 'rebookAppointment') && selectedProvider === 'all' ? startDate : colData;
    const differenceInDaysFromToday = moment(date, DateTime.date).diff(moment().startOf('day'), 'days');
    if (restrictedToBookInAdvanceDays && differenceInDaysFromToday >= restrictedToBookInAdvanceDays) {
      const alert = {
        title: '',
        description: `You may only book appointments ${restrictedToBookInAdvanceDays} days in advance`,
        btnRightText: 'Ok',
        onPressRight: this.hideAlert,
      };
      this.setState({ alert });
      return;
    }
    newAppointmentActions.cleanForm();
    if (
      this.state.bookAnotherEnabled ||
      this.props.rebookState.rebookData.rebookAppointment
    ) {
      newAppointmentActions.setClient(client);
    }
    if (
      selectedFilter === 'providers' ||
      selectedFilter === 'deskStaff' ||
      selectedFilter === 'rebookAppointment'
    ) {
      if (selectedProvider === 'all') {
        const differenceInDaysFromToday = moment(date, DateTime.date).diff(moment().startOf('day'), 'days');

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

    if (this.props.rebookState.rebookData.rebookAppointment) {
      const {
        selectedAppointment,
        rebookProviders,
        rebookServices,
        filterProvider,
      } = this.props.rebookState.rebookData;
      let mainEmployee = null;
      const services = JSON.parse(JSON.stringify(rebookServices));

      if (filterProvider !== null && typeof filterProvider === 'object') {
        mainEmployee = filterProvider;
      } else {
        mainEmployee = rebookProviders.length === 1
          ? rebookProviders[0]
          : colData;
      }

      date = rebookProviders.length === 1 ? colData : startDate;

      for (let i = 0; i < services.length; i += 1) {
        services[i].employee = mainEmployee;
      }

      newAppointmentActions.cleanForm();
      newAppointmentActions.populateStateFromRebookAppt(
        selectedAppointment,
        services,
        mainEmployee,
        date,
        startTime,
      );
      this.props.navigation.navigate('NewAppointment', {
        rebook: true,
        onFinishRebook: () => {
          this.setRebookAppointment();
          this.props.navigation.setParams({ hideTabBar: false });

          this.selectFilter('providers', rebookProviders[0]);
        },
      });
      newAppointmentActions.isBookingQuickAppt(false);
    } else {
      newAppointmentActions.isBookingQuickAppt(true);
      this.setState({
        newApptActiveTab: 0,
        visibleNewAppointment: true,
      }, this.hideApptSlide);
    }
  };

  setSelectedProvider = provider => {
    if (this.state.isResizing) {
      this.showCancelResizeAlert(() => {
        this.props.appointmentCalendarActions.setPickerMode('week');
        this.props.appointmentCalendarActions.setSelectedProvider(provider);
        this.props.appointmentCalendarActions.setGridView();
        this.props.navigation.setParams({
          filterProvider: provider,
        });
        this.hideAlert();
      });
      return;
    }
    this.props.appointmentCalendarActions.setPickerMode('week');
    this.props.appointmentCalendarActions.setSelectedProvider(provider);
    this.props.appointmentCalendarActions.setGridView();
    this.props.navigation.setParams({
      filterProvider: provider,
    });
  };

  setSelectedDay = day => {
    this.props.appointmentCalendarActions.setPickerMode('day');
    this.props.appointmentCalendarActions.setProviderScheduleDates(day, day);
  };

  setBookAnother = () => this.setState({ bookAnotherEnabled: false });

  setRebookAppointment = () => {
    this.props.navigation.setParams({
      hideTabBar: false,
      rebookAppointment: false,
    });
    this.props.rebookDialogActions.setRebookData({});

    this.selectFilter('providers', 'all');
    this.props.appointmentCalendarActions.setGridView();
  };

  hideNewApptSlide = () => this.setState({ visibleNewAppointment: false });

  showNewApptSlide = () => this.setState({ visibleNewAppointment: true });

  changeNewApptSlideTab = newApptActiveTab =>
    this.setState({ newApptActiveTab });

  handleBook = bookAnotherEnabled => {
    const callback = () => {
      this.setState(
        {
          visibleNewAppointment: false,
          bookAnotherEnabled,
        },
        () => {
          this.props.appointmentCalendarActions.setGridView();
          this.props.appointmentCalendarActions.setToast({
            description: 'Appointment Booked',
            type: 'green',
            btnRightText: 'DISMISS',
          });
        },
      );
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
  };

  handleRebookAppt = appointment => {
    if (appointment !== null) {
      this.props.navigation.setParams({ hideTabBar: true });

      const { appointments } = this.props;

      const allAppointments = appointments.filter(
        appt =>
          appt.clientId === appointment.clientId &&
          appt.date === appointment.date,
      );

      for (let i = 0; i < allAppointments.length; i++) {
        const appointment = allAppointments[i];
        appointment.service.provider = appointment.provider;
        appointment.service.employee = appointment.employee;
      }
      const allServices = map(allAppointments, 'service');
      appointment.services = allServices.length > 1
        ? allServices
        : [appointment.service];

      setTimeout(() => {
        this.props.navigation.push('RebookDialog', {
          appointment,
          ...this.props,
        });
      }, 500);
    }
  };

  handleModifyAppt = () => {
    const {
      selectedAppointment: { appointmentGroupId, ...selectedAppointment },
    } = this.state;
    const {
      appointments,
      newAppointmentActions,
      navigation: { navigate },
    } = this.props;
    const groupData = appointments.filter(
      appt => appt.appointmentGroupId === appointmentGroupId,
    );
    this.setState(
      {
        visibleAppointment: false,
        crossedAppointments: [],
        crossedAppointmentsIdAfter: [],
      },
      () => {
        this.props.navigation.setParams({ hideTabBar: false });
      },
    );
    if (this.state.selectedAppointment.isBlockTime) {
      Client.getClient(
        this.state.selectedAppointment.bookedByEmployeeId,
      ).then(resp => {
        navigate('BlockTime', {
          fromTime: this.state.selectedAppointment.fromTime,
          employee: this.state.selectedAppointment.employee,
          date: moment(this.state.selectedAppointment.date),
          bookedByEmployee: resp,
          reason: this.state.selectedAppointment.reason,
          toTime: this.state.selectedAppointment.toTime,
          id: this.state.selectedAppointment.id,
          notes: this.state.selectedAppointment.notes,
          editType: EditTypes.edit,
        });
      });
    } else {
      newAppointmentActions.populateStateFromAppt(
        selectedAppointment,
        groupData,
      );
      navigate('NewAppointment');
    }
  };

  manageBuffer = bufferVisible => {
    if (this.state.bufferVisible !== bufferVisible) {
      this.setState({ bufferVisible });
      requestAnimationFrame(() =>
        this.props.navigation.setParams({
          tabBarVisible: bufferVisible,
        }),
      );
    }
  };

  selectFilterProvider = () => {
    this.props.appointmentCalendarActions.setGridView();
  };

  selectFilter = (filter, filterProvider = null) => {
    switch (filter) {
      case 'deskStaff': {
        if (filterProvider === 'all') {
          this.props.navigation.setParams({
            filterProvider: null,
            currentFilter: 'deskStaff',
          });
          this.props.appointmentCalendarActions.setPickerMode('day');
        } else {
          this.props.navigation.setParams({
            filterProvider,
            currentFilter: 'deskStaff',
          });
        }
        this.props.appointmentCalendarActions.setSelectedFilter('deskStaff');
        this.props.appointmentCalendarActions.setSelectedProvider(
          filterProvider,
        );
        break;
      }
      case 'rooms':
      case 'resources': {
        this.props.navigation.setParams({
          filterProvider: null,
          currentFilter: filter,
        });
        this.props.appointmentCalendarActions.setPickerMode('day');
        this.props.appointmentCalendarActions.setSelectedFilter(filter);
        break;
      }
      case 'rebookAppointment': {
        this.props.navigation.setParams({
          filterProvider: null,
          currentFilter: filter,
        });
        this.props.appointmentCalendarActions.setSelectedFilter(
          'rebookAppointment',
        );

        this.props.appointmentCalendarActions.setSelectedProviders(
          filterProvider,
        );
        break;
      }
      case 'providers':
      default: {
        if (filterProvider === 'all') {
          this.props.navigation.setParams({
            filterProvider: null,
            currentFilter: 'providers',
          });
          this.props.appointmentCalendarActions.setPickerMode('day');
        } else {
          this.props.navigation.setParams({
            filterProvider,
            currentFilter: 'providers',
          });
        }
        this.props.appointmentCalendarActions.setSelectedFilter('providers');
        this.props.appointmentCalendarActions.setSelectedProvider(
          filterProvider,
        );

        break;
      }
    }
    this.props.appointmentCalendarActions.setGridView();
  };

  goToCancelScreen = appointments => {
    this.setState(
      {
        visibleAppointment: false,
        crossedAppointments: [],
        crossedAppointmentsIdAfter: [],
      },
      () => {
        this.props.navigation.setParams({ hideTabBar: false });
        this.props.navigation.navigate('CancelAppointmentScreen', {
          appointments,
        });
        if (appointments.length > 1) {
          this.hideAlert();
        }
      },
    );
  };

  goToCancelAppt = appointment => {
    if (appointment.isBlockTime) {
      this.goToCancelScreen([appointment]);
    } else {
      const { client, date } = appointment;
      const dateMoment = moment(date, 'YYYY-MM-DD');
      const appointments = filter(
        this.props.appointments,
        appt =>
          appt.client.id === client.id &&
          dateMoment.isSame(moment(appt.date, 'YYYY-MM-DD')),
      );
      const hiddenAddonsLenght = appointments.filter(
        appt =>
          appt.id !== appointment.id &&
          appt.appointmentGroupId === appointment.appointmentGroupId,
      );
      const onPressRight = () => this.goToCancelScreen(appointments);
      const onPressLeft = () => {
        this.setState(
          {
            visibleAppointment: false,
            crossedAppointments: [],
            crossedAppointmentsIdAfter: [],
          },
          () => {
            this.props.navigation.setParams({ hideTabBar: false });
            this.props.navigation.navigate('CancelAppointmentScreen', {
              appointments: [appointment],
            });
            if (appointments.length > 1) {
              this.hideAlert();
            }
          },
        );
      };

      if (appointment.badgeData.isCashedOut) {
        this.props.appointmentCalendarActions.setToast({
          description: 'This appointment cannot be canceled because it has already been cashed out',
          type: 'error',
          btnRightText: 'DISMISS',
        });
      } else if (appointments.length - hiddenAddonsLenght.length > 1) {
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
  };

  goToShowAppt = client => {
    const { startDate } = this.props.appointmentScreenState;
    this.setState(
      {
        visibleAppointment: false,
        crossedAppointments: [],
        crossedAppointmentsIdAfter: [],
      },
      () => {
        this.props.navigation.setParams({ hideTabBar: false });
        this.props.navigation.navigate('ShowApptScreen', {
          goToAppt: this.goToAppt,
          client,
          date: startDate.format('YYYY-MM-DD'),
        });
      },
    );
  };

  handleCheckin = (id, date) => {
    const onPressRight = () => {
      this.props.appointmentActions.postAppointmentCheckin(id);
      this.hideAlert();
    };
    const dateMoment = moment(date, 'YYYY-MM-DD');
    const today = moment();
    if (dateMoment.isAfter(today, 'day')) {
      const alert = {
        title: 'Question',
        description: 'You are trying to check in an appointment for another day, are you sure you want to do this?',
        btnLeftText: 'No',
        btnRightText: 'Check-In',
        onPressRight,
        onPressLeft: this.hideAlert,
      };
      this.setState({ alert });
    } else {
      this.props.appointmentActions.postAppointmentCheckin(id);
    }
  };

  hideApptSlide = () => {
    this.setState(
      {
        visibleAppointment: false,
        crossedAppointments: [],
        crossedAppointmentsIdAfter: [],
      },
      () => {
        this.props.navigation.setParams({ hideTabBar: false });
      },
    );
  };

  handleChangeDate = (startDate, endDate) => {
    this.setState(
      {
        visibleAppointment: false,
        crossedAppointments: [],
        crossedAppointmentsIdAfter: [],
      },
      () => {
        this.props.navigation.setParams({ hideTabBar: false });
      },
    );

    this.props.appointmentCalendarActions.setProviderScheduleDates(
      startDate,
      endDate,
    );
    this.props.appointmentCalendarActions.setGridView();
  };

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
  };

  handleUndo = () => {
    const {
      appointmentActions,
      blockTimeActions,
      appointmentScreenState: { toast },
    } = this.props;
    if (toast.isBlockTime) {
      blockTimeActions.undoMove();
    } else {
      appointmentActions.undoMove();
    }
  };

  clearGoToAppointment = () => this.setState({ goToAppointmentId: null });

  calculateWorkHeight = (event) => {
    const { height } = event.nativeEvent.layout;
    this.setState({ workHeight: height });
  };

  getSlideRefs = (ref) => {
    this.refsSliderPanel = ref;
  };

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
      resourceAppointments,
      storeSchedule,
      alertError,
    } = this.props.appointmentScreenState;
    const {
      storeScheduleExceptions,
      availability,
      appointments,
      blockTimes,
      apptGridSettings,
    } = this.props;
    const {
      bufferVisible,
      bookAnotherEnabled,
      goToAppointmentId,
      alert,
      crossedAppointmentsIdAfter,
    } = this.state;

    const { rebookAppointment } = this.props.rebookState.rebookData;
    const { appointmentCalendarActions, appointmentActions } = this.props;
    const isLoading =
      this.props.appointmentScreenState.isLoading ||
      this.props.appointmentScreenState.isLoadingSchedule;
    let headerData = null;
    let dataSource = null;
    let isDate = false;

    switch (selectedFilter) {
      case 'rooms': {
        headerData = getHeaderRoomsOrResources(rooms, 'room');
        dataSource = roomAppointments;
        break;
      }
      case 'resources': {
        headerData = getHeaderRoomsOrResources(resources, 'resource');
        dataSource = resourceAppointments;
        break;
      }
      case 'rebookAppointment': {
        isDate = false;
        headerData = providers;
        dataSource = providerAppointments;
        break;
      }
      case 'deskStaff': {
        isDate = selectedProvider !== 'all';
        headerData = isDate ? dates : providers;
        dataSource = providerAppointments;
        break;
      }
      case 'providers': {
        isDate = selectedProvider !== 'all';
        headerData = isDate ? dates : providers;
        dataSource = providerAppointments;
        break;
      }
      default:
        break;
    }

    const isNeedShowCurrentTime = startDate.format(DateTime.dateWithMonthShort)
      === moment().format(DateTime.dateWithMonthShort) && pickerMode === 'day';

    const isCanBeOnlyUser = selectedFilter === 'providers' || selectedFilter === 'deskStaff';

    return (
      <View
        onLayout={this.calculateWorkHeight}
        style={styles.mainContainer}
      >
        <BarsActionSheet
          ref={item => (this.BarsActionSheet = item)}
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
          isDetailsVisible={this.state.visibleAppointment}
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
          refsSliderPanel={this.refsSliderPanel}
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
          isNeedShowCurrentTime={isNeedShowCurrentTime}
          workHeight={this.state.workHeight}
          setResizing={this.setResizing}
        />
        {isLoading
          ? <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
          : null}
        {isCanBeOnlyUser && selectedProvider !== 'all' &&
          <ChangeViewFloatingButton
            bottomDistance={
              this.state.bookAnotherEnabled || rebookAppointment ? 60 : 16
            }
            pickerMode={pickerMode}
            handlePress={() => {
              if (this.state.isResizing) {
                this.showCancelResizeAlert();
                return;
              }
              const newPickerMode = pickerMode === 'week' ? 'day' : 'week';
              this.props.appointmentCalendarActions.setPickerMode(
                newPickerMode,
              );
              if (
                startDate.format('YYYY-MM-DD') ===
                endDate.format('YYYY-MM-DD')
              ) {
                this.props.appointmentCalendarActions.setGridView();
              }
            }}
          />}
        <NewApptSlide
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
          selectedFilter={selectedFilter}
        />
        <SalonDatePickerSlide
          currentDate={this.props.appointmentScreenState && this.props.appointmentScreenState.startDate}
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
            this.props.appointmentCalendarActions.setProviderScheduleDates(
              startDate,
              endDate,
            );
            this.props.appointmentCalendarActions.setGridView();
          }}
        />
        <SalonAppointmentSlide
          selectedFilter={selectedFilter}
          selectedProvider={selectedProvider}
          appointments={appointments}
          showToast={this.props.appointmentCalendarActions.setToast}
          navigation={this.props.navigation}
          visible={this.state.visibleAppointment}
          appointmentId={this.state.selectedApptId}
          onHide={this.hideApptSlide}
          isBlockTime={
            this.state.selectedAppointment &&
            this.state.selectedAppointment.isBlockTime
          }
          handleModify={this.handleModifyAppt}
          handleRebook={this.handleRebookAppt}
          goToCancelAppt={this.goToCancelAppt}
          goToShowAppt={this.goToShowAppt}
          handleCheckin={this.handleCheckin}
          handleCheckout={appointmentActions.postAppointmentCheckout}
          updateAppointments={this.props.appointmentCalendarActions.setGridView}
          crossedAppointments={this.state.crossedAppointments}
          crossedAppointmentsIdAfter={this.state.crossedAppointmentsIdAfter}
          changeAppointment={this.onCardPressed}
          handleNewAppt={this.onCalendarCellPressed}
          workHeight={this.state.workHeight}
          getRefsSlidePanel={this.getSlideRefs}
        />
        {toast
          ? <SalonToast
            timeout={2500}
            type={toast.type}
            description={toast.description}
            hide={appointmentCalendarActions.hideToast}
            undo={this.handleUndo}
            btnRightText={toast.btnRightText}
            btnLeftText={toast.btnLeftText}
          />
          : null}
        {bookAnotherEnabled
          ? <BookAnother
            hide={this.setBookAnother}
            client={this.props.newAppointmentState.client}
          />
          : null}
        {rebookAppointment
          ? <RebookAppointment
            hide={this.setRebookAppointment}
            newAppointmentState={this.props.newAppointmentState}
            client={this.props.newAppointmentState.client}
          />
          : null}
        <SalonAlert
          visible={!!alert}
          title={alert ? alert.title : ''}
          description={alert ? alert.description : ''}
          btnLeftText={alert ? alert.btnLeftText : ''}
          btnRightText={alert ? alert.btnRightText : ''}
          onPressLeft={alert ? alert.onPressLeft : null}
          onPressRight={alert ? alert.onPressRight : null}
        />
        <SalonAlert
          visible={alertError && alertError.show}
          title={alertError && alertError.title}
          description={alertError && alertError.description}
          btnRightText={'OK'}
          onPressRight={this.hideAlertError}
        />
      </View>
    );
  }
}

export default AppointmentScreen;
