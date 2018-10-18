import React from 'react';
import {
  Text,
  View,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Picker, DatePicker } from 'react-native-wheel-datepicker';
import uuid from 'uuid/v4';
import { get, debounce, isNull } from 'lodash';
import ClientInfoButton from '../../components/ClientInfoButton';
import ClientPhoneTypes from '../../constants/ClientPhoneTypes';
import {
  DefaultAvatar,
  LabeledTextInput,
  LabeledTextarea,
  InputGroup,
  InputText,
  InputLabel,
  SectionTitle,
  InputSwitch,
  InputDivider,
  ClientInput,
  InputNumber,
  InputButton,
  ProviderInput,
  ValidatableInput,
} from '../../components/formHelpers';
import {
  AddButton,
} from '../appointmentDetailsScreen/components/appointmentDetails';
import Icon from '../../components/UI/Icon';
import LoadingOverlay from '../../components/LoadingOverlay';
import SalonToast from '../appointmentCalendarScreen/components/SalonToast';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import { Store, Client, Services } from '../../utilities/apiWrapper';

import ServiceCard from './components/ServiceCard';
import Guest from './components/Guest';
import styles from './styles';

export const SubTitle = props => (
  <View style={[styles.subTitleContainer, props.style || {}]}>
    <View style={styles.subTitleTextContainer}>
      <Text style={styles.subTitleText}>{props.title.toUpperCase()}</Text>
    </View>
    {props.children}
  </View>
);
SubTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
SubTitle.defaultProps = {
  children: [],
};

