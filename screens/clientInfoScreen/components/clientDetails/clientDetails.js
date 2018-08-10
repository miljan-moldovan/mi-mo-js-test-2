import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Alert,
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

class ClientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      loadingClient: true,
      selectedClient: null,
      selectedReferredClient: true,
      requireCard: true,
      hasChanged: false,
      isValidEmail: false,
      isValidZipCode: false,
      isValidPhone: false,
      isValidName: false,
      isValidLastName: false,
      isValidStreet1: false,
      isValidCity: false,
      isValidAge: true,
      isValidState: true,
      isValidGender: true,
      isValidBirth: true,
      requiredFields: {},
    };

    this.props.settingsActions.getSettings(this.calculateRequiredFields);

    this.handleClientSelection.bind(this);

    this.props.clientInfoActions.getClientReferralTypes((result) => {
      if (result) {
        this.props.clientInfoActions.getClientInfo(this.props.client.id, this.loadClientData);
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
        phone.value = value;
        break;
      }
      default:
            /* nothing */
    }

    this.setState({ client: newClient, hasChanged: true }, this.checkValidation);
  }

  onChangeClientReferralTypes = (option) => {
    this.selectReferredOption(false);
    this.onChangeClientField('clientReferralType', option);
  }


  onChangeInputSwitch = (requireCard) => {
    this.setState({ requireCard });
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

    this.checkValidation();

    return newState;
  });


  onValidatePhone = isValid => this.setState((state) => {
    const newState = state;
    newState.isValidPhone = state.client.phones !== undefined ? isValid : true;

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
    newState.isValidBirth = this.state.requiredFields.birth ? isValid : true;

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

  setReferredOptionTrue =() => {
    this.selectReferredOption(true);
  }

  setReferredOptionFalse =() => {
    this.selectReferredOption(false);
  }

  calculateRequiredFields = (result) => {
    if (result) {
      const { settings } = this.props.settingsState;

      const required: { [key: string]: boolean } = { };

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
      required.birth = trackClientAge && (forceChildBirthday || forceAdultBirthday);
      required.gender = requireClientGender;
      required.zip = isLargeForm;
      required.state = isLargeForm;

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
      && this.state.isValidPhone);
  }

  deleteClient = () => {
    const message = `Are you sure you want to delete user ${this.state.client.name} ${this.state.client.lastName}?`;
    Alert.alert(
      'Delete client',
      message,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
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
    } else {
      alert(message);
    }
  }


  selectReferredOption = (selectedReferredClient) => {
    if (selectedReferredClient) {
      const newClient = this.state.client;
      newClient.clientReferralType = null;
      this.setState({ selectedReferredClient, client: newClient });
      this.handlePressClient();
    } else {
      this.setState({ selectedClient: null, selectedReferredClient });
    }
  }

  handlePressClient = () => {
    const { navigate } = this.props.navigation;

    navigate('ApptBookClient', {
      selectedClient: this.state.selectedClient,
      actionType: 'update',
      dismissOnSelect: true,
      headerProps: { title: 'Clients', ...this.cancelButton() },
      onChangeClient: client => this.handleClientSelection(client),
    });
  }

  handleDone = () => {
    const client = {
      firstName: this.state.client.name,
      lastName: this.state.client.lastName,
      middleName: this.state.client.middleName,
      birthday: moment(this.state.client.birthday).isValid() ? moment(this.state.client.birthday).format('YYYY-MM-DD') : null,
      age: this.state.client.age ? this.state.client.age.key : null,
      email: this.state.client.email,
      phones: reject(this.state.client.phones, ['value', null]),
      address: {
        street1: this.state.client.street1,
        city: this.state.client.city ? this.state.client.city : null,
        state: this.state.client.state ? this.state.client.state.value : null,
        zipCode: this.state.client.zipCode ? this.state.client.zipCode : null,
      },
      gender: this.state.client.gender ? this.state.client.gender.key : null,
      loyaltyNumber: this.state.client.loyaltyNumber,
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


    this.props.clientInfoActions.putClientInfo(this.props.client.id, client, (result, message) => {
      if (result) {
        this.props.appointmentCalendarActions.setGridView();
        this.props.navigation.goBack();
      } else {
        alert(message);
      }
    });
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })

  handleClientSelection = (selectedClient) => {
    this.setState({ selectedClient });
  }

  isValidEmailRegExp = regexs.email;
  isValidZipCodeRegExp = regexs.zipcode;
  isValidPhoneRegExp = regexs.phone;
  isValidText = regexs.notemptytext;
  isValidAddress= regexs.address;


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

      const clientReferralType = find(this.props.clientInfoState.clientReferralTypes, { key: client.clientReferralTypeId });
      client.clientReferralType = clientReferralType;

      if (client.clientReferralType) {
        this.selectReferredOption(false);
      }

      this.setState({
        client,
        loadingClient: false,
        pointerEvents: this.props.editionMode ? 'auto' : 'none',
      });
    }
  }


  renderPhone = (phone, index) => {
    const phoneType = phone.type === 0 ? 'Cell' : (phone.type === 1 ? 'Home' : 'Work');
    const element = phone.value !== null ? (
      <React.Fragment>
        <ValidatableInput
          mask="[000]-[000]-[0000]"
          validateOnChange
          validation={this.isValidPhoneRegExp}
          isValid={this.state.isValidPhone}
          onValidated={this.onValidatePhone}
          label={phoneType}
          value={phone.value}
          onChangeText={(text) => { this.onChangeClientField('phone', text, phone.type); }}
          placeholder="Enter"
        />
        <InputDivider />
      </React.Fragment>) : null;
    return (element);
  }


  render() {
    return (
      <View style={styles.container}>

        {this.props.clientInfoState.isLoading || this.state.loadingClient
          ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
          ) : (

            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
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
                    placeholder="Enter"
                  />
                  <InputDivider />
                  <LabeledTextInput
                    label="Middle Name"
                    value={this.state.client.middleName}
                    onChangeText={(text) => { this.onChangeClientField('middleName', text); }}
                    placeholder="Enter"
                  />
                  <InputDivider />
                  <ValidatableInput
                    validateOnChange
                    validation={this.isValidText}
                    isValid={this.state.isValidLastName}
                    onValidated={this.onValidateLastName}
                    label="Last Name"
                    value={this.state.client.lastName}
                    onChangeText={(text) => { this.onChangeClientField('lastName', text); }}
                    placeholder="Enter"
                  />
                </InputGroup>

                <SectionTitle value="MAIN INFO" style={styles.sectionTitle} />
                <InputGroup>
                  <LabeledTextInput
                    label="Loyalty Number"
                    value={this.state.client.loyalty}
                    onChangeText={(text) => { this.onChangeClientField('loyalty', text); }}
                    placeholder="Enter"
                  />
                  <InputDivider />
                  <InputDate
                    placeholder="Birthday"
                    required={this.state.requiredFields.birth}
                    isValid={this.state.isValidBirth}
                    onValidated={this.onValidateBirth}
                    onPress={(selectedDate) => { this.onChangeClientField('birthday', selectedDate); }}
                    selectedDate={this.state.client.birthday ? moment(this.state.client.birthday) : false}
                  />
                  <InputDivider />
                  <InputPicker
                    label="Age"
                    required={this.state.requiredFields.age}
                    isValid={this.state.isValidAge}
                    onValidated={this.onValidateAge}
                    value={this.state.client.age ? this.state.client.age : null}
                    onChange={(option) => { this.onChangeClientField('age', option); }}
                    defaultOption={this.state.client.age}
                    options={ages}
                  />
                  <InputDivider />
                  <InputDate
                    placeholder="Anniversary"
                    onPress={(selectedDate) => { this.onChangeClientField('anniversary', selectedDate); }}
                    selectedDate={this.state.client.anniversary ? this.state.client.anniversary : false}
                  />
                  <InputDivider />
                  <LabeledTextInput
                    label="Client ID"
                    value={this.state.client.clientId}
                    onChangeText={(text) => { this.onChangeClientField('clientId', text); }}
                    placeholder="Enter"
                  />
                  <InputDivider />
                  <InputPicker
                    label="Gender"
                    required={this.state.requiredFields.gender}
                    isValid={this.state.isValidGender}
                    onValidated={this.onValidateGender}
                    value={this.state.client.gender ? this.state.client.gender : null}
                    onChange={(option) => { this.onChangeClientField('gender', option); }}
                    defaultOption={this.state.client.gender}
                    options={genders}
                  />
                </InputGroup>
                <SectionTitle value="CONTACTS" style={styles.sectionTitle} />
                <InputGroup>
                  <ValidatableInput
                    validateOnChange
                    validation={this.isValidEmailRegExp}
                    label="Email"
                    isValid={this.state.isValidEmail}
                    onValidated={this.onValidateEmail}
                    value={this.state.client.email}
                    onChangeText={(text) => { this.onChangeClientField('email', text); }}
                    placeholder="Enter"
                  />
                  <InputDivider />
                  {this.state.client.phones && this.state.client.phones.map((phone, index) => this.renderPhone(phone, index))}
                  <SalonTouchableOpacity onPress={this.props.onAddContact}>
                    <View style={styles.addRow}>
                      <FontAwesome style={styles.plusIcon}>{Icons.plusCircle}</FontAwesome>
                      <Text style={styles.textData}>add contact</Text>
                    </View>
                  </SalonTouchableOpacity>

                </InputGroup>
                <SectionDivider />
                <InputGroup>
                  <InputPicker
                    label="Confirmation"
                    value={this.state.client.confirmBy ? this.state.client.confirmBy : null}
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
                    placeholder="Please insert here your comments"
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
                    placeholder="Enter"
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
                    placeholder="Enter"
                  />
                  <InputDivider />
                  <InputPicker
                    label="State"
                    required={this.state.requiredFields.state}
                    isValid={this.state.isValidState}
                    onValidated={this.onValidateState}
                    value={this.state.client.state ? this.state.client.state : null}
                    onChange={(option) => { this.onChangeClientField('state', option); }}
                    defaultOption={this.state.client.state}
                    options={usStates}
                  />
                  <InputDivider />
                  <ValidatableInput
                    validateOnChange
                    mask="[00000]"
                    validation={this.isValidZipCodeRegExp}
                    isValid={this.state.isValidZipCode}
                    onValidated={this.onValidateZipCode}
                    label="ZipCode"
                    value={this.state.client.zipCode}
                    onChangeText={(text) => { this.onChangeClientField('zipCode', text); }}
                    placeholder="Enter"
                  />
                </InputGroup>

                <SectionTitle value="REFERRED BY" style={styles.sectionTitle} />
                <InputGroup>
                  <View style={styles.referredClientView}>
                    <SalonTouchableOpacity onPress={this.setReferredOptionTrue}>
                      <FontAwesome style={this.state.selectedReferredClient ? styles.selectedCheck : styles.unselectedCheck}>
                        {this.state.selectedReferredClient ? Icons.checkCircle : Icons.circle}
                      </FontAwesome>
                    </SalonTouchableOpacity>

                    <ClientInput
                      apptBook
                      label="Select Client"
                      selectedClient={this.state.selectedClient}
                      style={styles.clientInput}
                      extraComponents={this.state.selectedClient === null ?
                        <Text style={styles.optionaLabel}>Optional</Text> : null}
                      onPress={this.setReferredOptionTrue}
                      navigate={this.props.navigation.navigate}
                      headerProps={{ title: 'Clients', ...this.cancelButton() }}
                      onChange={this.handleClientSelection}
                    />
                  </View>
                  <InputDivider />
                  <View style={styles.clientReferralTypeContainer}>
                    <SalonTouchableOpacity onPress={this.setReferredOptionFalse}>
                      <FontAwesome style={this.state.selectedReferredClient ? styles.unselectedCheck : styles.selectedCheck}>
                        {this.state.selectedReferredClient ? Icons.circle : Icons.checkCircle}
                      </FontAwesome>
                    </SalonTouchableOpacity>

                    <View style={styles.clientReferralTypeInput}>
                      <InputPicker
                        label="Other"
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
              </View>
            </KeyboardAwareScrollView>)}
      </View>
    );
  }
}

ClientDetails.defaultProps = {
  editionMode: true,
};

ClientDetails.propTypes = {
  appointmentCalendarActions: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  setCanSave: PropTypes.func.isRequired,
  setHandleDone: PropTypes.func.isRequired,
  editionMode: PropTypes.bool,
  settingsState: PropTypes.any.isRequired,
  clientInfoState: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  settingsActions: PropTypes.shape({
    getSettings: PropTypes.func.isRequired,
  }).isRequired,
  clientInfoActions: PropTypes.shape({
    getClientReferralTypes: PropTypes.func.isRequired,
    getClientInfo: PropTypes.func.isRequired,
    putClientInfo: PropTypes.func.isRequired,
    deleteClientInfo: PropTypes.func.isRequired,
  }).isRequired,
};

export default ClientDetails;
