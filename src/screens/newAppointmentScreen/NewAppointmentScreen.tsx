import * as React from 'react';
import { Text, View, Alert, StyleProp, ViewStyle } from 'react-native';
import moment from 'moment';
import uuid from 'uuid/v4';
import { get, debounce, isNull, values, findKey } from 'lodash';
import deepEqual from 'deep-equal';
import { NavigationEvents } from 'react-navigation';
import { Picker } from 'react-native-wheel-datepicker';
import ClientInfoButton from '@/components/ClientInfoButton';
import ClientPhoneTypes from '@/constants/ClientPhoneTypes';
import SwipeableComponent from '@/components/SwipeableComponent';
import {
  LabeledTextarea,
  InputGroup,
  SectionTitle,
  InputSwitch,
  InputDivider,
  ClientInput,
  InputNumber,
  InputButton,
  ProviderInput,
  ValidatableInput,
} from '@/components/formHelpers';
import { AddButton } from '../appointmentDetailsScreen/components/appointmentDetails';
import Icon from '@/components/common/Icon';
import SalonHeader from '@/components/SalonHeader';
import LoadingOverlay from '@/components/LoadingOverlay';
import SalonToast from '../appointmentCalendarScreen/components/SalonToast';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import { Store, Client, Services } from '@/utilities/apiWrapper';
import ServiceCard from './components/ServiceCard';
import Guest from './components/Guest';
import styles from './styles';
import {
  NewAppointmentScreenProps,
  NewAppointmentScreenState,
  Service,
  Room,
  ServiceItem,
  Maybe,
  ConfirmationType,
  ClientDetailed,
  Client,
} from '@/models';
import { shouldSelectRoom, shouldSelectResource } from './helpers';
import SalonPicker from '@/components/formHelpers/components/SalonPicker';

export const SubTitle = (props: { title: string; style?: StyleProp<ViewStyle>; children?: React.ReactChildren }) => (
  <View style={[styles.subTitleContainer, props.style || {}]}>
    <View style={styles.subTitleTextContainer}>
      <Text style={styles.subTitleText}>{props.title.toUpperCase()}</Text>
    </View>
    {props.children}
  </View>
);

const confirmationTypes = {
  [ConfirmationType.DoNotConfirm]: 'None',
  [ConfirmationType.Email]: 'Email',
  [ConfirmationType.EmailAndSms]: 'Email & SMS',
  [ConfirmationType.Sms]: 'SMS',
};