export default class NewAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params || {};
    const editType = params.editType || 'new';
    const canSave = screenProps.isNewApptValid;
    const doneButtonStyle = { color: canSave ? 'white' : 'rgba(0,0,0,0.3)' };
    return ({
      headerTitle: editType === 'new' ? 'New Appointment' : 'Modify Appointment',
      headerLeft: (
        <SalonTouchableOpacity onPress={params.handleCancel}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity disabled={!canSave} onPress={params.handleSave}>
          <Text style={[styles.headerButtonText, doneButtonStyle]}>Done</Text>
        </SalonTouchableOpacity>
      ),
    });
  }

  isValidEmailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  isValidPhoneNumberRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  constructor(props) {
    super(props);

    const {
      client,
      editType,
    } = this.props.newAppointmentState;
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
      isValidEmail,
      isValidPhone,
    } = this.getClientInfo(client);
    this.props.navigation.setParams({
      editType,
      handleSave: debounce(this.handleSave, 500),
      handleCancel: debounce(this.handleCancel, 500),
    });
    this.state = {
      toast: null,
      isRecurring: false,
      selectedAddons: [],
      selectedRequired: [],
      selectedRecommended: [],
      clientEmail,
      clientPhone,
      isValidEmail,
      isValidPhone,
      clientPhoneType,
    };
  }

  componentDidMount() {
    this.checkConflicts();
  }

  addService = (service, guestId = false) => {
    const {
      client,
      startTime,
      mainEmployee: employee,
    } = this.props.newAppointmentState;
    const length = this.totalLength();
    const serviceLength = moment.duration(service.maxDuration);
    const fromTime = moment(startTime).add(length);
    const toTime = moment(fromTime).add(serviceLength);

    const newService = {
      service,
      length: serviceLength,
      client: guestId ? get(this.getGuest(guestId), 'client', null) : client,
      requested: true,
      employee,
      fromTime,
      toTime,
      bookBetween: get(service, 'bookBetween', false),
      gapTime: moment.duration(get(service, 'gapDuration', 0)),
      afterTime: moment.duration(get(service, 'afterDuration', 0)),
    };

    // if (service.requireRoom) {
    //   const room = await this.getRoomInfo(service.requireRoom);
    //   if (room) {
    //     newService.room = room;
    //   }
    // }

    // if (service.requiredResourceId) {
    //   const resource = await this.getResourceInfo(service.requiredResourceId);
    //   if (resource) {
    //     newService.resource = resource;
    //   }
    // }

    const newServiceItem = {
      itemId: uuid(),
      guestId,
      service: newService,
    };

    this.props.newAppointmentActions.addServiceItem(newServiceItem);
    setTimeout(() => {
      this.selectExtraServices(newServiceItem);
    });
  }

  createPhonesArr = (phones) => {
    const createPhone = (type) => {
      const cell = phones.find(itm => get(itm, 'type', null) === ClientPhoneTypes[type]);
      if (
        !cell ||
        !cell.value ||
        !cell.value.trim() ||
        !this.isValidPhoneNumberRegExp.test(cell.value)
      ) {
        return { type: ClientPhoneTypes[type], value: '' };
      }
      return cell;
    };
    return [
      createPhone('cell'),
      createPhone('home'),
      createPhone('work'),
    ];
  }

  selectMainEmployee = () => new Promise((resolve) => {
    const { appointmentScreenState: { providers: filterList = false } } = this.props;
    this.props.navigation.navigate('ApptBookProvider', {
      filterList,
      headerProps: {
        title: 'Providers',
        leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
        leftButtonOnPress: navigation => navigation.goBack,
      },
      showFirstAvailable: true,
      showEstimatedTime: true,
      dismissOnSelect: true,
      onChangeProvider: provider => resolve(provider),
    });
  });

  selectExtraServices = (serviceItem) => {
    const { service: { service = null }, itemId } = serviceItem;
    const extras = this.getAddonsForService(itemId);
    const addonIds = extras.filter(itm => itm.type === 'addon').map(itm => itm.service.service.id);
    const recommendedIds = extras.filter(itm => itm.type === 'recommended').map(itm => itm.service.service.id);
    const requiredIds = extras.filter(itm => itm.type === 'required').map(itm => itm.service.service.id);
    this.props.servicesActions.setSelectingExtras(true);
    this.showAddons(service, addonIds)
      .then(selectedAddons => this.setState({ selectedAddons }, () => {
        this.showRecommended(service, recommendedIds)
          .then(selectedRecommended => this.setState({ selectedRecommended }, () => {
            this.showRequired(service, requiredIds)
              .then(selectedRequired => this.setState({ selectedRequired }, () => {
                const {
                  selectedAddons: addons,
                  selectedRequired: required,
                  selectedRecommended: recommended,
                } = this.state;
                this.props.newAppointmentActions.addServiceItemExtras(
                  itemId, // parentId
                  'addon', // extraService type
                  addons,
                );
                this.props.newAppointmentActions.addServiceItemExtras(
                  itemId, // parentId
                  'recommended', // extraService type
                  recommended,
                );
                this.props.newAppointmentActions.addServiceItemExtras(
                  itemId, // parentId
                  'required', // extraService type
                  required,
                );
                this.props.servicesActions.setSelectingExtras(false);
                return this.checkConflicts();
              }))
              .catch(() => {
                this.props.servicesActions.setSelectingExtras(false);
              });
          }));
      }));
  }

  showRequired = (service, selectedIds = []) => new Promise((resolve) => {
    try {
      const {
        navigation: { navigate },
      } = this.props;
      if (service && service.requiredServices.length > 0) {
        if (service.requiredServices.length === 1) {
          Services.getService(service.requiredServices[0].id)
            .then(res => resolve({ name: res.description, ...res }));
        } else {
          navigate('RequiredServices', {
            selectedIds,
            showCancelButton: false,
            services: service.requiredServices,
            serviceTitle: service.name,
            onNavigateBack: this.showPanel,
            onSave: selected => resolve(selected),
          });
        }
      } else {
        resolve([]);
      }
    } catch (err) {
      console.warn(err);
      resolve([]);
    }
  });

  showAddons = (service, selectedIds = []) => new Promise((resolve) => {
    try {
      const {
        navigation: { navigate },
      } = this.props;
      if (service && service.addons.length > 0) {
        navigate('AddonServices', {
          selectedIds,
          showCancelButton: false,
          services: service.addons,
          serviceTitle: service.name,
          onNavigateBack: this.showPanel,
          onSave: services => resolve(services),
        });
      } else {
        resolve([]);
      }
    } catch (err) {
      console.warn(err);
      resolve([]);
    }
  });

  showRecommended = (service, selectedIds = []) => new Promise((resolve) => {
    try {
      const {
        navigation: { navigate },
      } = this.props;
      if (service && service.recommendedServices.length > 0) {
        navigate('RecommendedServices', {
          selectedIds,
          showCancelButton: false,
          services: service.recommendedServices,
          serviceTitle: service.name,
          onNavigateBack: this.showPanel,
          onSave: services => resolve(services),
        });
      } else {
        resolve([]);
      }
    } catch (err) {
      resolve([]);
    }
  });

  shouldUpdateClientInfo = async () => {
    const {
      clientEmail,
      clientPhone,
      isValidEmail: emailValid,
      isValidPhone: phoneValid,
      clientPhoneType,
    } = this.state;
    const { client } = this.props.newAppointmentState;
    const currentPhone = client.phones.find(phone => phone.type === ClientPhoneTypes.cell);
    const hasEmailChanged = clientEmail !== client.email;
    const hasPhoneChanged = clientPhone !== currentPhone.value;
    const isValidEmail = emailValid && clientEmail !== '' && hasEmailChanged;
    const isValidPhone = phoneValid && clientPhone !== '' && hasPhoneChanged;
    if (!isValidEmail && !isValidPhone) {
      return false;
    }
    const phones = isValidPhone && hasPhoneChanged ? [
      {
        type: ClientPhoneTypes.cell,
        value: clientPhone,
      },
      ...client.phones.filter(phone => (
        phone.value &&
        phone.type !== ClientPhoneTypes.cell &&
        this.isValidPhoneNumberRegExp.test(phone.value)
      )),
    ] : client.phones.filter(phone => (
      phone.value &&
      this.isValidPhoneNumberRegExp.test(phone.value)
    ));
    const email = isValidEmail ? clientEmail : client.email;
    const updateObject = {
      id: client.id,
      phones,
      confirmationType: 1,
    };
    if (email) {
      updateObject.email = email;
    }
    const updated = await Client.putContactInformation(
      client.id,
      updateObject,
    );
    return updated;
  }

  onPressService = (serviceId, guestId = false) => {
    const {
      date,
      client: mainClient,
    } = this.props.newAppointmentState;
    const client = guestId ? get(this.getGuest(guestId), 'client', null) : mainClient;
    this.props.navigation.navigate('ModifyApptService', {
      date,
      client,
      serviceItem: this.getServiceItem(serviceId),
      onSaveService: service => this.updateService(serviceId, service, guestId),
      onRemoveService: () => this.removeServiceAlert(serviceId),
    });
  }

  onPressConflicts = (serviceId) => {
    const {
      date,
      startTime,
    } = this.props.newAppointmentState;
    const totalDuration = this.totalLength();
    const endTime = moment(startTime).add(moment.duration(totalDuration));
    const conflicts = this.getConflictsForService(serviceId);
    this.props.navigation.navigate('Conflicts', {
      date,
      conflicts,
      startTime,
      endTime,
    });
  }

  setGuest = (client, guestId) => {
    this.props.newAppointmentActions.setGuestClient(guestId, client);
    this.checkConflicts();
  }

  getGuestServices = guestId => this.props.newAppointmentState.serviceItems.filter(item => item.guestId === guestId && !item.parentId)

  getGuest = guestId => this.props.newAppointmentState.guests.find(item => item.guestId === guestId)

  getServiceItem = serviceId => this.props.newAppointmentState.serviceItems.find(item => item.itemId === serviceId)

  getClientInfo = (client) => {
    const phones = get(client, 'phones', []);
    const phone = phones.find(item => (get(item, 'type', null) === ClientPhoneTypes.cell));
    const clientEmail = get(client, 'email', '') || '';
    const clientPhone = get(phone, 'value', '') || '';
    const clientPhoneType = get(phone, 'type', ClientPhoneTypes.cell);
    return {
      clientPhone: isNull(clientPhone) ? '' : clientPhone,
      clientEmail: isNull(clientEmail) ? '' : clientEmail,
      clientPhoneType,
      isValidEmail: this.emailValidation(clientEmail),
      isValidPhone: this.phoneValidation(clientPhone),
    };
  }

  getRoomInfo = roomId => new Promise((resolve, reject) => {
    Store.getRooms()
      .then(rooms => resolve(rooms.find(room => room.id === roomId)))
      .catch(err => reject(err));
  })

  getResourceInfo = resourceId => new Promise((resolve, reject) => {
    Store.getResources()
      .then(resources => resolve(resources.find(resource => resource.id === resourceId)))
      .catch(err => reject(err));
  })

  getMainServices = () => this.props.newAppointmentState
    .serviceItems.filter(item => !item.guestId && !item.parentId)

  getAddonsForService = serviceId => this.props.newAppointmentState
    .serviceItems.filter(item => item.parentId === serviceId)

  getConflictsForService = serviceId => this.props.newAppointmentState
    .conflicts.filter(conf => conf.associativeKey === serviceId)

  hideToast = () => this.setState({ toast: null })

  updateService = (serviceId, updatedService, guestId = false) => {
    this.props.newAppointmentActions.updateServiceItem(serviceId, updatedService, guestId);
    this.checkConflicts();
  }

  removeServiceAlert = (serviceId) => {
    const { mainEmployee } = this.props.newAppointmentState;
    const serviceItem = this.getServiceItem(serviceId);
    const serviceTitle = get(get(serviceItem.service, 'service', null), 'name', '');
    const employeeName = `${get(bookedByEmployee, 'name', bookedByEmployee.firstName || '')} ${get(bookedByEmployee, 'lastName', '')[0]}.`;
    Alert.alert(
      'Remove Service',
      `Are you sure you want to remove service ${serviceTitle} w/ ${employeeName}?`,
      [
        { text: 'No, Thank You', onPress: () => null },
        { text: 'Yes, Discard', onPress: () => this.removeService(serviceId) },
      ],
    );
  }

  removeService = (serviceId) => {
    this.props.newAppointmentActions.removeServiceItem(serviceId);
    this.checkConflicts();
  }

  onChangeRecurring = isRecurring => isRecurring // this.setState({ isRecurring: !isRecurring });

  onChangeBookedBy = (employee) => {
    this.props.newAppointmentActions.setBookedBy(employee);
  }

  onChangeClient = (client) => {
    const {
      clientEmail,
      clientPhone,
      isValidEmail,
      isValidPhone,
      clientPhoneType,
    } = this.getClientInfo(client);
    this.props.formulaActions.getFormulasAndNotes(client.id);
    this.props.newAppointmentActions.setClient(client);
    this.setState({
      clientEmail,
      clientPhone,
      isValidEmail,
      isValidPhone,
      clientPhoneType,
    }, this.checkConflicts);
  }

  onChangeRemarks = remarks => this.props.newAppointmentActions.setRemarks(remarks)

  onChangeGuestNumber = (action, guestNumber) => {
    if (this.props.newAppointmentState.guests.length < guestNumber) {
      this.props.newAppointmentActions.addGuest();
    } else {
      this.props.newAppointmentActions.removeGuest();
    }
    this.checkConflicts();
  }

  removeGuest = (guestId) => {
    this.props.newAppointmentActions.removeGuest(guestId);
    this.checkConflicts();
  }

  handleAddMainService = () => {
    const { client, mainEmployee } = this.props.newAppointmentState;
    const selectServiceCallback = employee => this.props.navigation.navigate(
      'ApptBookService',
      {
        dismissOnSelect: true,
        selectExtraServices: true,
        filterByProvider: true,
        clientId: client.id,
        employeeId: employee.id,
        onChangeService: this.addService,
      },
    );
    if (isNull(client)) {
      return this.setState({
        toast: {
          text: 'Select a client first',
          type: 'warning',
          btnRightText: 'DISMISS',
        },
      });
    }
    if (isNull(mainEmployee)) {
      return this.selectMainEmployee()
        .then((employee) => {
          this.props.newAppointmentActions.setMainEmployee(employee);
          return selectServiceCallback(employee);
        });
    }
    return selectServiceCallback(mainEmployee);
  }

  changeDateTime = () => this.props.navigation.navigate('ChangeNewApptDateTime')

  checkConflicts = () => this.props.newAppointmentActions.getConflicts(() => this.validate());

  handleAddGuestService = (guestId) => {
    const { mainEmployee } = this.props.newAppointmentState;
    const guest = this.getGuest(guestId);
    const { client = null } = guest;

    if (client !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        selectExtraServices: true,
        filterByProvider: true,
        clientId: get(client, 'id', null),
        employeeId: mainEmployee.id,
        onChangeService: service => this.addService(service, guestId),
      });
    }
    return this.setState({
      toast: {
        text: 'Select a guest first',
        type: 'warning',
        btnRightText: 'DISMISS',
      },
    });
  }

  handleSave = () => {
    const { editType } = this.props.newAppointmentState;

    const successCallback = () => {
      this.props.navigation.goBack();
      this.props.apptBookActions.setGridView();
      this.props.apptBookActions.setToast({
        description: editType === 'edit' ? 'Appointment Modified' : 'Appointment Booked',
        type: 'green',
        btnRightText: 'DISMISS',
      });
    };
    const errorCallback = ({ response: { data: { userMessage: text = 'Unknown appointment api error' } } }) => {
      
      this.setState({
        toast: {
          text: text || 'Unknown appointment api error',
          type: 'error',
          btnRightText: 'DISMISS',
        },
      }, this.checkConflicts);
    };
    if (editType === 'new') {
      if (this.props.isValidAppointment) {
        this.shouldUpdateClientInfo();
        this.props.newAppointmentActions.quickBookAppt(successCallback, errorCallback);
      }
    } else if (editType === 'edit') {
      const { selectedAppt: { id } } = this.props.newAppointmentState;
      this.props.newAppointmentActions.modifyAppt(id, successCallback, errorCallback);
    }
  }

  handleCancel = () => {
    const { editType, serviceItems, mainEmployee } = this.props.newAppointmentState;
    const firstService = serviceItems[0] ? get(serviceItems[0].service, 'service', null) : null;
    const serviceTitle = get(firstService, 'name', null);
    const employeeName = `${get(mainEmployee, 'name', get(mainEmployee, 'firstName', ''))} ${get(mainEmployee, 'lastName', '')[0]}.`;
    let alertBody = '';
    let alertTitle = '';
    switch (editType) {
      case 'edit':
        alertTitle = 'Discard Changes?';
        alertBody = serviceTitle ?
          `Are you sure you want to discard this appointment for service ${serviceTitle} w/ ${employeeName}?` :
          `Are you sure you want to discard this appointment with ${employeeName}?`;
        break;
      case 'new':
      default:
        alertTitle = 'Discard New Appointment?';
        alertBody = serviceTitle ?
          `Are you sure you want to discard this new appointment for service ${serviceTitle} w/ ${employeeName}?` :
          `Are you sure you want to discard this new appointment with ${employeeName}?`;
        break;
    }

    Alert.alert(
      alertTitle,
      alertBody,
      [
        { text: 'No, Thank You', onPress: () => null },
        { text: 'Yes, Discard', onPress: () => this.props.navigation.goBack() },
      ],
    );
  }

  emailValidation = (email) => {
    if (email === '' || isNull(email)) {
      return true;
    }
    return this.isValidEmailRegExp.test(email);
  }

  phoneValidation = (phone) => {
    if (phone === '' || isNull(phone)) {
      return true;
    }
    return this.isValidPhoneNumberRegExp.test(phone);
  }

  onChangeEmail = clientEmail => this.setState({ clientEmail })

  onChangePhone = clientPhone => this.setState({ clientPhone })

  onValidateEmail = (isValid, isFirstValidation) => this.setState((state) => {
    const newState = state;
    const { client } = this.props.newAppointmentState;
    newState.isValidEmail = state.clientEmail === '' ? true : isValid;
    if (!isValid && state.clientEmail !== '' && !!client && !isFirstValidation) {
      newState.toast = {
        text: 'The email you provided is invalid!',
        type: 'error',
        btnRightText: 'DISMISS',
      };
    }
    return newState;
  }, this.shouldUpdateClientInfo)

  onValidatePhone = (isValid, isFirstValidation) => this.setState((state) => {
    const newState = state;
    const { client } = this.props.newAppointmentState;
    newState.isValidPhone = newState.clientPhone === '' ? true : isValid;
    if (!isValid && state.clientPhone !== '' && !!client && !isFirstValidation) {
      newState.toast = {
        text: 'The phone you provided is invalid!',
        type: 'error',
        btnRightText: 'DISMISS',
      };
    }
    return newState;
  }, this.shouldUpdateClientInfo)

  validate = () => {
    const canSave = this.props.isValidAppointment;
    this.props.navigation.setParams({ canSave });
  }

  toggleRecurringPicker = () => this.setState(({ recurringPickerOpen }) => ({ recurringPickerOpen: !recurringPickerOpen }))

  totalPrice = () => this.props.totalPrice

  totalLength = () => this.props.appointmentLength

  resetTimeForServices = (items, index, initialFromTime) => {
    items.forEach((item, i) => {
      if (i > index) {
        const prevItem = items[i - 1];
        item.service.fromTime = (prevItem && prevItem.service.toTime.clone()) || initialFromTime;
        item.service.toTime = item.service.fromTime.clone().add(moment.duration(item.service.toTime));
      }
    });
    return items;
  }

  renderExtraClientButtons = isDisabled => ([
    <SalonTouchableOpacity
      disabled={isDisabled}
      key={Math.random().toString()}
      onPress={() => {
        // const isFormulas = this.props.settingState.data.PrintToTicket === 'Formulas';
        // const url = isFormulas ? 'ClientFormulas' : 'ClientNotes';
        this.props.navigation.navigate(
          'ClientNotes',
          {
            forAppointment: true,
            forSales: false,
            forQueue: false,
            editionMode: false,
            showTagBar:
              false,
            client: this.props.newAppointmentState.client,
          },
        );
      }}
      style={{
        marginHorizontal: 5,
      }}
    >
      <Icon
        name="fileText"
        size={20}
        color={isDisabled ? '#ccc' : '#115ECD'}
        type="regular"
      />
    </SalonTouchableOpacity>,
    <ClientInfoButton
      client={this.props.newAppointmentState.client}
      navigation={this.props.navigation}
      onDonePress={() => { }}
      iconStyle={{ fontSize: 20, color: '#115ECD' }}
      apptBook
      buttonStyle={{
        marginHorizontal: 5,
      }}
    />,
  ]);

  render() {
    const {
      isLoading,
      isBooking,
      date,
      client,
      bookedByEmployee,
      startTime,
      conflicts,
      guests,
      remarks,
      isBookedByFieldEnabled,
      editType,
    } = this.props.newAppointmentState;
    const {
      clientEmail,
      clientPhone,
      isValidEmail,
      isValidPhone,
      toast,
    } = this.state;
    const totalPrice = this.totalPrice();
    const totalDuration = this.totalLength();
    const dividerWithErrorStyle = { backgroundColor: '#D1242A' };

    // const isFormulas = this.props.settingState.data.PrintToTicket === 'Formulas';
    const disabledLabelStyle = {
      fontSize: 14,
      lineHeight: 18,
      color: '#727A8F',
    };
    const isDisabled = this.props.formulasAndNotesState.notes.length < 1;
    const displayDuration = moment.duration(totalDuration).asMilliseconds() === 0 ? '0 min' : `${moment.duration(totalDuration).asMinutes()} min`;
    const guestsLabel = guests.length === 0 || guests.length > 1 ? `${guests.length} Guests` : `${guests.length} Guest`;
    return (
      <View style={styles.container}>
        {(isLoading || isBooking) ? <LoadingOverlay /> : null}
        <ScrollView style={styles.container}>
          <InputGroup style={{ marginTop: 15 }}>
            <ProviderInput
              apptBook
              noAvatar
              label="Booked by"
              placeholder={false}
              showFirstAvailable={editType === 'new'}
              noIcon={!isBookedByFieldEnabled}
              selectedStyle={isBookedByFieldEnabled ? {} : disabledLabelStyle}
              selectedProvider={bookedByEmployee}
              disabled={!isBookedByFieldEnabled}
              onChange={this.onChangeBookedBy}
              navigate={this.props.navigation.navigate}
              headerProps={{
                title: 'Providers',
                leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
                leftButtonOnPress: (navigation) => {
                  navigation.goBack();
                },
              }}
            />
            <InputDivider />
            <InputButton
              label="Date"
              value={`${date.format('ddd, MM/DD/YYYY')}, ${startTime.format('hh:mm A')}`}
              onPress={this.changeDateTime}
            />
          </InputGroup>
          <SectionTitle style={{ height: 46 }} value="Client" />
          <InputGroup>
            <ClientInput
              apptBook
              navigate={this.props.navigation.navigate}
              label={client === null ? 'Select Client' : 'Client'}
              headerProps={{
                title: 'Clients',
                leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
                leftButtonOnPress: (navigation) => {
                  navigation.goBack();
                },
              }}
              selectedClient={client}
              onChange={this.onChangeClient}
              extraComponents={client !== null && this.renderExtraClientButtons(isDisabled)}
            />
            <InputDivider />
            <ValidatableInput
              label="Email"
              value={clientEmail}
              isValid={isValidEmail || !client}
              validation={this.emailValidation}
              onValidated={this.onValidateEmail}
              onChangeText={this.onChangeEmail}
            />
            <InputDivider style={isValidEmail || !client ? {} : dividerWithErrorStyle} />
            <ValidatableInput
              label="Phone"
              mask="[000]-[000]-[0000]"
              isValid={isValidPhone || !client}
              value={clientPhone}
              validation={this.phoneValidation}
              onValidated={this.onValidatePhone}
              onChangeText={this.onChangePhone}
            />
            <InputDivider style={isValidPhone || !client ? {} : dividerWithErrorStyle} />
            <InputNumber
              value={guests.length}
              onChange={this.onChangeGuestNumber}
              label="Multiple Guests"
              singularText="guest"
              pluralText="guests"
            />
          </InputGroup>
          <View>
            <SubTitle title={guests.length > 0 ? 'Main Client' : 'Services'} />
            {this.getMainServices().map((item, itemIndex) => [
              (
                <ServiceCard
                  key={item.itemId}
                  data={item.service}
                  addons={this.getAddonsForService(item.itemId)}
                  onPress={() => this.onPressService(item.itemId)}
                  onSetExtras={() => this.selectExtraServices(item)}
                  conflicts={this.getConflictsForService(item.itemId)}
                  onPressDelete={() => this.removeServiceAlert(item.itemId)}
                  onPressConflicts={() => this.onPressConflicts(item.itemId)}
                />
              ),
              this.getAddonsForService(item.itemId).map(addon => (
                <ServiceCard
                  isAddon
                  key={addon.itemId}
                  data={addon.service}
                  isRequired={addon.isRequired}
                  onPress={() => this.onPressService(addon.itemId)}
                  conflicts={this.getConflictsForService(addon.itemId)}
                  onPressDelete={() => this.removeServiceAlert(addon.itemId)}
                  onPressConflicts={() => this.onPressConflicts(addon.itemId)}
                />
              )),
            ])}
            <AddButton
              style={{
                marginVertical: 5,
                paddingTop: 0,
              }}
              onPress={this.handleAddMainService}
              iconStyle={{ marginLeft: 10, marginRight: 4 }}
              title="add service"
            />
          </View>
          {guests.length > 0 && (
            <View>
              {
                guests.map((guest, guestIndex) => (
                  <View>
                    <Guest
                      index={guestIndex}
                      navigate={this.props.navigation.navigate}
                      selectedClient={guest.client || null}
                      onRemove={() => this.removeGuest(guest.guestId)}
                      onChange={selectedClient => this.setGuest(selectedClient, guest.guestId)}
                    />
                    {
                      this.getGuestServices(guest.guestId).map(item => ([
                        (
                          <ServiceCard
                            key={item.itemId}
                            data={item.service}
                            addons={this.getAddonsForService(item.itemId)}
                            onSetExtras={() => this.selectExtraServices(item)}
                            conflicts={this.getConflictsForService(item.itemId)}
                            onPressDelete={() => this.removeServiceAlert(item.itemId)}
                            onPressConflicts={() => this.onPressConflicts(item.itemId)}
                            onPress={() => this.onPressService(item.itemId, guest.guestId)}
                          />
                        ),
                        this.getAddonsForService(item.itemId).map(addon => (
                          <ServiceCard
                            isAddon
                            key={addon.itemId}
                            data={addon.service}
                            isRequired={addon.isRequired}
                            conflicts={this.getConflictsForService(addon.itemId)}
                            onPressDelete={() => this.removeServiceAlert(addon.itemId)}
                            onPressConflicts={() => this.onPressConflicts(addon.itemId)}
                            onPress={() => this.onPressService(addon.itemId, guest.guestId)}
                          />
                        )),
                      ]))
                    }
                    <AddButton
                      style={{ marginVertical: 5 }}
                      onPress={() => this.handleAddGuestService(guest.guestId)}
                      iconStyle={{ marginLeft: 10, marginRight: 6 }}
                      title="add service"
                    />
                  </View>
                ))
              }
            </View>
          )}
          {this.state.isRecurring && (
            <View>
              <InputGroup style={{ marginVertical: 20 }}>
                <InputSwitch
                  text="Recurring appt."
                  value={this.state.isRecurring}
                  // onChange={this.onChangeRecurring}
                  onChange={() => this.setState({
                    toast: {
                      type: 'info',
                      text: 'API Not implemented',
                    },
                  })}
                />
              </InputGroup>
              <SectionTitle style={{ marginTop: 0, paddingBottom: 12, height: 26 }} value="Repeat Every" />
              <InputGroup>
                <InputButton
                  label="Repeats every"
                  value={`${this.state.recurringNumber} ${this.state.recurringType}`}
                  onPress={this.toggleRecurringPicker}
                  style={{ paddingLeft: 0 }}
                />
                {this.state.recurringPickerOpen && (
                  <View style={{
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                  >
                    <Picker
                      style={{ flex: 1 }}
                      itemStyle={{ backgroundColor: 'white' }}
                      selectedValue={this.state.recurringNumber}
                      pickerData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                      onValueChange={recurringNumber => this.setState({ recurringNumber })}
                    />
                    <Picker
                      style={{ flex: 1 }}
                      itemStyle={{ backgroundColor: 'white' }}
                      selectedValue={this.state.recurringType}
                      pickerData={['Weeks', 'Months']}
                      onValueChange={recurringType => this.setState({ recurringType })}
                    />
                  </View>
                )}
                <InputDivider />
                <InputButton
                  label="On"
                  value="The same day each month"
                  onPress={() => this.props.navigation.navigate('RepeatsOn')}
                  style={{ paddingLeft: 0 }}
                />
                <InputDivider />
                <InputButton
                  label="Ends"
                  value="After 5 ocurrences"
                  onPress={() => this.props.navigation.navigate('EndsOn')}
                  style={{ paddingLeft: 0 }}
                />
              </InputGroup>
              <Text style={{
                fontSize: 12,
                lineHeight: 14,
                color: '#727A8F',
                marginLeft: 16,
                marginTop: 5,
              }}
              >Event will occur every month on the same day each month
              </Text>
            </View>
          )}
          <View style={{ paddingHorizontal: 8, marginVertical: 10 }}>
            <View style={{ height: 2, alignSelf: 'stretch', backgroundColor: '#c2c2c2' }} />
          </View>
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 22,
            justifyContent: 'space-between',
          }}
          >
            <Text style={{
              color: '#C0C1C6',
              fontSize: 11,
            }}
            >TOTAL
            </Text>
            <Text style={{
              fontSize: 16,
              lineHeight: 19,
              fontFamily: 'Roboto-Medium',
              color: '#4D5067',
            }}
            >{`${displayDuration} / $ ${totalPrice}`}
            </Text>
          </View>
          <InputGroup style={{
            marginVertical: 30,
            paddingVertical: 10,
          }}
          >
            <LabeledTextarea
              label="Remarks"
              isEditable
              placeholder="Please specify"
              value={remarks}
              onChangeText={this.onChangeRemarks}
            />
          </InputGroup>
        </ScrollView>
        {
          toast ? (
            <SalonToast
              timeout={5000}
              type={toast.type}
              description={toast.text}
              hide={this.hideToast}
              btnRightText={toast.btnRightText}
            />
          ) : null
        }
      </View>
    );
  }
}
