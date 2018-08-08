import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import moment from 'moment';
import { isEmpty, find, reject } from 'lodash';
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
} from '../../../components/formHelpers';
import clientInfoActions from '../../../actions/clientInfo';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import { appointmentCalendarActions } from '../../appointmentCalendarScreen/redux/appointmentScreen';
import states from '../../../constants/UsStates';
import genders from '../../../constants/Genders';
import confirmByTypes from '../../../constants/ClientConfirmByTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputGroup: { marginTop: 16 },
  inputSwitch: { height: 43 },
  inputSwitchText: { color: '#727A8F' },
  sectionTitle: { height: 38 },
  labelText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
  },
  optionaLabel: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  clientInput: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 16,
    flex: 1,
  },
  clientReferralTypeInput: {
    height: 44,
    backgroundColor: '#fff',
    paddingLeft: 0,
    paddingRight: 24,
    width: '96%',
  },
  unselectedCheck: {
    fontSize: 20,
    color: '#727A8F',
    fontWeight: 'normal',
    width: 20,
    marginRight: 20,
  },
  selectedCheck: {
    fontSize: 20,
    color: '#1ABF12',
    width: 20,
    marginRight: 20,
  },
  addRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
  },
  plusIcon: {
    color: '#115ECD',
    fontSize: 22,
    marginRight: 5,
  },
  textData: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
    marginLeft: 5,
  },
  deleteText: { color: '#D1242A', fontFamily: 'Roboto-Medium' },
  deleteButton: {
    justifyContent: 'center', alignItems: 'center',
  },
  referredClientView: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  inputDivider: { marginBottom: 10 },
});

class ClientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      selectedClient: null,
      selectedReferredClient: true,
      requireCard: true,
      hasChanged: false,
      isValidEmail: false,
      isValidZipCode: false,
      isValidPhone: false,
      isValidName: false,
      isValidLastName: false,
    };

    this.handleClientSelection.bind(this);
  }

  isValidEmailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isValidZipCodeRegExp = /(^\d{5}$)|(^\d{5}-\d{4}$)/
  isValidPhoneRegExp = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
  isValidText = /^(?!\s*$).+/
  isValidAddress=/^(.+?),\s?(\w+),?\s?(\w{2})\s+(\d{5}?)/;

  componentWillMount() {
    this.props.clientInfoActions.getClientReferralTypes(() => {
      this.props.clientInfoActions.getClientInfo(this.props.client.id, this.loadClientData);
    });
  }

  loadClientData = (response) => {
    const client = this.props.clientInfoState.client;

    const matches = client.address.match(this.isValidAddress);

    if (matches && matches.length > 4) {
      const street = matches[1];
      const city = matches[2];

      const zip = matches[4];

      client.address = street.trim();
      client.city = city.trim();
      const state = find(states, { value: matches[3].trim().toUpperCase() });
      client.state = state;

      client.zip = zip.trim();
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
      editionMode: this.props.editionMode,
      pointerEvents: this.props.editionMode ? 'auto' : 'none',
    });
  }

  handleDone = () => {
    const client = {
      firstName: this.state.client.name,
      lastName: this.state.client.lastName,
      middleName: this.state.client.middleName,
      birthday: moment.isMoment(this.state.client.birthday) ? moment(this.state.client.birthday).format('YYYY-MM-DD') : '2018-08-07T19:13:30.459Z',
      age: moment().diff(moment(this.state.client.birthday).format('YYYY-MM-DD'), 'years'),
      email: this.state.client.email,
      phones: reject(this.state.client.phones, ['value', null]),
      address: {
        street1: this.state.client.address,
        city: this.state.client.city ? this.state.client.city : null,
        state: this.state.client.state ? this.state.client.state.value : null,
        ZipCode: this.state.client.zip ? this.state.client.zip : null,
      },
      gender: this.state.client.gender ? this.state.client.gender.key : null,
      loyaltyNumber: this.state.client.loyaltyNumber,
      confirmBy: this.state.client.confirmBy ? this.state.client.confirmBy : null,
      referredByClientId: this.state.selectedClient ? this.state.selectedClient.id : null,
      clientReferralTypeId: this.state.client.clientReferralType ? this.state.client.clientReferralType.key : null,
      anniversary: moment.isMoment(this.state.client.anniversary) ? moment(this.state.client.anniversary).format('YYYY-MM-DD') : null,
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
      case 'address':
        newClient.address = value;
        break;
      case 'city':
        newClient.city = value;
        break;
      case 'zip':
        newClient.zip = value;
        break;
      case 'clientId':
        newClient.clientId = value;
        break;
      case 'gender':
        newClient.gender = value;
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
      case 'phone':

        const phone = find(newClient.phones, { type });
        phone.value = value;
        break;
      default:
            /* nothing */
    }

    this.setState({ client: newClient, hasChanged: true });
  }

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })

  handleClientSelection = (selectedClient) => {
    this.setState({ selectedClient });
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

  deleteClient = () => {
    const message = `Are you sure you want to delete user ${this.state.client.name} ${this.state.client.lastName}?`;
    Alert.alert(
      'Delete client',
      message,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.clientInfoActions.deleteClientInfo(this.state.client.id, this.handleDeleteClient);
          },
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

  onChangeClientReferralTypes = (option) => {
    this.selectReferredOption(false);
    this.onChangeClientField('clientReferralType', option);
  }

  renderPhone = (phone, index) => {
    const phoneType = phone.type === 0 ? 'Cell' : (phone.type === 1 ? 'Home' : 'Work');
    const element = phone.value !== null ? (<React.Fragment>
      <ValidatableInput
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

  onChangeInputSwitch = (requireCard) => {
    this.setState({ requireCard });
  }

  onValidateEmail = (isValid, isFirstValidation) => this.setState((state) => {
    const newState = state;
    newState.isValidEmail = state.client.email !== undefined ? isValid : true;

    this.checkValidation();

    return newState;
  })

  onValidateZipCode = (isValid, isFirstValidation) => this.setState((state) => {
    const newState = state;
    newState.isValidZipCode = state.client.zip !== undefined ? isValid : true;

    this.checkValidation();

    return newState;
  });


  onValidatePhone = (isValid, isFirstValidation) => this.setState((state) => {
    const newState = state;
    newState.isValidPhone = state.client.phones !== undefined ? isValid : true;

    this.checkValidation();

    return newState;
  });


  onValidateName = (isValid, isFirstValidation) => this.setState((state) => {
    const newState = state;
    newState.isValidName = state.client.name !== undefined ? isValid : true;
    this.checkValidation();

    return newState;
  });

  onValidateLastName = (isValid, isFirstValidation) => this.setState((state) => {
    const newState = state;
    newState.isValidLastName = state.client.lastName !== undefined ? isValid : true;
    this.checkValidation();

    return newState;
  });

  checkValidation = () => {
    this.props.setCanSave(this.state.hasChanged && this.state.isValidLastName && this.state.isValidName
      && this.state.isValidEmail && this.state.isValidZipCode
      && this.state.isValidPhone);
  }


  render() {
    return (
      <View style={styles.container}>

        {this.props.clientInfoState.isLoading
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
                    onPress={(selectedDate) => { this.onChangeClientField('birthday', selectedDate); }}
                    selectedDate={this.state.client.birthday ? moment(this.state.client.birthday) : false}
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
                  <LabeledTextInput
                    label="Address Line 1"
                    value={this.state.client.address}
                    onChangeText={(text) => { this.onChangeClientField('address', text); }}
                    placeholder="Enter"
                  />
                  <InputDivider />
                  <LabeledTextInput
                    label="City"
                    value={this.state.client.city}
                    onChangeText={(text) => { this.onChangeClientField('city', text); }}
                    placeholder="Enter"
                  />
                  <InputDivider />
                  <InputPicker
                    label="State"
                    value={this.state.client.state ? this.state.client.state : null}
                    onChange={(option) => { this.onChangeClientField('state', option); }}
                    defaultOption={this.state.client.state}
                    options={states}
                  />
                  <InputDivider />
                  <ValidatableInput
                    validateOnChange
                    validation={this.isValidZipCodeRegExp}
                    isValid={this.state.isValidZipCode}
                    onValidated={this.onValidateZipCode}
                    label="Zip"
                    value={this.state.client.zip}
                    onChangeText={(text) => { this.onChangeClientField('zip', text); }}
                    placeholder="Enter"
                  />
                </InputGroup>

                <SectionTitle value="REFERRED BY" style={styles.sectionTitle} />
                <InputGroup>
                  <View style={styles.referredClientView}>
                    <SalonTouchableOpacity onPress={() => {
                      this.selectReferredOption(true);
                      }}
                    >
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
                      onPress={() => {
                        this.selectReferredOption(true);
                        }}
                      navigate={this.props.navigation.navigate}
                      headerProps={{ title: 'Clients', ...this.cancelButton() }}
                      onChange={this.handleClientSelection}
                    />
                  </View>
                  <InputDivider />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SalonTouchableOpacity onPress={() => {
                      this.selectReferredOption(false);
                      }}
                    >
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


const mapStateToProps = state => ({
  clientInfoState: state.clientInfoReducer,
});

const mapActionsToProps = dispatch => ({
  clientInfoActions: bindActionCreators({ ...clientInfoActions }, dispatch),
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientDetails);