class NewAppointmentScreen extends React.Component<NewAppointmentScreenProps, NewAppointmentScreenState> {
  static navigationOptions = ({ navigation, screenProps }) => {
    const editType = navigation.getParam('editType', 'new');
    const canSave = navigation.getParam('canSave', false);
    const handleCancel = navigation.getParam('handleCancel');
    const handleSave = navigation.getParam('handleSave');
    const leftButtonStyle = { paddingLeft: 10 };
    const rightButtonStyle = { paddingRight: 10 };
    const doneButtonStyle = { color: canSave ? 'white' : 'rgba(0,0,0,0.3)' };
    return {
      header: (
        <SalonHeader
          title={editType === 'new' ? 'New Appointment' : 'Modify Appointment'}
          headerLeft={
            <SalonTouchableOpacity
              style={leftButtonStyle}
              onPress={handleCancel}
            >
              <Text style={styles.headerButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              disabled={!canSave}
              style={rightButtonStyle}
              onPress={handleSave}
            >
              <Text style={[styles.headerButtonText, doneButtonStyle]}>
                Done
              </Text>
            </SalonTouchableOpacity>
          }
        />
      ),
      gesturesEnabled: false,
    };
  };

  // tslint:disable-next-line:max-line-length
  isValidEmailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isValidPhoneNumberRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  constructor(props: NewAppointmentScreenProps) {
    super(props);
    const { client, editType } = props.newAppointmentState;

    props.navigation.setParams({
      editType,
      handleSave: debounce(this.handleSave, 500),
      handleCancel: debounce(this.handleCancel, 500),
    });
    const { clientEmail, clientPhone, clientPhoneType,
      isValidEmail, isValidPhone, clientConfirmationType } = this.getClientInfo(client as ClientDetailed);
    this.state = {
      toast: null,
      clientEmail,
      clientPhone,
      isValidEmail,
      isValidPhone,
      clientPhoneType,
      clientConfirmationType,
      isRecurring: false,
      selectedAddons: [],
      selectedRequired: [],
      selectedRecommended: [],
      recurringPickerOpen: false,
      confirmationTypePickerOpen: false,
    };
    this.props.navigation.addListener('willFocus', () => {
      const { client, editType } = this.props.newAppointmentState;
      if (editType !== 'new' && client) {
        this.props.navigation.setParams({ editType });
        this.props.formulaActions.getFormulasAndNotes(client.id);
      }

    });
  }

  componentDidMount() {
    this.getClientDetailed();
    this.props.getRestrictions();
    this.props.newAppointmentActions.checkIsBookedByFieldEnabled();
    if (this.props.newAppointmentState.client) {
      this.setState({
        ...this.getClientInfo(this.props.newAppointmentState.client),
      }, this.checkConflicts);
    }
  }

  componentDidUpdate(prevProps: NewAppointmentScreenProps, prevState) {
    if (prevProps.newAppointmentState.serviceItems !== this.props.newAppointmentState.serviceItems) {
      this.shouldSelectResources();
      this.shouldSelectRooms();
    }
    const {
      isValidAppointment,
      newAppointmentState: { client, isPopulatingState, guests, editType },
    } = this.props;
    const { canSave } = this.props.navigation.state.params;

    if (prevProps.newAppointmentState.guests.length < guests.length
      && prevProps.newAppointmentState.guests.length > 0) {
      const guest = guests[guests.length - 1];
      this.handleAddGuestService(guest.guestId);
    }

    const remarksChanged = prevProps.newAppointmentState.remarks !== this.props.newAppointmentState.remarks;
    if (
      isPopulatingState !== prevProps.newAppointmentState.isPopulatingState
    ) {
      if (client) {
        this.setState({ ...this.getClientInfo(client) }, () => {
          this.getClientDetailed();
        });
      }

    }
    if (
      remarksChanged ||
      (isValidAppointment !== prevProps.isValidAppointment && isValidAppointment !== canSave) ||
      editType !== prevProps.newAppointmentState.editType
    ) {
      this.validate();
    }
  }

  getClientDetailed = async () => {
    const { client } = this.props.newAppointmentState;
    if (get(client, 'id')) {
      const clientDetailed = await Client.getClient(client.id);
      this.props.newAppointmentActions.setClient(clientDetailed);
      this.props.newAppointmentActions.setApptInitialClient(clientDetailed);
      this.setState({
        ...this.getClientInfo(clientDetailed as ClientDetailed),
      });
    }
  };
  addService = (service, provider = null, guestId: string = undefined, isGuest: boolean = false) => {
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
      room: null,
      roomOrdinal: null,
      resource: null,
      resourceOrdinal: null,
      length: serviceLength,
      client: guestId ? get(this.getGuest(guestId), 'client', null) : client,
      requested: true,
      employee: provider || employee,
      fromTime,
      toTime,
      bookBetween: get(service, 'bookBetween', false),
      gapTime: moment.duration(get(service, 'gapDuration', 0)),
      afterTime: moment.duration(get(service, 'afterDuration', 0)),
    } as ServiceItem['service'];
    const newServiceItem = {
      itemId: uuid(),
      guestId,
      service: newService,
      isGuest,
    };
    this.props.newAppointmentActions.addServiceItem(newServiceItem);
    setTimeout(() => this.selectExtraServices(newServiceItem));
  };

  selectExtraServices = serviceItem => {
    const {
      service: { service = null },
      itemId,
    } = serviceItem;
    const extras = this.getAddonsForService(itemId, this.props.newAppointmentState.serviceItems);

    const addonIds = extras.filter(itm => itm.type === 'addon').map(itm => itm.service.service.id);
    const recommendedIds = extras.filter(itm => itm.type === 'recommended').map(itm => itm.service.service.id);
    const requiredIds = extras.filter(itm => itm.type === 'required').map(itm => itm.service.service.id);
    this.props.servicesActions.setSelectingExtras(true);
    this.showAddons(service, addonIds).then(selectedAddons =>
      this.setState({ selectedAddons }, () => {
        this.showRecommended(service, recommendedIds).then(selectedRecommended =>
          this.setState({ selectedRecommended }, () => {
            this.showRequired(service, requiredIds)
              .then(selectedRequired =>
                this.setState({ selectedRequired }, async () => {
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
                }),
              )
              .catch(() => {
                this.props.servicesActions.setSelectingExtras(false);
              });
          }),
        );
      }),
    );
  };

