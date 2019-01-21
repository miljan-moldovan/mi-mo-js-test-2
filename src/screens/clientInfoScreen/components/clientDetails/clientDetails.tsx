import * as React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import moment from 'moment';
import { find, reject, get, cloneDeep, set } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
  InputDivider,
  SectionTitle,
  LabeledTextInput,
  InputPicker,
  ClientInput,
  SectionDivider,
  InputSwitch,
  ValidatableInput,
  InputButton,
} from '../../../../components/formHelpers';
import SalonTimePicker from '../../../../components/formHelpers/components/SalonTimePicker';

import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import usStates from '../../../../constants/UsStates';
import gendersEnum from '../../../../constants/Genders';
import addressModesEnum from '../../../../constants/AddressModes';
import agesEnum from '../../../../constants/Ages';
import confirmByTypesEnum from '../../../../constants/ClientConfirmByTypes';
import regexs from '../../../../constants/Regexs';
import createStyleSheet from './styles';

const declineState = { key: 0, value: 'N/A' };

const genders = [
  { key: gendersEnum.Unspecified, value: 'unspecified' },
  { key: gendersEnum.Male, value: 'male' },
  { key: gendersEnum.Female, value: 'female' },
];

const ages = [
  { key: agesEnum.Child, value: 'Child' },
  { key: agesEnum.Adult, value: 'Adult' },
  { key: agesEnum.Senior, value: 'Senior' },
];

const confirmByTypes = [
  { key: confirmByTypesEnum.Email, value: 'Email' },
  { key: confirmByTypesEnum.Sms, value: 'Sms' },
  { key: confirmByTypesEnum.EmailandSms, value: 'Email and Sms' },
  { key: confirmByTypesEnum.None, value: 'None' },
];

const SelectedReferredClientEnum = {
  NotAssigned: 1,
  Other: 2,
  Client: 3,
};

const defaultClient = {
  name: '',
  middleName: '',
  lastName: '',
  loyaltyNumber: null,
  birthday: '',
  age: ages[1],
  clientCode: null,
  gender: genders[0],
  phones: [{ type: 0, value: '' }],
  email: '',
  confirmBy: null,
  declineEmail: null,
  declineAddress: null,
  street1: '',
  city: '',
  state: null,
  zipCode: null,
  selectedReferredClient: SelectedReferredClientEnum.NotAssigned,
  selectedClient: null,
  clientReferralType: null,
};

interface Props {
  settingsActions: any;
  clientInfoActions: any;
  actionType: any;
  client: any;
  setCanSave: any;
  navigation: any;
  clientInfoState: any;
  setHandleDone: any;
  setHandleBack: any;
  settingsState: any;
  onDismiss: any;
  appointmentCalendarActions: any;
  editionMode: any;
  canDelete: boolean;
}

interface State {
  styles: any,
  name: string,
  middleName: string,
  lastName: string,
  loyaltyNumber: number,
  birthday: string,
  age: number,
  clientCode: number,
  gender: any,
  phones: [{ type: number, value: string }],
  email: string,
  confirmBy: any,
  requireCard: any,
  declineAddress: any,
  declineEmail: any,
  street1: string,
  city: string,
  state: any,
  zipCode: string,
  selectedReferredClient: any,
  selectedClient: any,
  clientReferralType: any,
  client: any,
  loadingClient: boolean,
  isValidEmail: boolean,
  isValidZipCode: boolean,
  isValidPhoneHome: boolean,
  isValidPhoneCell: boolean,
  isValidPhoneWork: boolean,
  isValidName: boolean,
  isValidLastName: boolean,
  isValidStreet1: boolean,
  isValidCity: boolean,
  isValidAge: boolean,
  isValidState: boolean,
  isValidGender: boolean,
  isValidBirth: boolean,
  isValidReferred:boolean,
  birthdayPickerOpen: boolean,
  requiredFields: { [key: string]: boolean },
  pointerEvents: any
  maxChildAge: number,
  maxAdultAge: number,
  tooglePicker: boolean,
  trackClientAge: boolean,
  updateClientAge: boolean,
}

class ClientDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      pointerEvents: '',
      client: JSON.parse(JSON.stringify(defaultClient)),
      loadingClient: true,
      selectedReferredClient: SelectedReferredClientEnum.NotAssigned,
      requireCard: false,
      isValidEmail: false,
      isValidZipCode: false,
      isValidPhoneHome: false,
      isValidPhoneCell: false,
      isValidPhoneWork: false,
      isValidName: false,
      isValidLastName: false,
      isValidStreet1: false,
      isValidCity: false,
      isValidAge: true,
      isValidState: true,
      isValidGender: true,
      isValidBirth: true,
      isValidReferred: false,
      birthdayPickerOpen: false,
      maxChildAge: null,
      maxAdultAge: null,
      tooglePicker: false,
      trackClientAge: false,
      updateClientAge: false,
      requiredFields: {
        age: true,
        address: true,
        city: true,
        email: true,
        birthday: false,
        gender: false,
        zip: true,
        state: true,
        workPhone: true,
        homePhone: false,
        cellPhone: false,
        referred: false,
      },
      styles: createStyleSheet(),
    };

    this.handleClientSelection.bind(this);

  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
    if (this.props.client.name !== nextProps.client.name) {
      this.setState({
        client: JSON.parse(JSON.stringify({ defaultClient, ...nextProps.client })),
      });
    }
  }

  componentDidMount() {
    this.props.setHandleDone(this.handleDone);
    this.props.setHandleBack(this.handleBack);
    this.props.settingsActions.getSettings(this.calculateRequiredFields);
  }

  onChangeClientField = (field: string, value: any, type?: any) => {
    let newClient;

    if (field === 'phone') {
      newClient = this.onChangePhones(value, type);
    } else {
      newClient = set(this.state.client, field, value);
    }


    this.props.navigation.setParams({ hasChanged: true });
    this.setState({ client: newClient }, this.checkValidation);

  };

  onChangePhones = (value, type) => {
    let newPhones;
    const phone = find(this.state.client.phones, { type });
    if (phone) {
      newPhones = this.state.client.phones.map((phone) => {
        if (phone.type === type) {
          return { type, value };
        }
        return phone;

      });
    } else {
      newPhones = [...this.state.client.phones, ...[{ type, value }]];
    }
    return { ...this.state.client, phones: newPhones };
  };

  onChangeClientReferralTypes = (option) => {
    this.setReferredOptionOther(false);
    this.onChangeClientField('clientReferralType', option);
  };

  onValidateReferred = isValid => {
    const isValidReferred  = get(this.state.requiredFields, 'referred', true) ? isValid : true;
    this.setState({
      isValidReferred,
    }, this.checkValidation);
  };

  onValidateEmail = isValid => {

    const isValidEmail = this.state.requiredFields.email ? isValid : true;
    this.setState({
      isValidEmail,
    }, this.checkValidation);
  };

  onValidateZipCode = (isValid, isFirstValidation = false) => {

    const isValidZipCode = this.state.requiredFields.zip ? isValid : true;

    if (isValid && !isFirstValidation && this.state.client.zipCode && this.state.client.zipCode.length === 5
      && this.state.client.zipCode !== '00000') {
      this.props.clientInfoActions.getZipCode(this.state.client.zipCode, this.loadDataFromZipCode);
    }

    this.setState({
      isValidZipCode,
    }, this.checkValidation);
  };


  onValidatePhoneWork = isValid => {

    const phone = find(this.state.client.phones, { type: 0 });
    const isValidPhoneWork = phone !== undefined ? isValid : true;
    this.setState({
      isValidPhoneWork,
    }, this.checkValidation);
  };

  onValidatePhoneHome = isValid => {
    const phone = find(this.state.client.phones, { type: 1 });
    const isValidPhoneHome = phone !== undefined && phone.value && phone.value.length > 0 ? isValid : true;
    this.setState({
      isValidPhoneHome,
    }, this.checkValidation);
  };

  onValidatePhoneCell = isValid => {
    const phone = find(this.state.client.phones, { type: 2 });
    const isValidPhoneCell = phone !== undefined && phone.value && phone.value.length > 0 ? isValid : true;
    this.setState({
      isValidPhoneCell,
    }, this.checkValidation);
  };


  onValidateName = isValid => {
    const isValidName = this.state.client.name !== undefined ? isValid : true;
    this.setState({
      isValidName,
    }, this.checkValidation);
  };

  onValidateLastName = isValid => {
    const isValidLastName = this.state.client.lastName !== undefined ? isValid : true;
    this.setState({
      isValidLastName,
    }, this.checkValidation);
  };

  onValidateStreet1 = isValid => {
    const isValidStreet1 = this.state.requiredFields.address ? isValid : true;
    this.setState({
      isValidStreet1,
    }, this.checkValidation);
  };

  onValidateCity = isValid => {
    const isValidCity = this.state.requiredFields.city ? isValid : true;
    this.setState({
      isValidCity,
    }, this.checkValidation);
  };

  onValidateGender = isValid => {
    const isValidGender = this.state.requiredFields.gender ? isValid : true;
    this.setState({
      isValidGender,
    }, this.checkValidation);
  };

  onValidateBirth = isValid => {
    const isValidBirth = this.state.requiredFields.birthday ? isValid : true;
    this.setState({
      isValidBirth,
    }, this.checkValidation);
  };

  onValidateAge = isValid => {
    const isValidAge = this.state.requiredFields.age ? isValid : true;
    this.setState({
      isValidAge,
    }, this.checkValidation);
  };

  onValidateState = isValid => {
    const isValidState = this.state.requiredFields.state ? isValid : true;
    this.setState({
      isValidState,
    }, this.checkValidation);
  };

  onPressOkDelete = () => {
    this.props.clientInfoActions.deleteClientInfo(this.state.client.id, this.handleDeleteClient);
  };

  setReferredOptionOther = (tooglePicker  = true) => {
    this.selectReferredOption(SelectedReferredClientEnum.Other, tooglePicker, false);
  };

  setReferredOptionClient = (navigateToClients) => {
    this.selectReferredOption(SelectedReferredClientEnum.Client, false, navigateToClients);
  };

  handleConditionalsForBirthday = (date) => {
    let isValid = false;

    if (!date) {
      isValid = !this.state.requiredFields.forceChildBirthday &&
      !this.state.requiredFields.forceAdultBirthday;
    } else {
      const ageSector = get(this.state.client, 'age', {}).key;
      let settingMaxAge = 999;

      if (this.state.requiredFields.forceChildBirthday &&
        ageSector === agesEnum.Child &&
        this.state.maxChildAge) {
        settingMaxAge = this.state.maxChildAge;
      }

      if (this.state.requiredFields.forceAdultBirthday &&
        ageSector === agesEnum.Adult &&
        this.state.maxAdultAge) {
        settingMaxAge = this.state.maxAdultAge;
      }

      const clientAge = moment().diff(date, 'years', false);

      if (clientAge <= settingMaxAge) {
        isValid = true;
      }
    }

    return isValid;
  };

  getAgeFromBirthday = (birthday) => {

    let ageEnum = agesEnum.Adult;

    if (birthday && (this.state.maxChildAge ||  this.state.maxAdultAge)) {
      const clientAge = moment().diff(birthday, 'years', false);

      if (this.state.maxChildAge && clientAge <= this.state.maxChildAge) {
        ageEnum = agesEnum.Child;
      }else if (this.state.maxAdultAge && clientAge <= this.state.maxAdultAge) {
        ageEnum = agesEnum.Adult;
      }else {
        ageEnum = agesEnum.Senior;
      }
    }

    const age = find(ages, { key: ageEnum });

    return age;
  }

  calculateRequiredFields = (result, error) => {

    if (result) {

      const { settings } = this.props.settingsState;

      const requiredFields: { [key: string]: boolean } = {};

      const trackClientAge = get(find(settings, { settingName: 'TrackClientAge' }), 'settingValue', false);
      const missingAddressMode = get(find(settings, { settingName: 'missingAddressMode' }), 'settingValue', false);
      const forceAgeInput = get(find(settings, { settingName: 'ForceAgeInput' }), 'settingValue', false);
      const isLargeForm = get(find(settings, { settingName: 'UseFullClientFormApptQueue' }), 'settingValue', false);
      const forceChildBirthday = get(find(settings, { settingName: 'ForceChildBirthday' }), 'settingValue', false);
      const forceAdultBirthday = get(find(settings, { settingName: 'ForceAdultBirthday' }), 'settingValue', false);
      const maxChildAge = get(find(settings, { settingName: 'MaxChildAge' }), 'settingValue', false);
      const maxAdultAge = get(find(settings, { settingName: 'MaxAdultAge' }), 'settingValue', false);
      const requireClientGender = get(find(settings, { settingName: 'RequireClientGender' }), 'settingValue', false);
      const updateClientAge = get(find(settings, { settingName: 'UpdateClientAge' }), 'settingValue', false);
      const forceClientReferralQuestion = get(find(settings,
          { settingName: 'ForceClientReferralQuestion' }), 'settingValue', false);

      requiredFields.age = trackClientAge && forceAgeInput;
      requiredFields.address = isLargeForm && missingAddressMode === addressModesEnum.FullAddress;
      requiredFields.city = isLargeForm && missingAddressMode === addressModesEnum.FullAddress;
      requiredFields.email = isLargeForm;
      requiredFields.birthday = trackClientAge && (forceChildBirthday || forceAdultBirthday);
      requiredFields.forceChildBirthday = forceChildBirthday;
      requiredFields.forceAdultBirthday = forceAdultBirthday;
      requiredFields.gender = requireClientGender;
      requiredFields.zip = isLargeForm && missingAddressMode === addressModesEnum.ZipOnly;
      requiredFields.state = isLargeForm && missingAddressMode === addressModesEnum.FullAddress;
      requiredFields.workPhone = true;
      requiredFields.homePhone = false;
      requiredFields.cellPhone = false;
      requiredFields.referred = forceClientReferralQuestion;

      this.setState({
        isValidGender: !requiredFields.gender,
        isValidBirth: !requiredFields.birthday,
        isValidPhoneWork: !requiredFields.workPhone,
        isValidPhoneHome: !requiredFields.homePhone,
        isValidPhoneCell: !requiredFields.cellPhone,
        requiredFields,
        maxChildAge,
        maxAdultAge,
        trackClientAge,
        updateClientAge,
      });

      this.props.clientInfoActions.getClientReferralTypes((result) => {
        if (result && this.props.actionType === 'update') {
          this.props.clientInfoActions.getClientInfo(this.props.client.id, this.loadClientData);
        } else if (this.props.actionType === 'new') {
          this.setState({
            loadingClient: false,
          });
        }
      });
    }
  };

  checkValidation = () => {
    const canSave = this.state.isValidLastName
      && this.state.isValidName
      && this.state.isValidStreet1
      && this.state.isValidCity
      && this.state.isValidEmail
      && this.state.isValidZipCode
      && this.state.isValidAge
      && this.state.isValidState
      && this.state.isValidGender
      && this.state.isValidBirth
      && this.state.isValidPhoneHome
      && this.state.isValidPhoneWork
      && this.state.isValidReferred
      && this.state.isValidPhoneCell;

    this.props.navigation.setParams({ canSave });
    this.props.setCanSave(canSave);
  };

  deleteClient = () => {
    const message = `Are you sure you want to delete user ${this.state.client.name} ${this.state.client.lastName}?`;
    Alert.alert(
      'Delete client',
      message,
      [
        {
          text: 'Cancel', onPress: () => {
          }, style: 'cancel',
        },
        {
          text: 'OK',
          onPress: this.onPressOkDelete,
        },
      ],
      { cancelable: false },
    );
  };

  handleDeleteClient = (result, message) => {
    if (result) {
      this.props.navigation.goBack();
    }
  };

  selectReferredOption = (selectedReferredClient: any, tooglePicker?: boolean, navigateToClients?: boolean) => {
    if (selectedReferredClient === SelectedReferredClientEnum.Client) {
      const newClient = this.state.client;
      newClient.clientReferralType = null;
      this.setState({ selectedReferredClient, client: newClient });

      if (navigateToClients) {
        this.handlePressClient();
      }
    } else {
      this.setState({ selectedClient: null, selectedReferredClient, tooglePicker }, this.validateReferred);
    }
  };

  handlePressClient = () => {
    const { navigate } = this.props.navigation;

    navigate('ChangeClient', {
      selectedClient: this.state.selectedClient,
      actionType: 'update',
      dismissOnSelect: true,
      headerProps: { title: 'Clients', ...this.cancelButton() },
      onChangeClient: client => this.handleClientSelection(client),
    });
  };

  handleBack = () => {
    this.setState({
      client: JSON.parse(JSON.stringify(defaultClient)),
      loadingClient: false,
    });
  };

  handleDone = () => {
    let phones = reject(this.state.client.phones, ['value', null]);
    phones = reject(phones, ['value', '']);
    const client = {
      firstName: this.state.client.name,
      lastName: this.state.client.lastName,
      middleName: this.state.client.middleName,
      birthday: moment(this.state.client.birthday).isValid()
        ? moment(this.state.client.birthday).format('YYYY-MM-DD')
        : null,
      age: this.state.client.age ? this.state.client.age.key : null,
      email: this.state.client.email,
      phones,
      address: {
        street1: this.state.client.street1,
        city: this.state.client.city ? this.state.client.city : null,
        state: this.state.client.state ? this.state.client.state.value : null,
        zipCode: this.state.client.zipCode ? this.state.client.zipCode : null,
      },
      gender: this.state.client.gender ? this.state.client.gender.value : null,
      loyaltyNumber: this.state.client.loyaltyNumber,
      confirmBy: this.state.client.confirmBy ? this.state.client.confirmBy.key : null,
      referredByClientId: this.state.selectedClient ? this.state.selectedClient.id : null,
      clientReferralTypeId: this.state.client.clientReferralType ? this.state.client.clientReferralType.key : null,
      clientPreferenceProviderType: 1,
      clientCode: this.state.client.clientCode ? this.state.client.clientCode :  null,
      receivesEmail: true,
      occupationId: null,
      profilePhotoUuid: null,
    };

    if (this.props.actionType === 'new') {
      this.props.clientInfoActions.postClientInfo(client, (result, clientResult, message) => {
        if (result) {
          this.setState({
            client: defaultClient,
            loadingClient: false,
          });

          if (this.props.onDismiss) {
            this.props.onDismiss(clientResult);
          } else {
            this.props.navigation.goBack();
          }
        }
      });
    } else if (this.props.actionType === 'update') {
      this.props.clientInfoActions.putClientInfo(this.props.client.id, client, (result, clientResult) => {

        if (result) {
          const newClient = { ...clientResult };
          newClient.age = ages.find(item => item.key === clientResult.age);
          this.setState({
            client: newClient,
            loadingClient: false,
          });

          if (this.props.onDismiss) {
            this.props.onDismiss(clientResult);
          } else {

            if (this.props.navigation.state.params.onDismiss) {
              this.props.navigation.state.params.onDismiss(clientResult);
            }

            this.props.appointmentCalendarActions.setGridView();
            this.props.navigation.goBack();
          }
        }
      });
    }
  };

  cancelButton = () => ({
    leftButton: <Text style={this.state.styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      this.selectReferredOption(SelectedReferredClientEnum.NotAssigned, false, false);
      navigation.goBack();
    },
  });

  handleClientSelection = (selectedClient) => {
    
    this.setState({ selectedClient }, this.validateReferred);
  };

  isValidEmailRegExp = regexs.emailWillNotProvide;
  isValidZipCodeRegExp = regexs.zipcode;
  isValidPhoneRegExp = regexs.phone;
  isValidText = regexs.notemptytext;
  isValidAddress = regexs.address;

  validateReferred = () => {
    const isClientValid = get(this.state, 'selectedClient', null);
    const isOtherValid = get(this.state.client, 'clientReferralType', null);
    const isValid = this.state.selectedReferredClient === SelectedReferredClientEnum.Other ?
    isOtherValid !== null : isClientValid  !== null;

    this.onValidateReferred(isValid);
  }

  loadClientData = (result) => {
    if (result) {
      const { client } = this.props.clientInfoState;
      const states = usStates;
      let declineAddress = false;
      let isValidZipCode = false;

      if (client.address) {
        if (client.address.street1 === 'decline') {

          client.state =  declineState;
          client.street1 = client.address.street1;
          client.city = client.address.city;
          client.zipCode = client.address.zipCode;
          declineAddress = true;

          this.onValidateState(true);
          this.onValidateCity(true);
          this.onValidateStreet1(true);
          isValidZipCode = true;

        } else {
          const state = find(states, { value: client.address.state && client.address.state.toUpperCase() });

          client.state = state;

          client.street1 = client.address.street1 ? client.address.street1 : '';
          client.city = client.address.city ? client.address.city : '';
          client.zipCode = client.address.zipCode ? client.address.zipCode : '';
        }

        delete client.address;

      } else {
        client.state = null;
        client.street1 = '';
        client.city = '';
        client.zipCode = '';
      }

      this.props.setCanSave(false);
      this.props.setHandleDone(this.handleDone);
      this.props.setHandleBack(this.handleBack);

      

      const clientReferralType = find(this.props.clientInfoState.clientReferralTypes,
        { key: client.myReferralTypeId });
      client.clientReferralType = clientReferralType;

      client.age = client.age ? client.age : this.getAgeFromBirthday(client.birthday);
      client.confirmBy =  client.contactType ? find(confirmByTypes,
        { key: client.contactType }) :  confirmByTypes[0];

      if (client.clientReferralType) {
        this.setReferredOptionOther(false);
      }

      client.gender = client.gender ? client.gender : genders[0];

      const selectedClient = client.referredByClient ? client.referredByClient : null;

      if (selectedClient) {
        this.setReferredOptionClient(false);
      }

      this.setState({
        client,
        declineAddress,
        loadingClient: false,
        isValidZipCode,
        selectedClient,
        pointerEvents: this.props.editionMode ? 'auto' : 'none',
      }, this.validateReferred);
    }
  };


  pickerToogleBirthday = () => {
    if (this.state.birthdayPickerOpen) {
      if (moment(this.state.client.birthday).isAfter(moment())) {
        return Alert.alert('Birthday can\'t be greater than today');
      }
    }

    this.setState({ birthdayPickerOpen: !this.state.birthdayPickerOpen });
  };

  renderPhones = () => {
    const phoneTypes = [
      {
        type: 0, name: 'Work',
        isValid: this.state.isValidPhoneWork,
        required: this.state.requiredFields.workPhone,
        onValidated: this.onValidatePhoneWork,
      },
      {
        type: 1,
        name: 'Home',
        isValid: this.state.isValidPhoneHome,
        required: this.state.requiredFields.homePhone,
        onValidated: this.onValidatePhoneHome,
      },
      {
        type: 2,
        name: 'Cell',
        isValid: this.state.isValidPhoneCell,
        required: this.state.requiredFields.cellPhone,
        onValidated: this.onValidatePhoneCell,
      },
    ];

    const elements = [];

    for (let i = 0; i < phoneTypes.length; i += 1) {
      const phoneType = phoneTypes[i];
      let phone = find(this.state.client.phones, { type: phoneType.type });
      phone = phone || { type: phoneType.type, value: '' };

      const divider = i < phoneTypes.length - 1 ? <InputDivider /> : null;

      const element = (
        <React.Fragment>
          <ValidatableInput
            mask="[000]-[000]-[0000]"
            keyboardType="phone-pad"
            validateOnChange
            validation={this.isValidPhoneRegExp}
            isValid={phoneType.isValid}
            onValidated={phoneType.onValidated}
            label={phoneType.name}
            value={phone.value}
            required={phoneType.required}
            onChangeText={(text) => {
              this.onChangeClientField('phone', text, phone.type);
            }}
            placeholder=""
            inputStyle={phone.value ? {} : this.state.styles.inputStyle}
          />
          {divider}
        </React.Fragment>);

      elements.push(element);
    }

    return (elements);
  };

  loadDataFromZipCode = () => {
    if ('state' in this.props.clientInfoState.zipCode) {
      const states = usStates;
      const state = find(states, { value: this.props.clientInfoState.zipCode.state.toUpperCase() });
      this.onChangeClientField('state', state);
      this.onChangeClientField('city', this.props.clientInfoState.zipCode.city);
      this.onChangeClientField('zipCode', this.props.clientInfoState.zipCode.zip);
      this.setState({ isValidState: true, isValidCity: true });
    }
  };

  onChangeDeclineEmailInputSwitch = () => {
    this.onChangeClientField('email', this.state.declineEmail ? '' : 'will-not-provide');
    this.onValidateEmail(!this.state.declineEmail);
    this.setState({ declineEmail: !this.state.declineEmail });
  };


  onChangeDeclineAddressInputSwitch = () => {

    this.onChangeClientField('state', this.state.declineAddress ? null: declineState);
    this.onChangeClientField('city', this.state.declineAddress ? '' : 'None');
    this.onChangeClientField('zipCode', this.state.declineAddress ? '' : '00000');
    this.onChangeClientField('street1', this.state.declineAddress ? '' : 'Decline');
    this.onValidateState(!this.state.declineAddress);
    this.onValidateCity(!this.state.declineAddress);
    this.onValidateStreet1(!this.state.declineAddress);
    this.onValidateZipCode(!this.state.declineAddress);
    this.setState({ declineAddress: !this.state.declineAddress });
  };

  setBirthdayAndAge = (selectedDate) => {

    const newClient = set(this.state.client, 'birthday', selectedDate);

    if (this.state.updateClientAge && (this.state.maxAdultAge || this.state.maxChildAge)) {

      const age = moment().diff(selectedDate, 'years', false);

      if (age <= this.state.maxChildAge) {
        newClient.age = find(ages, { key: agesEnum.Child });
      }else if (age <= this.state.maxAdultAge && age > this.state.maxChildAge) {
        newClient.age = find(ages, { key: agesEnum.Adult });
      }else {
        newClient.age = find(ages, { key: agesEnum.Senior });
      }
    }

    this.props.navigation.setParams({ hasChanged: true });

    this.setState({
      client: newClient,
      isValidBirth: this.handleConditionalsForBirthday(selectedDate),
    }, this.checkValidation);

  }

  renderInfoSection = () => {
    return (
      <InputGroup>
        <LabeledTextInput
          label="Client ID"
          value={this.state.client.clientCode}
          onChangeText={(text) => {
            this.onChangeClientField('clientCode', text);
          }}
          placeholder=""
          inputStyle={this.state.client.clientCode ? {} : this.state.styles.inputStyle}
        />
        <InputDivider />
        <ValidatableInput
          validateOnChange
          validation={this.isValidText}
          isValid={this.state.isValidName}
          onValidated={this.onValidateName}
          label="First Name"
          value={this.state.client.name}
          onChangeText={(text) => {
            this.onChangeClientField('name', text);
          }}
          placeholder=""
          inputStyle={this.state.client.name ? {} : this.state.styles.inputStyle}
        />
        <InputDivider />
        <LabeledTextInput
          inputStyle={this.state.client.middleName ? {} : this.state.styles.inputStyle}
          label="Middle Name"
          value={this.state.client.middleName}
          onChangeText={(text) => {
            this.onChangeClientField('middleName', text);
          }}
          placeholder=""
        />
        <InputDivider />
        <ValidatableInput
          validateOnChange
          inputStyle={this.state.client.lastName ? {} : this.state.styles.inputStyle}
          validation={this.isValidText}
          isValid={this.state.isValidLastName}
          onValidated={this.onValidateLastName}
          label="Last Name"
          value={this.state.client.lastName}
          onChangeText={(text) => {
            this.onChangeClientField('lastName', text);
          }}
          placeholder=""
        />
        <InputDivider />
        {this.state.requiredFields.gender ?
          <View>
            <InputPicker
              label="Gender"
              placeholder=""
              required={this.state.requiredFields.gender}
              isValid={this.state.isValidGender}
              onValidated={this.onValidateGender}
              noValueStyle={!this.state.client.gender ? this.state.styles.dateValueStyle : {}}
              value={this.state.client.gender ? this.state.client.gender : null}
              onChange={(option) => {
                this.onChangeClientField('gender', option);
              }}
              defaultOption={this.state.client.gender ? this.state.client.gender : null}
              options={genders}
            />
          <InputDivider />
          </View>
        : null}
        <View>
        <InputPicker
          label="Age"
          placeholder=""
          required={this.state.requiredFields.age}
          isValid={this.state.isValidAge}
          onValidated={this.onValidateAge}
          noValueStyle={!this.state.client.age ? this.state.styles.dateValueStyle : {}}
          value={this.state.client.age ? this.state.client.age : ages[1]}
          onChange={(option) => {
            this.onChangeClientField('age', option);
            this.setState({
              isValidBirth: this.handleConditionalsForBirthday(this.state.client.birthday),
            });
          }}
          defaultOption={this.state.client.age ? this.state.client.age : ages[1]}
          options={ages}
        />
        <InputDivider />
        </View>
        <SalonTimePicker
          format="MM/DD/YYYY"
          label="Birthday"
          mode="date"
          placeholder=""
          noIcon
          value={this.state.client.birthday}
          selectedDate={this.state.client.birthday}
          isOpen={this.state.birthdayPickerOpen}
          onChange={this.setBirthdayAndAge}
          toggle={this.pickerToogleBirthday}
          valueStyle={!this.state.client.birthday ? this.state.styles.dateValueStyle : {}}
          required={this.state.requiredFields.birthday}
          isValid={this.state.isValidBirth}
          onValidated={this.onValidateBirth}
          validate={this.handleConditionalsForBirthday}
        />
      </InputGroup>
    );
  }

  renderContactsSection = () => {
    return (
      <View>
        <InputGroup>
          <ValidatableInput
            keyboardType="email-address"
            validation={this.isValidEmailRegExp}
            label="Email"
            isValid={this.state.isValidEmail}
            onValidated={this.onValidateEmail}
            value={this.state.client.email}
            onChangeText={(text) => {
              this.onChangeClientField('email', text.toLowerCase());
            }}
            placeholder=""
            inputStyle={this.state.client.email ? {} : this.state.styles.inputStyle}
          />
          <InputDivider />
          <InputSwitch
            style={this.state.styles.inputSwitch}
            textStyle={this.state.styles.inputSwitchText}
            onChange={this.onChangeDeclineEmailInputSwitch}
            value={this.state.declineEmail}
            text="Decline"
          />
        </InputGroup>
        <SectionDivider style={ { height:10 } }/>
        <InputGroup>
          {this.renderPhones()}
        </InputGroup>
      </View>
    );
  }

  renderLoyaltySection = () => {
    return (
      <InputGroup>
        <LabeledTextInput
          label="Loyalty Number"
          value={this.state.client.loyaltyNumber}
          onChangeText={(text) => {
            this.onChangeClientField('loyaltyNumber', text);
          }}
          placeholder=""
          keyboardType="number-pad"
          inputStyle={this.state.client.loyaltyNumber ? {} : this.state.styles.inputStyle}
        />
        <InputDivider />
        <InputPicker
          label="Confirmation"
          value={this.state.client.confirmBy ? this.state.client.confirmBy : confirmByTypes[0]}
          onChange={(option) => {
            this.onChangeClientField('confirmBy', option);
          }}
          defaultOption={this.state.client.confirmBy}
          options={confirmByTypes}
        />
      </InputGroup>
    );
  }

  renderAddressSection = () => {
    return (
      <InputGroup>
        <InputSwitch
          style={this.state.styles.inputSwitch}
          textStyle={this.state.styles.inputSwitchText}
          onChange={this.onChangeDeclineAddressInputSwitch}
          value={this.state.declineAddress}
          text="Decline"
        />
        <InputDivider />
        <View  pointerEvents={this.props.editionMode ? 'auto' : 'none'}>
          <ValidatableInput
            validateOnChange
            validation={this.isValidText}
            isValid={this.state.isValidStreet1}
            onValidated={this.onValidateStreet1}
            label="Address Line 1"
            value={this.state.client.street1}
            onChangeText={(text) => {
              this.onChangeClientField('street1', text);
            }}
            placeholder=""
            inputStyle={this.state.client.street1 ? {} : this.state.styles.inputStyle}
          />
          <InputDivider />
          <ValidatableInput
            validateOnChange
            validation={this.isValidText}
            isValid={this.state.isValidCity}
            onValidated={this.onValidateCity}
            label="City"
            value={this.state.client.city}
            onChangeText={(text) => {
              this.onChangeClientField('city', text);
            }}
            placeholder=""
            inputStyle={this.state.client.city ? {} : this.state.styles.inputStyle}
          />
          <InputDivider />
          <InputPicker
            label="State"
            placeholder=""
            required={this.state.requiredFields.state}
            isValid={this.state.isValidState}
            onValidated={this.onValidateState}
            noValueStyle={!this.state.client.state ? this.state.styles.dateValueStyle : {}}
            value={this.state.client.state ? this.state.client.state : null}
            onChange={(option) => {
              this.onChangeClientField('state', option);
            }}
            defaultOption={this.state.client.state}
            options={usStates}
          />
          <InputDivider />
          <ValidatableInput
            validateOnChange
            mask="[00000]"
            keyboardType="numeric"
            validation={this.isValidZipCodeRegExp}
            isValid={this.state.isValidZipCode}
            onValidated={this.onValidateZipCode}
            label="ZIP"
            value={this.state.client.zipCode}
            onChangeText={(text) => {
              this.onChangeClientField('zipCode', text);
            }}
            placeholder=""
            inputStyle={
            !this.props.clientInfoState.isLoadingZipCode && this.state.client.zipCode
            ? {}
            : this.state.styles.inputStyle
            }
            icon={this.props.clientInfoState.isLoadingZipCode ?
              <View style={this.state.styles.activityIndicator}>
                <ActivityIndicator />
              </View>
            : null}
          />
        </View>
      </InputGroup>
    );
  }


  renderReferredSection = () => {
    return (
      <InputGroup>
        <View style={this.state.styles.referredClientView}>
          <SalonTouchableOpacity
            onPress={() => {
              this.setReferredOptionClient(true);
            }}
          >
            <FontAwesome
              style={
              this.state.selectedReferredClient === SelectedReferredClientEnum.Client
              ? this.state.styles.selectedCheck
              : this.state.styles.unselectedCheck
              }
            >
              {
              this.state.selectedReferredClient === SelectedReferredClientEnum.Client
              ? Icons.checkCircle
              : Icons.circle
              }
            </FontAwesome>
          </SalonTouchableOpacity>
         <ClientInput
            label="Select Client"
            placeholder={false}
            selectedClient={this.state.selectedClient}
            style={this.state.styles.clientInput}
            onPress={this.setReferredOptionClient}
            navigate={this.props.navigation.navigate}
            headerProps={{ title: 'Clients', ...this.cancelButton() }}
            onChange={this.handleClientSelection}
          />
        </View>
        <InputDivider />
        <View style={this.state.styles.clientReferralTypeContainer}>
          <SalonTouchableOpacity onPress={this.setReferredOptionOther}>
          <FontAwesome
            style={
            this.state.selectedReferredClient === SelectedReferredClientEnum.Other
            ? this.state.styles.selectedCheck
            : this.state.styles.unselectedCheck
            }
          >
          {
          this.state.selectedReferredClient === SelectedReferredClientEnum.Other
          ? Icons.checkCircle
          : Icons.circle
          }
          </FontAwesome>
          </SalonTouchableOpacity>
          <View style={this.state.styles.clientReferralTypeInput}>
            <InputPicker
              label="Other"
              placeholder=""
              noValueStyle={!this.state.client.clientReferralType ? this.state.styles.dateValueStyle : {}}
              value={this.state.client.clientReferralType ?
              this.state.client.clientReferralType : null}
              onChange={this.onChangeClientReferralTypes}
              defaultOption={this.state.client.clientReferralType}
              options={this.props.clientInfoState.clientReferralTypes}
              tooglePicker={this.state.tooglePicker}
            />
          </View>
        </View>
      </InputGroup>
    );
  }

  render() {
    return (
      <View style={this.state.styles.container}>

        {(this.props.clientInfoState.isLoading || this.state.loadingClient) ?
          <View style={this.state.styles.loadingContainer}>
            <ActivityIndicator />
          </View>
          :

          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            extraHeight={300}
          >
            <View pointerEvents={this.state.pointerEvents}>
              <SectionTitle value="INFO" style={this.state.styles.sectionTitle} />
                {this.renderInfoSection()}
              <SectionTitle value="CONTACT" style={this.state.styles.sectionTitle} />
                {this.renderContactsSection()}
              <SectionDivider />
                {this.renderLoyaltySection()}
              <SectionTitle value="ADDRESS" style={this.state.styles.sectionTitle} />
              {this.renderAddressSection()}
              <SectionTitle
                value="REFERRED BY"
                style={this.state.styles.sectionTitle}
                sectionTitleStyle={{
                  color: this.state.isValidReferred ? '#727A8F' : '#D1242A',
                }}
              />
                {this.renderReferredSection()}
              <SectionDivider />

              {this.props.actionType === 'update' ?
                <View>
                  <InputGroup>
                    <InputButton
                      noIcon
                      childrenContainerStyle={{
                        justifyContent: 'center', alignItems: 'center',
                      }}
                      onPress={this.deleteClient}
                    >
                      <Text style={{ color: '#D1242A', fontFamily: 'Roboto-Medium' }}>Delete Client</Text>
                    </InputButton>
                  </InputGroup>
                  <SectionDivider />
                </View>
                : null
                }
              </View>

          </KeyboardAwareScrollView>}
      </View>
    );
  }
}

export default ClientDetails;
