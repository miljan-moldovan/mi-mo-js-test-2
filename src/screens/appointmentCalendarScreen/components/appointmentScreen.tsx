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
import {
  TYPE_FILTTER_RESOURCES,
  TYPE_FILTER_PROVIDERS,
  TYPE_FILTER_DESK_STAFF,
  TYPE_FILTTER_REBOOK_APPOINTMENT,
  TYPE_PROVIDER,
} from '@/constants/filterTypes';

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
    const { newAppointmentActions, restrictedToBookInAdvanceDays } = this.props;

    const startTime = moment(cellId, 'HH:mm A');
    const date = this.getDateAndWhenPressCell(colData);

    const differenceInDaysFromToday = moment(date, DateTime.date).diff(moment().startOf('day'), 'days');

    this.checkAndAddOrClearOrdinalAndResourceId(colData);

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
    this.setClientIfBookAnotherEnabledAndThereAreRebookAppointment();
    this.setMainEmployAndDateDependOnStateOfFilter(colData);

    newAppointmentActions.setStartTime(startTime);

    this.checkIsRebookAppointmentAndSetSsBookingQuickAppt(colData, startTime);
  };

  checkAndAddOrClearOrdinalAndResourceId = (colData) => {
    const { newAppointmentActions, appointmentScreenState: { selectedFilter } } = this.props;

    if (selectedFilter === TYPE_FILTTER_RESOURCES) {
      const targetId = colData && colData.id && colData.id.split('_');
      newAppointmentActions.setOrdinalIdAndResourcesId(+targetId[1], +targetId[0]);
    } else {
      newAppointmentActions.clearOrdinalIdAndResourcesId();
    }
  };

  setClientIfBookAnotherEnabledAndThereAreRebookAppointment = () => {
    const { newAppointmentActions, newAppointmentState: { client } } = this.props;

    if (this.state.bookAnotherEnabled || this.props.rebookState.rebookData.rebookAppointment) {
      newAppointmentActions.setClient(client);
    }
  };

  setMainEmployAndDateDependOnStateOfFilter = (colData) => {
    const { newAppointmentActions, appointmentScreenState: { startDate } } = this.props;

    if (this.isFilterProviderOrDeskStaffOrRebookAppointment()) {
      this.checkTypeProviderAndSetMainEmployAndDateDependOnProvider(colData);
    } else {
      newAppointmentActions.setMainEmployee(null);
      newAppointmentActions.setDate(startDate);
    }
  };

  isFilterProviderOrDeskStaffOrRebookAppointment = () => {
    const { selectedFilter } = this.props.appointmentScreenState;

    return selectedFilter === TYPE_FILTER_PROVIDERS ||
      selectedFilter === TYPE_FILTER_DESK_STAFF ||
      selectedFilter === TYPE_FILTTER_REBOOK_APPOINTMENT;
  };

  checkTypeProviderAndSetMainEmployAndDateDependOnProvider = (colData) => {
    const { selectedProvider, startDate } = this.props.appointmentScreenState;

    if (selectedProvider === TYPE_PROVIDER) {
      this.setMainEmployAndDateDependOnProvider(colData, startDate, !colData.isFirstAvailable);
    } else {
      this.setMainEmployAndDateDependOnProvider(selectedProvider, startDate, true);
    }
  };

  setMainEmployAndDateDependOnProvider = (employee, date, quickApptRequested) => {
    const { newAppointmentActions } = this.props;

    newAppointmentActions.setMainEmployee(employee);
    newAppointmentActions.setDate(date);
    newAppointmentActions.setQuickApptRequested(quickApptRequested);
  };

  getDateAndWhenPressCell = (colData) => {
    const { selectedProvider, startDate, selectedFilter } = this.props.appointmentScreenState;

    return selectedFilter === (TYPE_FILTER_PROVIDERS ||
      selectedFilter === TYPE_FILTER_DESK_STAFF ||
      selectedFilter === TYPE_FILTTER_REBOOK_APPOINTMENT) && selectedProvider === TYPE_PROVIDER ? startDate : colData;
  };

  checkIsRebookAppointmentAndSetSsBookingQuickAppt = (colData, startTime) => {
    const { newAppointmentActions } = this.props;
    if (
      this.props.rebookState && this.props.rebookState.rebookData
      && this.props.rebookState.rebookData.rebookAppointment
    ) {
      this.setPopulateStateFromRebookApptAndBookingQuickAppt(colData, startTime);
    } else {
      newAppointmentActions.isBookingQuickAppt(true);
      this.setState({
        newApptActiveTab: 0,
        visibleNewAppointment: true,
      }, this.hideApptSlide);
    }
  };

  setPopulateStateFromRebookApptAndBookingQuickAppt = (colData, startTime) => {
    const { selectedAppointment, rebookProviders } = this.props.rebookState.rebookData;
    const { newAppointmentActions } = this.props;
    const { startDate } = this.props.appointmentScreenState;

    const mainEmployee = this.getMainEmployeePopulateState(colData);
    const services = this.getServiceForPopulateState(mainEmployee);
    const date = rebookProviders.length === 1 ? colData : startDate;

    newAppointmentActions.cleanForm();
    newAppointmentActions.populateStateFromRebookAppt(selectedAppointment, services, mainEmployee, date, startTime);
    this.props.navigation.navigate('NewAppointment', {
      rebook: true,
      onFinishRebook: this.onFinishRebook,
    });
    newAppointmentActions.isBookingQuickAppt(false);
  };

  getMainEmployeePopulateState = (colData) => {
    const { rebookProviders, filterProvider } = this.props.rebookState.rebookData;

    if (filterProvider !== null && typeof filterProvider === 'object') {
      return filterProvider;
    }

    return rebookProviders.length === 1
      ? rebookProviders[0]
      : colData;
  };

  getServiceForPopulateState = (mainEmployee) => {
    const { rebookServices } = this.props.rebookState.rebookData;
    const services = JSON.parse(JSON.stringify(rebookServices));

    for (let i = 0; i < services.length; i += 1) {
      services[i].employee = mainEmployee;
    }
    return services;
  };

  onFinishRebook = () => {
    const { rebookProviders } = this.props.rebookState.rebookData;

    this.setRebookAppointment();
    this.props.navigation.setParams({ hideTabBar: false });
    this.selectFilter(TYPE_FILTER_PROVIDERS, rebookProviders[0]);
  };

  setSelectedProvider = provider => {
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