  showRequired = (service, selectedIds = []): Promise<Service[] | Service> =>
    new Promise(resolve => {
      try {
        const {
          navigation: { navigate },
        } = this.props;
        if (service && service.requiredServices.length > 0) {
          if (service.requiredServices.length === 1) {
            Services.getService(service.requiredServices[0].id).then(res => resolve({ name: res.description, ...res }));
          } else {
            navigate('RequiredServices', {
              selectedIds,
              showCancelButton: false,
              services: service.requiredServices,
              serviceTitle: service.name,
              onSave: (selected: Service[]) => resolve(selected),
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

  showAddons = (service, selectedIds = []): Promise<Service[]> => {
    return new Promise(resolve => {
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
            onSave: (services: Service[]) => resolve(services),
          });
        } else {
          resolve([]);
        }
      } catch (err) {
        console.warn(err);
        resolve([]);
      }
    });
  };

  showRecommended = (service, selectedIds = []): Promise<Service[]> =>
    new Promise(resolve => {
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
            onSave: (services: Service[]) => resolve(services),
          });
        } else {
          resolve([]);
        }
      } catch (err) {
        resolve([]);
      }
    });

  shouldSelectRooms = () => {
    const { newAppointmentState: { serviceItems } } = this.props;
    const shouldNavigate = serviceItems.reduce((agg, itm) => agg || shouldSelectRoom(itm), false);
    if (shouldNavigate) {
      this.props.navigation.navigate('SelectRoom', { onNavigateBack: () => this.checkConflicts() });
    } else {
      return false;
    }
  };

  shouldSelectResources = () => {
    const { newAppointmentState: { serviceItems } } = this.props;
    const shouldNavigate = serviceItems.reduce((agg, itm) => agg || shouldSelectResource(itm), false);
    if (shouldNavigate) {
      this.props.navigation.navigate('SelectResource', { onNavigateBack: () => this.checkConflicts() });
    } else {
      return false;
    }
  };


  getClientUpdateObject = () => {
    const { client } = this.props.newAppointmentState;
    const {
      clientEmail,
      clientPhone,
      isValidEmail: emailValid,
      isValidPhone: phoneValid,
      clientConfirmationType,
    } = this.state;

    if (!client) {
      // nothing to update;
      return;
    }

    const currentPhone = client.phones.find(phone => phone.type === ClientPhoneTypes.cell);
    const hasConfirmationTypeChanged =
      get(client, 'contactType') ? clientConfirmationType !== get(client, 'contactType') : clientConfirmationType;
    const hasEmailChanged = clientEmail !== client.email;
    const hasPhoneChanged = clientPhone !== currentPhone.value;
    const isValidEmail = emailValid && clientEmail !== '' && hasEmailChanged;
    const isValidPhone = phoneValid && clientPhone !== '' && hasPhoneChanged;
    if (!isValidEmail && !isValidPhone) {
      if (hasConfirmationTypeChanged) {
        const updateObject = {
          id: client.id,
          phones: client.phones.filter(item => item.value !== null),
          confirmationType: +clientConfirmationType,
          email: client.email,
        };
        return updateObject;
      }
      return;
    }
    const phones =
      isValidPhone && hasPhoneChanged
        ? [
          {
            type: ClientPhoneTypes.cell,
            value: clientPhone,
          },
          ...client.phones.filter(
            phone =>
              phone.value &&
              phone.type !== ClientPhoneTypes.cell &&
              this.isValidPhoneNumberRegExp.test(phone.value),
          ),
        ]
        : client.phones.filter(phone => phone.value && this.isValidPhoneNumberRegExp.test(phone.value));



    const updateObject = {
      id: client.id,
      phones,
      confirmationType: +clientConfirmationType,
      email: isValidEmail ? clientEmail : client.email,
    };


    return updateObject;
  };

  shouldUpdateClientInfo = async () => {

    const { client } = this.props.newAppointmentState;

    const {
      isValidEmail,
      isValidPhone,
      clientConfirmationType,
    } = this.state;

    if (isValidEmail && isValidPhone && clientConfirmationType && client) {
      try {
        const updateObject = this.getClientUpdateObject();
        return await Client.putContactInformation(client.id, updateObject);
      } catch (error) {
        console.warn('Error updating client info:', error);
      }
    }
  };

  onPressService = (serviceId, guestId?) => {
    const item = this.getServiceItem(serviceId);
    const isOnlyMainService = this.isOnlyMainService(item);
    const { date, client: mainClient } = this.props.newAppointmentState;
    const client = guestId ? get(this.getGuest(guestId), 'client', null) : mainClient;
    this.props.navigation.navigate('ModifyApptService', {
      date,
      client,
      serviceItem: this.getServiceItem(serviceId),
      isOnlyMainService,
      onSaveService: service => {
        if (
          isOnlyMainService &&
          (item && item.service && item.service.service && item.service.service.id) !==
          (service && service.service && service.service.id)
        ) {
          setTimeout(() => {
            this.selectExtraServices({
              itemId: serviceId,
              service,
            });
          });
        }
        return this.updateService(serviceId, service, guestId);
      },
      onRemoveService: () => this.removeServiceAlert(serviceId),
    });
  };

  onPressConflicts = serviceId => {
    const { date, startTime } = this.props.newAppointmentState;
    const totalDuration = this.totalLength();
    const endTime = moment(startTime).add(moment.duration(totalDuration));
    const conflicts = this.getConflictsForService(serviceId);
    this.props.navigation.navigate('Conflicts', {
      date,
      conflicts,
      startTime,
      endTime,
    });
  };

  setGuest = (client, guestId) => {
    this.props.newAppointmentActions.setGuestClient(guestId, client);
    this.checkConflicts();
  };

  getGuestServices = guestId =>
    this.props.newAppointmentState.serviceItems.filter(item => item.guestId === guestId && item.isGuest);

  getGuest = guestId => this.props.newAppointmentState.guests.find(item => item.guestId === guestId);

  getServiceItem = serviceId => this.props.newAppointmentState.serviceItems.find(item => item.itemId === serviceId);

  getClientInfo = (client: ClientDetailed) => {
    const phones = get(client, 'phones', []);
    const phone = phones.find(item => get(item, 'type', null) === ClientPhoneTypes.cell);
    const clientEmail = get(client, 'email', '') || '';
    const clientPhone = get(phone, 'value', '') || '';
    const clientPhoneType = get(phone, 'type', ClientPhoneTypes.cell);
    const clientConfirmationType = get(client, 'contactType', ConfirmationType.Email);
    return {
      clientPhoneType,
      clientConfirmationType,
      clientPhone: isNull(clientPhone) ? '' : clientPhone,
      clientEmail: isNull(clientEmail) ? '' : clientEmail,
      isValidEmail: this.validationWithUpdate('clientEmail', 'isValidEmailRegExp', true),
      isValidPhone: this.validationWithUpdate('clientPhone', 'isValidPhoneNumberRegExp', true),
    };
  };

  getMainServices = serviceItems => serviceItems.filter(item => this.isMainService(item));

  getAddonsForService = (serviceId, serviceItems) => serviceItems.filter(item => item.parentId === serviceId);

  getConflictsForService = serviceId =>
    this.props.newAppointmentState.conflicts.filter(conf => conf.associativeKey === serviceId);

  isMainService = item => !item.isGuest && !item.parentId;

  hideToast = () => this.setState({ toast: null });

  updateService = (serviceId, updatedService, guestId?: string) => {
    this.props.newAppointmentActions.updateServiceItem(
      serviceId,
      updatedService,
      guestId,
    );
    this.checkConflicts();
  };

  isOnlyMainService = serviceItem =>
    this.isMainService(serviceItem) && this.getMainServices(this.props.newAppointmentState.serviceItems).length <= 1;

  removeServiceAlert = serviceId => {
    const serviceItem = this.getServiceItem(serviceId);
    const serviceTitle = get(serviceItem, 'service.service.name', get(serviceItem, 'service.service.description', ''));
    const employee = get(serviceItem, 'service.employee', null);
    const employeeName = employee.isFirstAvailable
      ? 'First Available'
      : `${get(employee, 'name', employee.firstName || '')} ${get(employee, 'lastName', '')[0]}.`;

    if (this.isOnlyMainService(serviceItem)) {
      Alert.alert('Something went wrong', 'You need minimum 1 service', [{ text: 'Ok, got it', onPress: () => null }]);
    } else {
      Alert.alert('Remove Service', `Are you sure you want to remove service ${serviceTitle} w/ ${employeeName}?`, [
        { text: 'No, Thank You', onPress: () => null },
        { text: 'Yes, Discard', onPress: () => this.removeService(serviceId) },
      ]);
    }
  };

  removeService = serviceId => {
    this.props.newAppointmentActions.removeServiceItem(serviceId);
    this.checkConflicts();
  };

  onChangeRecurring = isRecurring => isRecurring; // this.setState({ isRecurring: !isRecurring });

  onChangeBookedBy = employee => {
    this.props.newAppointmentActions.setBookedBy(employee);
  };

  onChangeClient = async (client, handleAddService = true) => {
    const clientDetailed = await Client.getClient(get(client, 'id'));
    const {
      clientEmail,
      clientPhone,
      isValidEmail,
      isValidPhone,
      clientPhoneType,
      clientConfirmationType,
    } = this.getClientInfo(clientDetailed as ClientDetailed);
    this.props.formulaActions.getFormulasAndNotes(client.id);
    this.props.newAppointmentActions.setClient(client);
    this.setState(
      {
        clientEmail,
        clientPhone,
        isValidEmail,
        isValidPhone,
        clientPhoneType,
        clientConfirmationType,
      },
      () => {
        this.checkConflicts();
        if (handleAddService) {
          this.handleAddMainService();
        }
      },
    );
  };

  onChangeRemarks = remarks => this.props.newAppointmentActions.setRemarks(remarks);

  addGuest = () => {
    this.props.navigation.navigate('ApptBookClient', {
      onChangeWithNavigation: (client, nav) => {
        this.props.newAppointmentActions.addGuest(client);
        nav.goBack();
      },
    });
  };

  onChangeGuestNumber = (action, guestNumber) => {
    if (this.props.newAppointmentState.guests.length < guestNumber) {
      this.addGuest();
      // this.props.newAppointmentActions.addGuest();
    } else {
      this.props.newAppointmentActions.removeGuest();
    }
    this.checkConflicts();
  };

  removeGuest = guestId => {
    this.props.newAppointmentActions.removeGuest(guestId);
    this.checkConflicts();
  };

  handleAddMainService = () => {
    const { client, date, mainEmployee } = this.props.newAppointmentState;
    if (isNull(client)) {
      return this.setState({
        toast: {
          text: 'Select a client first',
          type: 'warning',
          btnRightText: 'DISMISS',
        },
      });
    }
    this.props.checkRestrictionsAddService(() => this.props.navigation.navigate('ApptBookService', {
      dismissOnSelect: true,
      selectExtraServices: true,
      filterByProvider: true,
      client,
      selectedProvider: mainEmployee,
      onChangeService: service => {
        this.addService(service, mainEmployee);
      },
    }));
  };

  changeDateTime = () => this.props.navigation.navigate('ChangeNewApptDateTime');

  checkConflicts = () => {
    if (!this.shouldSelectRooms()) {
      if (!this.shouldSelectResources()) {
        this.props.newAppointmentActions.getConflicts(() => {
          this.validate();
        });
      }
    }
  };

  handleAddGuestService = guestId => {
    const { date, mainEmployee } = this.props.newAppointmentState;
    const guest = this.getGuest(guestId);
    const { client = null } = guest;

    if (client !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        selectExtraServices: true,
        filterByProvider: true,
        clientId: get(client, 'id', null),
        selectedProvider: mainEmployee,
        employeeId: mainEmployee.id,
        onChangeService: service => {
          this.addService(service, mainEmployee, guestId, true);
        },
      });
    }
    return this.setState({
      toast: {
        text: 'Select a guest first',
        type: 'warning',
        btnRightText: 'DISMISS',
      },
    });
  };

  handleSave = () => {
    const { editType } = this.props.newAppointmentState;

    const successCallback = () => {
      const { date } = this.props.newAppointmentState;
      this.props.navigation.goBack();
      this.props.newAppointmentActions.setClient(null);
      this.props.apptBookActions.setProviderScheduleDates(date, date);
      this.props.apptBookActions.setGridView();
      this.props.apptBookActions.setToast({
        description: editType === 'edit' ? 'Appointment Modified' : 'Appointment Booked',
        type: 'green',
        btnRightText: 'DISMISS',
      });

      const params = this.props.navigation.state.params || {};
      const rebook = params.rebook || false;

      if (rebook) {
        params.onFinishRebook();
      }
    };
    const errorCallback = () => this.checkConflicts();
    this.shouldUpdateClientInfo();
    if (editType === 'new') {
      if (this.props.isValidAppointment) {
        this.props.newAppointmentActions.quickBookAppt(successCallback, errorCallback);
      }
    } else if (editType === 'edit') {
      const {
        selectedAppt: { id },
      } = this.props.newAppointmentState;
      const clientUpdateObject = this.getClientUpdateObject();
      this.props.newAppointmentActions.modifyAppt(id, clientUpdateObject, successCallback, errorCallback);
    }
  };

  handleCancel = () => {
    this.shouldUpdateClientInfo();
    const { editType, serviceItems, mainEmployee } = this.props.newAppointmentState;
    const firstService = serviceItems[0] ? get(serviceItems[0].service, 'service', null) : null;
    const serviceTitle = get(firstService, 'name', null);
    const employeeName =
      `${get(mainEmployee, 'name', get(mainEmployee, 'firstName', ''))} ${
        get(mainEmployee, 'lastName', '')[0]
        }.`;
    let alertBody = '';
    let alertTitle = '';
    switch (editType) {
      case 'edit': {
        const hasChanges = this.lookForChanges();
        if (hasChanges) {
          alertTitle = 'Discard Changes?';

          alertBody = serviceTitle
            ? `Are you sure you want to discard this appointment for service ${serviceTitle} w/ ${employeeName}?`
            : 'Are you sure you want to discard your changes to these appointments?';
        }
        break;
      }
      case 'new':
      default:
        alertTitle = 'Discard New Appointment?';
        alertBody = serviceTitle
          ? `Are you sure you want to discard this new appointment for service ${serviceTitle} w/ ${employeeName}?`
          : 'Are you sure you want to discard your changes to these appointments?';
        break;
    }
    if (alertTitle) {
      Alert.alert(alertTitle, alertBody, [
        { text: 'No, Thank You', onPress: () => null },
        {
          text: 'Yes, Discard',
          onPress: () => {
            this.props.newAppointmentActions.setClient(null);
            this.props.navigation.goBack();
            this.props.apptBookActions.setGridView();
          },
        },
      ]);
    } else {
      this.props.newAppointmentActions.setClient(null);
      this.props.navigation.goBack();
      this.props.apptBookActions.setGridView();
    }
  };

  validationWithUpdate = (nameState, nameValidation, isNeedUpdate) => {
    const target = this.state && this.state[nameState];

    if (target === '' || isNull(target)) {
      return true;
    }

    let isValid = this[nameValidation].test(target);
    if (nameValidation === 'isValidEmailRegExp') {
      isValid = isValid || target === 'will-not-provide'
    }
    return isValid;
  };

  onChangeEmail = clientEmail => this.setState({ clientEmail }, this.validate);

  onChangePhone = clientPhone => this.setState({ clientPhone }, this.validate);

  onValidateEmail = (isValid, isFirstValidation) =>
    this.setState(state => {
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
    }, this.shouldUpdateClientInfo);

  onValidatePhone = (isValid, isFirstValidation) =>
    this.setState(state => {
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
    }, this.shouldUpdateClientInfo);

  lookForChanges = () => {
    const {
      initialState,
      startTime,
      date,
      client,
      remarks,
      bookedByEmployee,
      guests,
      serviceItems,
      initialApptClient,
    } = this.props.newAppointmentState;
    const { clientEmail, clientPhone, clientConfirmationType } = this.state;
    const diffDate = !date.isSame(initialState.date);
    const diffTime = !startTime.isSame(initialState.startTime);
    const initialClientInfo = this.getClientInfo(initialApptClient as ClientDetailed);
    const diffRemarks = remarks !== initialState.remarks;
    const diffClient = get(client, 'id', -1) !== get(initialState.client, 'id', -1);
    let diffEmail = clientEmail !== this.getClientInfo(initialState.client).clientEmail;
    let diffPhone = clientPhone !== this.getClientInfo(initialState.client).clientPhone;
    const diffConfirmationType =
      clientConfirmationType !== initialClientInfo.clientConfirmationType;
    const diffBookedByEmployee = get(bookedByEmployee, 'id', -1) !== get(initialState.bookedByEmployee, 'id', -1);
    const diffGuests = !deepEqual(guests, initialState.guests, { strict: true });
    const diffServices = !deepEqual(serviceItems, initialState.serviceItems, {
      strict: true,
    });

    if (!clientEmail) {
      diffEmail = false;
    }

    if (!clientPhone) {
      diffPhone = false;
    }

    return (
      diffDate ||
      diffEmail ||
      diffPhone ||
      diffTime ||
      diffRemarks ||
      diffClient ||
      diffServices ||
      diffGuests ||
      diffBookedByEmployee ||
      diffConfirmationType
    );
  };

  validate = () => {
    const { editType, initialState } = this.props.newAppointmentState;
    const isEmailValide = this.validationWithUpdate('clientEmail', 'isValidEmailRegExp', false);
    const isPhoneValid = this.validationWithUpdate('clientPhone', 'isValidPhoneNumberRegExp', false);
    let canSave = this.props.isValidAppointment;
    if (editType === 'edit') {
      if (initialState && isPhoneValid && isEmailValide) {
        canSave = canSave && this.lookForChanges();
      } else {
        canSave = false;
      }
    }
    this.props.navigation.setParams({ editType, canSave });
  };

  toggleRecurringPicker = () =>
    this.setState(({ recurringPickerOpen }) => ({
      recurringPickerOpen: !recurringPickerOpen,
    }));

  totalPrice = () => this.props.totalPrice;

  totalLength = () => this.props.appointmentLength;

  toggleConfirmationTypePicker = () => this.setState(
    ({ confirmationTypePickerOpen: prev }) => ({ confirmationTypePickerOpen: !prev }),
  );

  onChangeConfirmationType = (value: string, index: number) => {
    const clientConfirmationType = findKey(confirmationTypes, itm => itm === value);
    this.setState({
      clientConfirmationType,
    }, this.shouldUpdateClientInfo);
  };

  resetTimeForServices = (items, index, initialFromTime) => {
    items.forEach((item, i) => {
      if (i > index) {
        const prevItem = items[i - 1];
        item.service.fromTime = (prevItem && prevItem.service.toTime.clone()) || initialFromTime;
        item.service.toTime = item.service.fromTime.clone().add(moment.duration(item.service.toTime));
      }
    });
    return items;
  };

  renderExtraClientButtons = isDisabled => (
    <React.Fragment>
      <SalonTouchableOpacity
        disabled={isDisabled}
        key={Math.random().toString()}
        onPress={() => {
          this.props.navigation.navigate('ClientNotes', {
            forAppointment: true,
            forSales: false,
            forQueue: false,
            editionMode: false,
            showTagBar: false,
            client: this.props.newAppointmentState.client,
          });
        }}
        style={{
          marginHorizontal: 5,
        }}
      >
        <Icon name="fileText" size={20} color={isDisabled ? '#ccc' : '#115ECD'} type="regular" />
      </SalonTouchableOpacity>
      <ClientInfoButton
        client={this.props.newAppointmentState.client}
        navigation={this.props.navigation}
        onDismiss={(client) => {
          if (client) {
            this.onChangeClient(client, false);
          }
        }}
        onDonePress={() => {
        }}
        iconStyle={{ fontSize: 20, color: '#115ECD' }}
        apptBook
        buttonStyle={{
          marginHorizontal: 5,
        }}
      />
    </React.Fragment>
  );

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
      serviceItems,
    } = this.props.newAppointmentState;

    const isLoadingNotes = this.props.formulasAndNotesState.isLoading;
    const {
      clientEmail,
      clientPhone,
      isValidEmail,
      isValidPhone,
      toast,
      clientConfirmationType,
      confirmationTypePickerOpen,
    } = this.state;
    const totalPrice = this.totalPrice();
    const totalDuration = this.totalLength();
    const dividerWithErrorStyle = { backgroundColor: '#D1242A' };
    const disabledLabelStyle = {
      fontSize: 14,
      lineHeight: 18,
      color: '#727A8F',
    };
    const isDisabled =
      this.props.formulasAndNotesState.notes.filter(
        itm =>
          itm.isDeleted === false &&
          !(itm.expiration ? moment(itm.expiration).isSameOrBefore(moment().startOf('day')) : false),
      ).length < 1;
    const displayDuration =
      moment.duration(totalDuration).asMilliseconds() === 0
        ? '0 min'
        : `${moment.duration(totalDuration).asMinutes()} min`;
    const guestsLabel = guests.length === 0 || guests.length > 1 ? `${guests.length} Guests` : `${guests.length} Guest`;

    const mainServices = this.getMainServices(serviceItems);
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.validate} />
        {isLoading || isBooking || isLoadingNotes ? <LoadingOverlay /> : null}
        <SwipeableComponent onSwipeRight={this.handleCancel}>
          <InputGroup style={{ marginTop: 15 }}>
            <ProviderInput
              apptBook
              noAvatar
              label="Booked by"
              placeholder={false}
              showFirstAvailable={false}
              icon={isBookedByFieldEnabled ? 'default' : false}
              selectedStyle={isBookedByFieldEnabled ? {} : disabledLabelStyle}
              selectedProvider={bookedByEmployee}
              disabled={!isBookedByFieldEnabled}
              onChange={this.onChangeBookedBy}
              navigate={this.props.navigation.navigate}
              headerProps={{
                title: 'Providers',
                leftButton: (
                  <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
                ),
                leftButtonOnPress: navigation => {
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
                leftButton: (
                  <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
                ),
                leftButtonOnPress: navigation => {
                  navigation.goBack();
                },
              }}
              selectedClient={client}
              onChange={this.onChangeClient}
              extraComponents={
                client !== null && this.renderExtraClientButtons(isDisabled)
              }
            />
            <InputDivider />
            {
              !this.props.apptViewContactInfoIsDisabled &&
              <React.Fragment>
                <ValidatableInput
                  label="Email"
                  value={clientEmail}
                  isValid={isValidEmail || !client}
                  validation={() => this.validationWithUpdate('clientEmail', 'isValidEmailRegExp', true)}
                  onValidated={this.onValidateEmail}
                  onChangeText={this.onChangeEmail}
                />
                < InputDivider
                  style={isValidEmail || !client ? {} : dividerWithErrorStyle}
                />
              </React.Fragment>
            }
            {
              !this.props.apptViewContactInfoIsDisabled &&
              <React.Fragment>
                <ValidatableInput
                  label="Phone"
                  mask="[000]-[000]-[0000]"
                  isValid={isValidPhone || !client}
                  value={clientPhone}
                  validation={() => this.validationWithUpdate('clientPhone', 'isValidPhoneNumberRegExp', true)}
                  onValidated={this.onValidatePhone}
                  onChangeText={this.onChangePhone}
                />
                < InputDivider
                  style={isValidPhone || !client ? {} : dividerWithErrorStyle}
                />
              </React.Fragment>
            }
            <SalonPicker
              label="Confirmation Type"
              isOpen={confirmationTypePickerOpen}
              toggle={this.toggleConfirmationTypePicker}
              onChange={this.onChangeConfirmationType}
              pickerData={values(confirmationTypes)}
              selectedValue={confirmationTypes[clientConfirmationType]}
            />
            <InputDivider />
            <InputNumber
              value={guests.length}
              onChange={this.onChangeGuestNumber}
              label="Multiple Guests"
              singularText="guest"
              pluralText="guests"
            />
          </InputGroup>
          <View>
            <SubTitle
              title={guests.length > 0 ? 'Main Client' : 'Services'}
            />
            {mainServices.map(item => {
              const addonItems = this.getAddonsForService(item.itemId, serviceItems);
              return (
                <React.Fragment key={item.itemId}>
                  <ServiceCard
                    key={`service_card_${item.itemId}`}
                    data={item.service}
                    isOnlyMainService={this.isOnlyMainService(item)}
                    addons={this.getAddonsForService(item.itemId, serviceItems)}
                    onPress={() => this.onPressService(item.itemId)}
                    onSetExtras={() => this.selectExtraServices(item)}
                    conflicts={this.getConflictsForService(item.itemId)}
                    onPressDelete={() => this.removeServiceAlert(item.itemId)}
                    onPressConflicts={() => this.onPressConflicts(item.itemId)}
                    isGotAddon={addonItems.length}
                  />
                  {
                    addonItems.map(addon => {
                      const addonOnPress = () => this.onPressService(addon.itemId);
                      const addonDelete = () => this.removeServiceAlert(addon.itemId);
                      const addonConflicts = () =>
                        this.onPressConflicts(addon.itemId);
                      return (
                        <ServiceCard
                          isAddon
                          key={`addon_card_${addon.itemId}`}
                          data={addon.service}
                          isRequired={addon.isRequired}
                          onPress={addonOnPress}
                          conflicts={this.getConflictsForService(addon.itemId)}
                          onPressDelete={addonDelete}
                          onPressConflicts={addonConflicts}
                        />
                      );
                    })
                  }
                </React.Fragment>
              );
            })}
            <AddButton
              style={{ marginVertical: 5, paddingTop: 0 }}
              disabled={this.props.apptAddServiceIsDisabled}
              isLoading={this.props.apptAddServiceIsLoading}
              onPress={this.handleAddMainService}
              iconStyle={{ marginLeft: 10, marginRight: 4 }}
              title="add service"
            />
          </View>
          {guests.length > 0 && (
            <View>
              {guests.map((guest, guestIndex) => (
                <View>
                  <Guest
                    index={guestIndex}
                    navigate={this.props.navigation.navigate}
                    selectedClient={guest.client || null}
                    onRemove={() => this.removeGuest(guest.guestId)}
                    onChange={selectedClient => this.setGuest(selectedClient, guest.guestId)}
                  />
                  {this.getGuestServices(guest.guestId).map(item => {
                    const addonItems = this.getAddonsForService(item.itemId, serviceItems);
                    return (
                      <React.Fragment key={item.itemId}>
                        <ServiceCard
                          key={item.itemId}
                          data={item.service}
                          addons={this.getAddonsForService(item.itemId, serviceItems)}
                          onSetExtras={() => this.selectExtraServices(item)}
                          conflicts={this.getConflictsForService(item.itemId)}
                          onPressDelete={() => this.removeServiceAlert(item.itemId)}
                          onPressConflicts={() => this.onPressConflicts(item.itemId)}
                          onPress={() => this.onPressService(item.itemId, guest.guestId)}
                          isGotAddon={addonItems.length}
                        />
                        {addonItems.map(addon => (
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
                        ))}
                      </React.Fragment>
                    );
                  })}
                  <AddButton
                    style={{ marginVertical: 5 }}
                    onPress={() => this.handleAddGuestService(guest.guestId)}
                    iconStyle={{ marginLeft: 10, marginRight: 6 }}
                    title="add service"
                  />
                </View>
              ))}
            </View>
          )}
          {this.state.isRecurring && (
            <View>
              <InputGroup style={{ marginVertical: 20 }}>
                <InputSwitch
                  text="Recurring appt."
                  value={this.state.isRecurring}
                  onChange={() =>
                    this.setState({
                      toast: {
                        type: 'info',
                        text: 'API Not implemented',
                      },
                    })
                  }
                />
              </InputGroup>
              <AddButton
                style={{ marginVertical: 5 }}
                onPress={() => this.handleAddGuestService(guest.guestId)}
                iconStyle={{ marginLeft: 10, marginRight: 6 }}
                title="add service"
              />
            </View>
          )}
          {this.state.isRecurring && (
            <View>
              <InputGroup style={{ marginVertical: 20 }}>
                <InputSwitch
                  text="Recurring appt."
                  value={this.state.isRecurring}
                  onChange={() =>
                    this.setState({
                      toast: {
                        type: 'info',
                        text: 'API Not implemented',
                      },
                    })
                  }
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
                  <View
                    style={{
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
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 14,
                  color: '#727A8F',
                  marginLeft: 16,
                  marginTop: 5,
                }}
              >
                Event will occur every month on the same day each month
              </Text>
            </View>
          )}
          <View style={{ paddingHorizontal: 8, marginVertical: 10 }}>
            <View
              style={{
                height: 2,
                alignSelf: 'stretch',
                backgroundColor: '#c2c2c2',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 22,
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                color: '#C0C1C6',
                fontSize: 11,
              }}
            >
              TOTAL
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                fontFamily: 'Roboto-Medium',
                color: '#4D5067',
              }}
            >
              {`${displayDuration} / $ ${totalPrice}`}
            </Text>
          </View>
          <InputGroup
            style={{
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
        </SwipeableComponent>
        {toast ? (
          <SalonToast
            timeout={5000}
            type={toast.type}
            description={toast.text}
            hide={this.hideToast}
            btnRightText={toast.btnRightText}
          />
        ) : null}
      </View>
    );
  }
}

export default NewAppointmentScreen;
