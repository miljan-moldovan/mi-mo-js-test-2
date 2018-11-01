import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { find, reject } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
  InputDivider,
  InputDate,
  SectionTitle,
  LabeledTextInput,
  InputPicker,
  ClientInput,
  SectionDivider,
  InputButton,
  InputSwitch,
  LabeledTextarea,
  ValidatableInput,
} from '../../../../components/formHelpers';
import SalonTimePicker from '../../../../components/formHelpers/components/SalonTimePicker';
import LoadingOverlay from '../../../../components/LoadingOverlay';

import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import usStates from '../../../../constants/UsStates';
import gendersEnum from '../../../../constants/Genders';
import agesEnum from '../../../../constants/Ages';
import confirmByTypesEnum from '../../../../constants/ClientConfirmByTypes';
import regexs from '../../../../constants/Regexs';
import styles from './styles';

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
  loyalty: null,
  birthday: '',
  age: null,
  anniversary: null,
  clientId: null,
  gender: null,
  phones: [{ type: 0, value: '' }],
  email: '',
  confirmBy: null,
  requireCard: null,
  decline: null,
  confirmationNote: null,
  street1: '',
  city: '',
  state: null,
  zipCode: null,
  selectedReferredClient: SelectedReferredClientEnum.NotAssigned,
  selectedClient: null,
  clientReferralType: null,
};

class ClientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: '',
      client: {},
      loadingClient: true,
      selectedClient: null,
      selectedReferredClient: SelectedReferredClientEnum.NotAssigned,
      requireCard: false,
      decline: false,
      hasChanged: false,
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
      birthdayPickerOpen: false,
      anniversaryPickerOpen: false,
      requiredFields: {
        age: false,
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
      },
    };

    this.props.settingsActions.getSettings(this.calculateRequiredFields);

    this.handleClientSelection.bind(this);

    this.props.clientInfoActions.getClientReferralTypes((result) => {
      if (result && this.props.actionType === 'update') {
        this.props.clientInfoActions.getClientInfo(this.props.client.id, this.loadClientData);
      } else if (this.props.actionType === 'new') {
        this.setState({
          client: JSON.parse(JSON.stringify(defaultClient)),
          loadingClient: false,
        });
        this.props.setHandleDone(this.handleDone);
        this.props.setHandleBack(this.handleBack);
      }
    });
  }

  onChangeClientField = (field, value, type) => {
    const newClient = this.state.client;


    switch (field) {
      case 'name':
        newClient.name = value;
        break;
      case 'lastName':
        newClient.lastName = value;
        break;
      case 'middleName':
        newClient.middleName = value;
        this.props.setCanSave(true);
        break;
      case 'loyalty':
        newClient.loyalty = value;
        this.props.setCanSave(true);
        break;
      case 'street1':
        newClient.street1 = value;
        break;
      case 'city':
        newClient.city = value;
        break;
      case 'zipCode':
        newClient.zipCode = value;
        break;
      case 'clientId':
        newClient.clientId = value;
        break;
      case 'gender':
        newClient.gender = value;
        break;
      case 'age':
        newClient.age = value;
        break;
      case 'state':
        newClient.state = value;
        break;
      case 'birthday':
        newClient.birthday = value;
        break;
      case 'anniversary':
        newClient.anniversary = value;
        break;
      case 'confirmBy':
        newClient.confirmBy = value;
        break;
      case 'clientReferralType':
        newClient.clientReferralType = value;
        break;
      case 'confirmationNote':
        newClient.confirmationNote = value;
        break;
      case 'email':
        newClient.email = value;
        break;
      case 'phone': {
        const phone = find(newClient.phones, { type });
        if (phone) {
          phone.value = value;
        } else {
          newClient.phones.push({ type, value });
        }

        break;
      }
      default:
      /* nothing */
    }

    this.setState({ client: newClient, hasChanged: true }, this.checkValidation);
  }

  onChangeClientReferralTypes = (option) => {
    this.setReferredOptionOther();
    this.onChangeClientField('clientReferralType', option);
  }


  onChangeInputSwitch = () => {
    this.setState({ requireCard: !this.state.requireCard });
  }

  onValidateEmail = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidEmail = this.state.requiredFields.email ? isValid : true;

    this.checkValidation();

    return newState;
  })

  onValidateZipCode = isValid => this.setState((state) => {
    const newState = state;

    newState.isValidZipCode = this.state.requiredFields.zip ? isValid : true;

    if (isValid && this.state.client.zipCode && this.state.client.zipCode.length === 5) {
      this.props.clientInfoActions.getZipCode(this.state.client.zipCode, this.loadDataFromZipCode);
    }

    this.checkValidation();

    return newState;
  });


  onValidatePhoneWork = isValid => this.setState((state) => {
    const newState = state;

    const phone = find(state.client.phones, { type: 0 });

    newState.isValidPhoneWork = phone !== undefined ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onValidatePhoneHome = isValid => this.setState((state) => {
    const newState = state;

    const phone = find(state.client.phones, { type: 1 });

    newState.isValidPhoneHome = phone !== undefined && phone.value && phone.value.length > 0 ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onValidatePhoneCell = isValid => this.setState((state) => {
    const newState = state;

    const phone = find(state.client.phones, { type: 2 });

    newState.isValidPhoneCell = phone !== undefined && phone.value && phone.value.length > 0 ? isValid : true;

    this.checkValidation();

    return newState;
  });


  onValidateName = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidName = state.client.name !== undefined ? isValid : true;
    this.checkValidation();

    return newState;
  });

  onValidateLastName = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidLastName = state.client.lastName !== undefined ? isValid : true;
    this.checkValidation();

    return newState;
  });

  onValidateStreet1 = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidStreet1 = this.state.requiredFields.address ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onValidateCity = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidCity = this.state.requiredFields.city ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onValidateGender = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidGender = this.state.requiredFields.gender ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onValidateBirth = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidBirth = this.state.requiredFields.birthday ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onValidateAge = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidAge = this.state.requiredFields.age ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onValidateState = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidState = this.state.requiredFields.state ? isValid : true;

    this.checkValidation();

    return newState;
  });

  onPressOkDelete = () => {
    this.props.clientInfoActions.deleteClientInfo(this.state.client.id, this.handleDeleteClient);
  }

  setReferredOptionOther = () => {
    this.selectReferredOption(SelectedReferredClientEnum.Other);
  }

  setReferredOptionClient = (navigateToClients) => {
    this.selectReferredOption(SelectedReferredClientEnum.Client, navigateToClients);
  }

  calculateRequiredFields = (result) => {
    if (result) {
      const { settings } = this.props.settingsState;

      const required: { [key: string]: boolean } = {};

      const trackClientAge = find(settings, { settingName: 'TrackClientAge' }).settingValue;
      const forceAgeInput = find(settings, { settingName: 'ForceAgeInput' }).settingValue;
      const isLargeForm = find(settings, { settingName: 'UseFullClientFormApptQueue' }).settingValue;
      const forceChildBirthday = find(settings, { settingName: 'ForceChildBirthday' }).settingValue;
      const forceAdultBirthday = find(settings, { settingName: 'ForceAdultBirthday' }).settingValue;
      const requireClientGender = find(settings, { settingName: 'RequireClientGender' }).settingValue;

      required.age = trackClientAge && forceAgeInput;
      required.address = isLargeForm;// && address !== 'Decline';
      required.city = isLargeForm;
      required.email = isLargeForm;// && email !== 'Will-not-provide';
      required.birthday = trackClientAge && (forceChildBirthday || forceAdultBirthday);
      required.gender = requireClientGender;
      required.zip = isLargeForm;
      required.state = isLargeForm;
      required.workPhone = true;
      required.homePhone = false;
      required.cellPhone = false;

      this.setState({
        isValidGender: !required.gender,
        isValidBirth: !required.birthday,
        isValidAge: !required.age,
        isValidPhoneWork: !required.workPhone,
        isValidPhoneHome: !required.homePhone,
        isValidPhoneCell: !required.cellPhone,
      });

      this.setState({ requiredFields: required });
    }
  }

  checkValidation = () => {
    this.props.setCanSave(this.state.hasChanged
      && this.state.isValidLastName
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
      && this.state.isValidPhoneCell);
  }

  deleteClient = () => {
    const message = `Are you sure you want to delete user ${this.state.client.name} ${this.state.client.lastName}?`;
    Alert.alert(
      'Delete client',
      message,
      [
        { text: 'Cancel', onPress: () => { }, style: 'cancel' },
        {
          text: 'OK',
          onPress: this.onPressOkDelete,
        },
      ],
      { cancelable: false },
    );
  }

  handleDeleteClient = (result, message) => {
    if (result) {
      this.props.navigation.goBack();
    }
  }


  selectReferredOption = (selectedReferredClient, navigateToClients) => {
    if (selectedReferredClient === SelectedReferredClientEnum.Client) {
      const newClient = this.state.client;
      newClient.clientReferralType = null;
      this.setState({ selectedReferredClient, client: newClient });

      if (navigateToClients) {
        this.handlePressClient();
      }
    } else {
      this.setState({ selectedClient: null, selectedReferredClient });
    }
  }

  handlePressClient = () => {
    const { navigate } = this.props.navigation;

    navigate('ChangeClient', {
      selectedClient: this.state.selectedClient,
      actionType: 'update',
      dismissOnSelect: true,
      headerProps: { title: 'Clients', ...this.cancelButton() },
      onChangeClient: client => this.handleClientSelection(client),
    });
  }

  handleBack = () => {
    this.setState({
      client: JSON.parse(JSON.stringify(defaultClient)),
      loadingClient: false,
    });
  }

  handleDone = () => {
    let phones = reject(this.state.client.phones, ['value', null]);
    phones = reject(phones, ['value', '']);

    const client = {
      firstName: this.state.client.name,
      lastName: this.state.client.lastName,
      middleName: this.state.client.middleName,
      birthday: moment(this.state.client.birthday).isValid() ? moment(this.state.client.birthday).format('YYYY-MM-DD') : null,
      age: this.state.client.age ? this.state.client.age.key : null,
      email: this.state.client.email,
      phones,
      address: {
        street1: this.state.client.street1,
        city: this.state.client.city ? this.state.client.city : null,
        state: this.state.client.state ? this.state.client.state.value : null,
        zipCode: this.state.client.zipCode ? this.state.client.zipCode : null,
      },
      gender: this.state.client.gender ? this.state.client.gender.key : null,
      loyaltyNumber: this.state.client.loyalty,
      confirmBy: this.state.client.confirmBy ? this.state.client.confirmBy.key : null,
      referredByClientId: this.state.selectedClient ? this.state.selectedClient.id : null,
      clientReferralTypeId: this.state.client.clientReferralType ? this.state.client.clientReferralType.key : null,
      anniversary: moment(this.state.client.anniversary).isValid() ? moment(this.state.client.anniversary).format('YYYY-MM-DD') : null,
      requireCard: this.state.requireCard,
      confirmationNote: this.state.client.confirmationNote ? this.state.client.confirmationNote : null,
      clientPreferenceProviderType: 1,
      preferredProviderId: null,
      clientCode: null,
      receivesEmail: true,
      occupationId: null,
      profilePhotoUuid: null,
    };

    if (this.props.actionType === 'new') {
      this.props.clientInfoActions.postClientInfo(client, (result, clientResult, message) => {
        if (result) {
          this.setState({
            client: JSON.parse(JSON.stringify(defaultClient)),
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
      this.props.clientInfoActions.putClientInfo(this.props.client.id, client, (result, clientResult, message) => {
        if (result) {
          this.setState({
            client: JSON.parse(JSON.stringify(defaultClient)),
            loadingClient: false,
          });

          if (this.props.onDismiss) {
            this.props.onDismiss(clientResult);
          } else {
            this.props.appointmentCalendarActions.setGridView();
            this.props.navigation.goBack();
          }
        }
      });
    }
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      this.selectReferredOption(SelectedReferredClientEnum.NotAssigned);
      navigation.goBack();
    },
  })

  handleClientSelection = (selectedClient) => {
    this.setState({ selectedClient });
  }

  isValidEmailRegExp = regexs.emailWillNotProvide;
  isValidZipCodeRegExp = regexs.zipcode;
  isValidPhoneRegExp = regexs.phone;
  isValidText = regexs.notemptytext;
  isValidAddress = regexs.address;


  loadClientData = (result) => {
    if (result) {
      const { client } = this.props.clientInfoState;
      const states = usStates;
      if (client.address) {
        if (typeof client.address === 'string' || client.address instanceof String) {
          const matches = client.address.match(this.isValidAddress);
          client.address = {};
          if (matches && matches.length > 4) {
            const street = matches[1];
            const city = matches[2];

            const zipCode = matches[4];

            client.street1 = street.trim();
            client.city = city.trim();
            const state = find(states, { value: matches[3].trim().toUpperCase() });
            client.state = state;

            client.zipCode = zipCode.trim();
          }
        } else {
          const state = find(states, { value: client.address.state.toUpperCase() });

          client.state = state;

          client.street1 = client.address.street1 ? client.address.street1 : '';
          client.city = client.address.city ? client.address.city : '';
          client.zipCode = client.address.zipCode ? client.address.zipCode : '';
        }
      } else {
        client.state = null;
        client.street1 = '';
        client.city = '';
        client.zipCode = '';
      }


      this.props.setCanSave(false);
      this.props.setHandleDone(this.handleDone);
      this.props.setHandleBack(this.handleBack);

      const clientReferralType = find(this.props.clientInfoState.clientReferralTypes, { key: client.clientReferralTypeId });
      client.clientReferralType = clientReferralType;

      if (client.clientReferralType) {
        this.setReferredOptionOther();
      }

      this.setState({
        client,
        loadingClient: false,
        pointerEvents: this.props.editionMode ? 'auto' : 'none',
      });
    }
  }


  pickerToogleBirthday = () => {
    if (this.state.birthdayPickerOpen) {
      if (moment(this.state.client.birthday).isAfter(moment())) {
        return alert("Birthday can't be greater than today");
      }
    }

    this.setState({ birthdayPickerOpen: !this.state.birthdayPickerOpen });
  };


  pickerToogleAnniversary = () => {
    if (this.state.anniversaryPickerOpen) {
      if (moment(this.state.client.anniversary).isAfter(moment())) {
        return alert("Anniversary can't be greater than today");
      }
    }

    this.setState({ anniversaryPickerOpen: !this.state.anniversaryPickerOpen });
  };

  renderPhones = () => {
    const phoneTypes = [
      {
        type: 0, name: 'Work', isValid: this.state.isValidPhoneWork, required: this.state.requiredFields.workPhone, onValidated: this.onValidatePhoneWork,
      },
      {
        type: 1, name: 'Home', isValid: this.state.isValidPhoneHome, required: this.state.requiredFields.homePhone, onValidated: this.onValidatePhoneHome,
      },
      {
        type: 2, name: 'Cell', isValid: this.state.isValidPhoneCell, required: this.state.requiredFields.cellPhone, onValidated: this.onValidatePhoneCell,
      },
    ];

    const elements = [];

    for (let i = 0; i < phoneTypes.length; i += 1) {
      const phoneType = phoneTypes[i];
      let phone = find(this.state.client.phones, { type: phoneType.type });
      phone = phone || { type: phoneType.type, value: '' };

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
            onChangeText={(text) => { this.onChangeClientField('phone', text, phone.type); }}
            placeholder=""
            inputStyle={phone.value ? {} : styles.inputStyle}
          />
          <InputDivider />
        </React.Fragment>);

      elements.push(element);
    }

    return (elements);
  }

  loadDataFromZipCode = () => {
    if ('state' in this.props.clientInfoState.zipCode) {
      // if (this.state.client.state === null) {
      const states = usStates;
      const state = find(states, { value: this.props.clientInfoState.zipCode.state.toUpperCase() });
      this.onChangeClientField('state', state);
      //  }

      //  if (this.state.client.city.length === 0) {
      this.onChangeClientField('city', this.props.clientInfoState.zipCode.city);
      //  }

      this.onChangeClientField('zipCode', this.props.clientInfoState.zipCode.zip);


      this.setState({ isValidState: true, isValidCity: true });
    }
  }

  onChangeDeclineInputSwitch = () => {
    this.onChangeClientField('email', this.state.decline ? '' : 'will-not-provide');
    this.onValidateEmail(!this.state.decline);
    this.setState({ decline: !this.state.decline });
  }

  render() {
    return (
      <View style={styles.container}>

        { (this.props.clientInfoState.isLoading || this.state.loadingClient) ?
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        :

          <KeyboardAwareScrollView extraHeight={300} enableAutoAutomaticScroll={false}>
            <View pointerEvents={this.state.pointerEvents}>
              <SectionTitle value="NAME" style={styles.sectionTitle} />
              <InputGroup>
                <ValidatableInput
                  validateOnChange
                  validation={this.isValidText}
                  isValid={this.state.isValidName}
                  onValidated={this.onValidateName}
                  label="First Name"
                  value={this.state.client.name}
                  onChangeText={(text) => { this.onChangeClientField('name', text); }}
                  placeholder=""
                  inputStyle={this.state.client.name ? {} : styles.inputStyle}
                />
                <InputDivider />
                <LabeledTextInput
                  inputStyle={this.state.client.middleName ? {} : styles.inputStyle}
                  label="Middle Name"
                  value={this.state.client.middleName}
                  onChangeText={(text) => { this.onChangeClientField('middleName', text); }}
                  placeholder=""
                />
                <InputDivider />
                <ValidatableInput
                  validateOnChange
                  inputStyle={this.state.client.lastName ? {} : styles.inputStyle}
                  validation={this.isValidText}
                  isValid={this.state.isValidLastName}
                  onValidated={this.onValidateLastName}
                  label="Last Name"
                  value={this.state.client.lastName}
                  onChangeText={(text) => { this.onChangeClientField('lastName', text); }}
                  placeholder=""
                />
              </InputGroup>

              <SectionTitle value="MAIN INFO" style={styles.sectionTitle} />
              <InputGroup>
                <LabeledTextInput
                  label="Loyalty Number"
                  value={this.state.client.loyalty}
                  onChangeText={(text) => { this.onChangeClientField('loyalty', text); }}
                  placeholder=""
                  keyboardType="number-pad"
                  inputStyle={this.state.client.loyalty ? {} : styles.inputStyle}
                />
                <InputDivider />

                <SalonTimePicker
                  format="D MMM YYYY"
                  label="Birthday"
                  mode="date"
                  placeholder=""
                  noIcon
                  value={this.state.client.birthday}
                  isOpen={this.state.birthdayPickerOpen}
                  onChange={(selectedDate) => { this.onChangeClientField('birthday', selectedDate); }}
                  toggle={this.pickerToogleBirthday}
                  valueStyle={!this.state.client.birthday ? styles.dateValueStyle : {}}
                  required={this.state.requiredFields.birthday}
                  isValid={this.state.isValidBirth}
                  onValidated={this.onValidateBirth}
                />
                <InputDivider />
                <InputPicker
                  label="Age"
                  placeholder=""
                  required={this.state.requiredFields.age}
                  isValid={this.state.isValidAge}
                  onValidated={this.onValidateAge}
                  noValueStyle={!this.state.client.age ? styles.dateValueStyle : {}}
                  value={this.state.client.age ? this.state.client.age : null}
                  onChange={(option) => { this.onChangeClientField('age', option); }}
                  defaultOption={this.state.client.age}
                  options={ages}
                />
                <InputDivider />

                <SalonTimePicker
                  format="D MMM YYYY"
                  label="Anniversary"
                  mode="date"
                  placeholder=""
                  noIcon
                  value={this.state.client.anniversary}
                  isOpen={this.state.anniversaryPickerOpen}
                  onChange={(selectedDate) => { this.onChangeClientField('anniversary', selectedDate); }}
                  toggle={this.pickerToogleAnniversary}
                  valueStyle={!this.state.client.anniversary ? styles.dateValueStyle : {}}
                />

                <InputDivider />
                <LabeledTextInput
                  label="Client ID"
                  value={this.state.client.clientId}
                  onChangeText={(text) => { this.onChangeClientField('clientId', text); }}
                  placeholder=""
                  inputStyle={this.state.client.clientId ? {} : styles.inputStyle}
                />
                <InputDivider />
                <InputPicker
                  label="Gender"
                  placeholder=""
                  required={this.state.requiredFields.gender}
                  isValid={this.state.isValidGender}
                  onValidated={this.onValidateGender}
                  noValueStyle={!this.state.client.gender ? styles.dateValueStyle : {}}
                  value={this.state.client.gender ? this.state.client.gender : null}
                  onChange={(option) => { this.onChangeClientField('gender', option); }}
                  defaultOption={this.state.client.gender}
                  options={genders}
                />
              </InputGroup>
              <SectionTitle value="CONTACTS" style={styles.sectionTitle} />
              <InputGroup>
                <ValidatableInput
                    // validateOnChange
                  keyboardType="email-address"
                  validation={this.isValidEmailRegExp}
                  label="Email"
                  isValid={this.state.isValidEmail}
                  onValidated={this.onValidateEmail}
                  value={this.state.client.email}
                  onChangeText={(text) => { this.onChangeClientField('email', text.toLowerCase()); }}
                  placeholder=""
                  inputStyle={this.state.client.email ? {} : styles.inputStyle}
                />
                <InputDivider />

                <InputSwitch
                  style={styles.inputSwitch}
                  textStyle={styles.inputSwitchText}
                  onChange={this.onChangeDeclineInputSwitch}
                  value={this.state.decline}
                  text="Decline"
                />
                <InputDivider />
                {this.renderPhones()}
              </InputGroup>
              <SectionDivider />
              <InputGroup>
                <InputPicker
                  label="Confirmation"
                  value={this.state.client.confirmBy ? this.state.client.confirmBy : confirmByTypes[0]}
                  onChange={(option) => { this.onChangeClientField('confirmBy', option); }}
                  defaultOption={this.state.client.confirmBy}
                  options={confirmByTypes}
                />
                <InputDivider />
                <InputSwitch
                  style={styles.inputSwitch}
                  textStyle={styles.inputSwitchText}
                  onChange={this.onChangeInputSwitch}
                  value={this.state.requireCard}
                  text="Req. card on file to book"
                />
                <InputDivider style={styles.inputDivider} />
                <LabeledTextarea
                  label="Notes"
                  placeholder=""
                  onChangeText={(text) => { this.onChangeClientField('confirmationNote', text); }}
                  value={this.state.client.confirmationNote}
                />
              </InputGroup>
              <SectionTitle value="ADDRESS" style={styles.sectionTitle} />
              <InputGroup>
                <ValidatableInput
                  validateOnChange
                  validation={this.isValidText}
                  isValid={this.state.isValidStreet1}
                  onValidated={this.onValidateStreet1}
                  label="Address Line 1"
                  value={this.state.client.street1}
                  onChangeText={(text) => { this.onChangeClientField('street1', text); }}
                  placeholder=""
                  inputStyle={this.state.client.street1 ? {} : styles.inputStyle}
                />
                <InputDivider />
                <ValidatableInput
                  validateOnChange
                  validation={this.isValidText}
                  isValid={this.state.isValidCity}
                  onValidated={this.onValidateCity}
                  label="City"
                  value={this.state.client.city}
                  onChangeText={(text) => { this.onChangeClientField('city', text); }}
                  placeholder=""
                  inputStyle={this.state.client.city ? {} : styles.inputStyle}
                />
                <InputDivider />
                <InputPicker
                  label="State"
                  placeholder=""
                  required={this.state.requiredFields.state}
                  isValid={this.state.isValidState}
                  onValidated={this.onValidateState}
                  noValueStyle={!this.state.client.state ? styles.dateValueStyle : {}}
                  value={this.state.client.state ? this.state.client.state : null}
                  onChange={(option) => { this.onChangeClientField('state', option); }}
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
                  onChangeText={(text) => { this.onChangeClientField('zipCode', text); }}
                  placeholder=""
                  inputStyle={!this.props.clientInfoState.isLoadingZipCode && this.state.client.zipCode ? {} : styles.inputStyle}
                  icon={this.props.clientInfoState.isLoadingZipCode ?

                    <View style={styles.activityIndicator}>
                      <ActivityIndicator />
                    </View>

                  : null}
                />
              </InputGroup>

              <SectionTitle value="REFERRED BY" style={styles.sectionTitle} />
              <InputGroup>
                <View style={styles.referredClientView}>
                  <SalonTouchableOpacity onPress={() => { this.setReferredOptionClient(true); }}>
                    <FontAwesome style={this.state.selectedReferredClient === SelectedReferredClientEnum.Client ? styles.selectedCheck : styles.unselectedCheck}>
                      {this.state.selectedReferredClient === SelectedReferredClientEnum.Client ? Icons.checkCircle : Icons.circle}
                    </FontAwesome>
                  </SalonTouchableOpacity>

                  <ClientInput
                    label="Select Client"
                    placeholder={false}
                    selectedClient={this.state.selectedClient}
                    style={styles.clientInput}
                    onPress={this.setReferredOptionClient}
                    navigate={this.props.navigation.navigate}
                    headerProps={{ title: 'Clients', ...this.cancelButton() }}
                    onChange={this.handleClientSelection}
                  />
                </View>
                <InputDivider />
                <View style={styles.clientReferralTypeContainer}>
                  <SalonTouchableOpacity onPress={this.setReferredOptionOther}>
                    <FontAwesome style={this.state.selectedReferredClient === SelectedReferredClientEnum.Other ? styles.selectedCheck : styles.unselectedCheck}>
                      {this.state.selectedReferredClient === SelectedReferredClientEnum.Other ? Icons.checkCircle : Icons.circle}
                    </FontAwesome>
                  </SalonTouchableOpacity>

                  <View style={styles.clientReferralTypeInput}>
                    <InputPicker
                      label="Other"
                      placeholder=""
                      noValueStyle={!this.state.client.clientReferralType ? styles.dateValueStyle : {}}
                      value={this.state.client.clientReferralType ?
                          this.state.client.clientReferralType : null}
                      onChange={this.onChangeClientReferralTypes}
                      defaultOption={this.state.client.clientReferralType}
                      options={this.props.clientInfoState.clientReferralTypes}
                    />
                  </View>
                </View>
              </InputGroup>
              <SectionDivider />
              {/*
              {this.props.actionType === 'update' && this.props.canDelete ?
                <React.Fragment>
                  <InputGroup>
                    <InputButton
                      noIcon
                      childrenContainerStyle={styles.deleteButton}
                      onPress={this.deleteClient}
                    >
                      <Text style={styles.deleteText}>Delete Client</Text>
                    </InputButton>
                  </InputGroup>
                  <SectionDivider />
                </React.Fragment> : null }
              */}
            </View>
          </KeyboardAwareScrollView>}
      </View>
    );
  }
}

ClientDetails.defaultProps = {
  editionMode: true,
  client: null,
  actionType: 'update',
  onDismiss: null,
  canDelete: false,
};

ClientDetails.propTypes = {
  onDismiss: PropTypes.func,
  actionType: PropTypes.string,
  appointmentCalendarActions: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  setCanSave: PropTypes.func.isRequired,
  setHandleDone: PropTypes.func.isRequired,
  setHandleBack: PropTypes.func.isRequired,
  editionMode: PropTypes.bool,
  canDelete: PropTypes.bool,
  settingsState: PropTypes.any.isRequired,
  clientInfoState: PropTypes.any.isRequired,
  client: PropTypes.any,
  settingsActions: PropTypes.shape({
    getSettings: PropTypes.func.isRequired,
  }).isRequired,
  clientInfoActions: PropTypes.shape({
    getClientReferralTypes: PropTypes.func.isRequired,
    getClientInfo: PropTypes.func.isRequired,
    putClientInfo: PropTypes.func.isRequired,
    deleteClientInfo: PropTypes.func.isRequired,
    getZipCode: PropTypes.func.isRequired,
  }).isRequired,
};

export default ClientDetails;
