import * as React from 'react';
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
  SectionTitle,
  LabeledTextInput,
  InputPicker,
  ClientInput,
  SectionDivider,
  InputSwitch,
  LabeledTextarea,
  ValidatableInput,
} from '../../../../components/formHelpers';
import SalonTimePicker from '../../../../components/formHelpers/components/SalonTimePicker';

import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import usStates from '../../../../constants/UsStates';
import gendersEnum from '../../../../constants/Genders';
import agesEnum from '../../../../constants/Ages';
import confirmByTypesEnum from '../../../../constants/ClientConfirmByTypes';
import regexs from '../../../../constants/Regexs';
import createStyleSheet from './styles';
import SalonHeader from '../../../../components/SalonHeader';

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
  loyalty: number,
  birthday: string,
  age: number,
  anniversary: any,
  clientId: number,
  gender: any,
  phones: [{ type:number, value: string }],
  email: string,
  confirmBy: any,
  requireCard: any,
  decline: any,
  confirmationNote: any,
  street1: string,
  city: string,
  state: any,
  zipCode: string,
  selectedReferredClient: any,
  selectedClient: any,
  clientReferralType: any,
  client: any,
  loadingClient: boolean,
  hasChanged: boolean,
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
  birthdayPickerOpen: boolean,
  anniversaryPickerOpen: boolean,
  requiredFields: { [key: string]: boolean },
  pointerEvents: any
}

class ClientDetails extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let title = 'Client Info';
    if (params && params.client) {
      title = `${params.client.name} ${params.client.lastName}`;
    }

    const canSave = params.canSave || false;
    const showDoneButton = params.showDoneButton;
    const handleDone = navigation.state.params.handleDone ?
      navigation.state.params.handleDone :
      () => { Alert.alert('Not Implemented'); };

    const handleBack = params.handleBack ?
      () => { params.handleBack(); navigation.goBack(); } :
      navigation.goBack;


    const styles = createStyleSheet()

    return ({
      header: (
        <SalonHeader
          title={title}
          headerLeft={(
            <SalonTouchableOpacity onPress={handleBack}>
              <View style={styles.backContainer}>
                <FontAwesome style={styles.backIcon}>
                  {Icons.angleLeft}
                </FontAwesome>
                <Text style={styles.leftButtonText}>
                  Back
                </Text>
              </View>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            showDoneButton ? (
              <SalonTouchableOpacity
                disabled={!canSave}
                onPress={handleDone}
              >
                <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
                  Done
                </Text>
              </SalonTouchableOpacity>
            ) : null
          )}
        />
      ),
    });
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      pointerEvents: '',
      clientReferralType: '',
      state: '',
      city: '',
      street1: '',
      confirmationNote: '',
      confirmBy: null,
      email: '',
      phones: null,
      gender: null,
      clientId: null,
      anniversary: null,
      age: null,
      birthday: '',
      loyalty: null,
      lastName: '',
      middleName: '',
      name: '',
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
      styles: createStyleSheet()
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

  onChangeClientField = (field: string, value: any, type? : any) => {
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

  onValidateEmail = isValid => {

    const isValidEmail = this.state.requiredFields.email ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidEmail
    })
};

  onValidateZipCode = isValid => {

    const isValidZipCode = this.state.requiredFields.zip ? isValid : true;

    if (isValid && this.state.client.zipCode && this.state.client.zipCode.length === 5) {
      this.props.clientInfoActions.getZipCode(this.state.client.zipCode, this.loadDataFromZipCode);
    }

    this.checkValidation();

    this.setState({
      isValidZipCode
    })
};


  onValidatePhoneWork = isValid => {

      const phone = find(this.state.client.phones, { type: 0 });

      const isValidPhoneWork = phone !== undefined ? isValid : true;

      this.checkValidation();

      this.setState({
        isValidPhoneWork
      })
  };

  onValidatePhoneHome = isValid => {

    const phone = find(this.state.client.phones, { type: 1 });

    const isValidPhoneHome = phone !== undefined && phone.value && phone.value.length > 0 ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidPhoneHome
    })
};

  onValidatePhoneCell  = isValid => {

    const phone = find(this.state.client.phones, { type: 2 });

    const isValidPhoneCell = phone !== undefined && phone.value && phone.value.length > 0 ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidPhoneCell
    })
};


  onValidateName = isValid => {

    const isValidName = this.state.client.name !== undefined ? isValid : true;
    this.checkValidation();

    this.setState({
      isValidName
    })
};

  onValidateLastName = isValid => {

    const isValidLastName = this.state.client.lastName !== undefined ? isValid : true;
    this.checkValidation();

    this.setState({
      isValidLastName
    })
};
  onValidateStreet1 = isValid => {


    const isValidStreet1 = this.state.requiredFields.address ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidStreet1
    })
};

  onValidateCity = isValid => {

    const isValidCity = this.state.requiredFields.city ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidCity
    })
};

  onValidateGender =isValid => {

    const isValidGender = this.state.requiredFields.gender ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidGender
    })
};

  onValidateBirth = isValid => {

    const isValidBirth = this.state.requiredFields.birthday ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidBirth
    })
};

  onValidateAge = isValid => {

    const isValidAge = this.state.requiredFields.age ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidAge
    })
};

  onValidateState = isValid => {

    const isValidState = this.state.requiredFields.state ? isValid : true;

    this.checkValidation();

    this.setState({
      isValidState
    })
};

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

      const requiredFields: { [key: string]: boolean } = {};

      const trackClientAge = find(settings, { settingName: 'TrackClientAge' }).settingValue;
      const forceAgeInput = find(settings, { settingName: 'ForceAgeInput' }).settingValue;
      const isLargeForm = find(settings, { settingName: 'UseFullClientFormApptQueue' }).settingValue;
      const forceChildBirthday = find(settings, { settingName: 'ForceChildBirthday' }).settingValue;
      const forceAdultBirthday = find(settings, { settingName: 'ForceAdultBirthday' }).settingValue;
      const requireClientGender = find(settings, { settingName: 'RequireClientGender' }).settingValue;

      requiredFields.age = trackClientAge && forceAgeInput;
      requiredFields.address = isLargeForm;// && address !== 'Decline';
      requiredFields.city = isLargeForm;
      requiredFields.email = isLargeForm;// && email !== 'Will-not-provide';
      requiredFields.birthday = trackClientAge && (forceChildBirthday || forceAdultBirthday);
      requiredFields.gender = requireClientGender;
      requiredFields.zip = isLargeForm;
      requiredFields.state = isLargeForm;
      requiredFields.workPhone = true;
      requiredFields.homePhone = false;
      requiredFields.cellPhone = false;

      this.setState({
        isValidGender: !requiredFields.gender,
        isValidBirth: !requiredFields.birthday,
        isValidAge: !requiredFields.age,
        isValidPhoneWork: !requiredFields.workPhone,
        isValidPhoneHome: !requiredFields.homePhone,
        isValidPhoneCell: !requiredFields.cellPhone,
      });

      this.setState({ requiredFields });
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


  selectReferredOption = (selectedReferredClient: any, navigateToClients?: boolean) => {
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
            client: JSON.parse(JSON.stringify(clientResult)),
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
    leftButton: <Text style={this.state.styles.cancelButton}>Cancel</Text>,
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
        return Alert.alert("Birthday can't be greater than today");
      }
    }

    this.setState({ birthdayPickerOpen: !this.state.birthdayPickerOpen });
  };


  pickerToogleAnniversary = () => {
    if (this.state.anniversaryPickerOpen) {
      if (moment(this.state.client.anniversary).isAfter(moment())) {
        return Alert.alert("Anniversary can't be greater than today");
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
            inputStyle={phone.value ? {} : this.state.styles.inputStyle}
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
      <View style={this.state.styles.container}>

        {(this.props.clientInfoState.isLoading || this.state.loadingClient) ?
          <View style={this.state.styles.loadingContainer}>
            <ActivityIndicator />
          </View>
          :

          <KeyboardAwareScrollView extraHeight={300} /*enableAutoAutomaticScroll={false}*/>
            <View pointerEvents={this.state.pointerEvents}>
              <SectionTitle value="NAME" style={this.state.styles.sectionTitle} />
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
                  inputStyle={this.state.client.name ? {} : this.state.styles.inputStyle}
                />
                <InputDivider />
                <LabeledTextInput
                  inputStyle={this.state.client.middleName ? {} : this.state.styles.inputStyle}
                  label="Middle Name"
                  value={this.state.client.middleName}
                  onChangeText={(text) => { this.onChangeClientField('middleName', text); }}
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
                  onChangeText={(text) => { this.onChangeClientField('lastName', text); }}
                  placeholder=""
                />
              </InputGroup>

              <SectionTitle value="MAIN INFO" style={this.state.styles.sectionTitle} />
              <InputGroup>
                <LabeledTextInput
                  label="Loyalty Number"
                  value={this.state.client.loyalty}
                  onChangeText={(text) => { this.onChangeClientField('loyalty', text); }}
                  placeholder=""
                  keyboardType="number-pad"
                  inputStyle={this.state.client.loyalty ? {} : this.state.styles.inputStyle}
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
                  valueStyle={!this.state.client.birthday ? this.state.styles.dateValueStyle : {}}
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
                  noValueStyle={!this.state.client.age ? this.state.styles.dateValueStyle : {}}
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
                  valueStyle={!this.state.client.anniversary ? this.state.styles.dateValueStyle : {}}
                />

                <InputDivider />
                <LabeledTextInput
                  label="Client ID"
                  value={this.state.client.clientId}
                  onChangeText={(text) => { this.onChangeClientField('clientId', text); }}
                  placeholder=""
                  inputStyle={this.state.client.clientId ? {} : this.state.styles.inputStyle}
                />
                <InputDivider />
                <InputPicker
                  label="Gender"
                  placeholder=""
                  required={this.state.requiredFields.gender}
                  isValid={this.state.isValidGender}
                  onValidated={this.onValidateGender}
                  noValueStyle={!this.state.client.gender ? this.state.styles.dateValueStyle : {}}
                  value={this.state.client.gender ? this.state.client.gender : null}
                  onChange={(option) => { this.onChangeClientField('gender', option); }}
                  defaultOption={this.state.client.gender}
                  options={genders}
                />
              </InputGroup>
              <SectionTitle value="CONTACTS" style={this.state.styles.sectionTitle} />
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
                  inputStyle={this.state.client.email ? {} : this.state.styles.inputStyle}
                />
                <InputDivider />

                <InputSwitch
                  style={this.state.styles.inputSwitch}
                  textStyle={this.state.styles.inputSwitchText}
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
                  style={this.state.styles.inputSwitch}
                  textStyle={this.state.styles.inputSwitchText}
                  onChange={this.onChangeInputSwitch}
                  value={this.state.requireCard}
                  text="Req. card on file to book"
                />
                <InputDivider style={this.state.styles.inputDivider} />
                <LabeledTextarea
                  label="Notes"
                  placeholder=""
                  onChangeText={(text) => { this.onChangeClientField('confirmationNote', text); }}
                  value={this.state.client.confirmationNote}
                />
              </InputGroup>
              <SectionTitle value="ADDRESS" style={this.state.styles.sectionTitle} />
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
                  onChangeText={(text) => { this.onChangeClientField('city', text); }}
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
                  inputStyle={!this.props.clientInfoState.isLoadingZipCode && this.state.client.zipCode ? {} : this.state.styles.inputStyle}
                  icon={this.props.clientInfoState.isLoadingZipCode ?

                    <View style={this.state.styles.activityIndicator}>
                      <ActivityIndicator />
                    </View>

                    : null}
                />
              </InputGroup>

              <SectionTitle value="REFERRED BY" style={this.state.styles.sectionTitle} />
              <InputGroup>
                <View style={this.state.styles.referredClientView}>
                  <SalonTouchableOpacity onPress={() => { this.setReferredOptionClient(true); }}>
                    <FontAwesome style={this.state.selectedReferredClient === SelectedReferredClientEnum.Client ? this.state.styles.selectedCheck : this.state.styles.unselectedCheck}>
                      {this.state.selectedReferredClient === SelectedReferredClientEnum.Client ? Icons.checkCircle : Icons.circle}
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
                    <FontAwesome style={this.state.selectedReferredClient === SelectedReferredClientEnum.Other ? this.state.styles.selectedCheck : this.state.styles.unselectedCheck}>
                      {this.state.selectedReferredClient === SelectedReferredClientEnum.Other ? Icons.checkCircle : Icons.circle}
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

export default ClientDetails;
