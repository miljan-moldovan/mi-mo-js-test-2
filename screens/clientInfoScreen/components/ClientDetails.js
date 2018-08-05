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
import { find } from 'lodash';
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
} from '../../../components/formHelpers';
import clientInfoActions from '../../../actions/clientInfo';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import { appointmentCalendarActions } from '../../appointmentCalendarScreen/redux/appointmentScreen';


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
});

const genders = [
  { key: 1, value: 'unspecified' },
  { key: 2, value: 'male' },
  { key: 3, value: 'female' },
];

const states = [{ key: 1, value: 'AK' },
  { key: 2, value: 'AL' },
  { key: 3, value: 'AR' },
  { key: 4, value: 'AZ' },
  { key: 5, value: 'CA' },
  { key: 6, value: 'CO' },
  { key: 7, value: 'CT' },
  { key: 8, value: 'DE' },
  { key: 9, value: 'FL' },
  { key: 10, value: 'GA' },
  { key: 11, value: 'HI' },
  { key: 12, value: 'IA' },
  { key: 13, value: 'ID' },
  { key: 14, value: 'IL' },
  { key: 15, value: 'IN' },
  { key: 16, value: 'KS' },
  { key: 17, value: 'KY' },
  { key: 18, value: 'LA' },
  { key: 19, value: 'MA' },
  { key: 20, value: 'MD' },
  { key: 21, value: 'ME' },
  { key: 22, value: 'MI' },
  { key: 23, value: 'MN' },
  { key: 24, value: 'MO' },
  { key: 25, value: 'MS' },
  { key: 26, value: 'MT' },
  { key: 27, value: 'NC' },
  { key: 28, value: 'ND' },
  { key: 29, value: 'NE' },
  { key: 30, value: 'NH' },
  { key: 31, value: 'NJ' },
  { key: 32, value: 'NM' },
  { key: 33, value: 'NV' },
  { key: 34, value: 'NY' },
  { key: 35, value: 'OH' },
  { key: 36, value: 'OK' },
  { key: 37, value: 'OR' },
  { key: 38, value: 'PA' },
  { key: 39, value: 'RI' },
  { key: 40, value: 'SC' },
  { key: 41, value: 'SD' },
  { key: 42, value: 'TN' },
  { key: 43, value: 'TX' },
  { key: 44, value: 'UT' },
  { key: 45, value: 'VA' },
  { key: 46, value: 'VT' },
  { key: 47, value: 'WA' },
  { key: 48, value: 'WI' },
  { key: 49, value: 'WV' },
  { key: 50, value: 'WY' }];

class ClientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      selectedClient: null,
      selectedReferredClient: true,
    };

    this.handleClientSelection.bind(this);
  }

  componentWillMount() {
    this.props.clientInfoActions.getClientInfo(this.props.client.id, this.loadClientData);
  }

  loadClientData = (response) => {
    const client = this.props.clientInfoState.client;

    const address = client.address.split(',');


    if (address.length > 1) {
      client.address = address[0].trim();
      client.city = address[1].trim();
      const address_second = address[2].trim();
      const state_name = address_second.split(' ')[0];

      const state = find(states, { value: state_name.toUpperCase() });
      client.state = state;

      client.zip = address_second.split(' ')[1];

      this.props.setCanSave(false);
      this.props.setHandleDone(this.handleDone);
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
      birthday: moment(this.state.client.birthday).format('YYYY-MM-DD'),
      age: moment().diff(moment(this.state.client.birthday).format('YYYY-MM-DD'), 'years'),
      email: this.state.client.email,
      phones: this.state.client.phones,
      address: {
        street1: this.state.client.address,
        //  street2: 'string',
        city: this.state.client.city,
        state: this.state.client.state.value,
        zipCode: this.state.client.zip,
      },
      gender: this.state.client.gender.key,
      loyaltyNumber: this.state.client.loyaltyNumber,
      // confirmBy: 1,
      // clientPreferenceProviderType: 1,
      // preferredProviderId: 0,
      referredByClientId: this.state.selectedClient ? this.state.selectedClient.id : null,
      // clientReferralTypeId: 0,
      // clientCode: 'string',
      // anniversary: '2018-08-05T18:04:08.330Z',
      // receivesEmail: true,
    //  requireCard: true,
      // occupationId: 0,
      // confirmationNote: 'string',
      // profilePhotoUuid: 'string',
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

  onChangeClientField = (field, value) => {
    this.props.setCanSave(true);

    debugger //eslint-disable-line

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
        break;
      case 'loyalty':
        newClient.loyalty = value;
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
      default:
            /* nothing */
    }

    this.setState({ client: newClient });
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
      this.setState({ selectedReferredClient });
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
                  <LabeledTextInput
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
                  <LabeledTextInput
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
                    onPress={(selectedDate) => { this.onChangeClientField('loyalty', selectedDate); }}
                    selectedDate={this.state.client.birthday ? moment(this.state.client.birthday) : false}
                  />
                  <InputDivider />
                  {/*  <InputDate
                    placeholder="Anniversary"
                    onPress={(selectedDate) => { this.onChangeClientField('anniversary', selectedDate); }}
                    selectedDate={this.state.client.anniversary ? this.state.client.anniversary : false}
                  />
                  <InputDivider /> */}
                  <LabeledTextInput
                    label="Client ID"
                    value={this.state.client.id}
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
                  <LabeledTextInput
                    label="Email"
                    value={this.state.client.email}
                    onChangeText={(text) => { this.onChangeClientField('email', text); }}
                    placeholder="Enter"
                  />

                  {find(this.state.client.phones, { type: 0 }) ?
                    <LabeledTextInput
                      label="Cell"
                      value={find(this.state.client.phones, { type: 0 }).value}
                      onChangeText={(text) => { this.onChangeClientField('cell', text); }}
                      placeholder="Enter"
                    />
                    : null
                  }

                  {find(this.state.client.phones, { type: 1 }) ?
                    <LabeledTextInput
                      label="Home"
                      value={find(this.state.client.phones, { type: 1 }).value}
                      onChangeText={(text) => { this.onChangeClientField('home', text); }}
                      placeholder="Enter"
                    />
                    : null
                  }


                  {find(this.state.client.phones, { type: 2 }) ?
                    <LabeledTextInput
                      label="Work"
                      value={find(this.state.client.phones, { type: 2 }).value}
                      onChangeText={(text) => { this.onChangeClientField('work', text); }}
                      placeholder="Enter"
                    />
                    : null
                  }

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
                  <LabeledTextInput
                    label="ZIP"
                    value={this.state.client.zip}
                    onChangeText={(text) => { this.onChangeClientField('zip', text); }}
                    placeholder="Enter"
                  />
                </InputGroup>

                <SectionTitle value="REFERRED BY" style={styles.sectionTitle} />
                <InputGroup>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
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

                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <SalonTouchableOpacity onPress={() => {
                      this.selectReferredOption(false);
                      }}
                    >
                      <FontAwesome style={this.state.selectedReferredClient ? styles.unselectedCheck : styles.selectedCheck}>
                        {this.state.selectedReferredClient ? Icons.circle : Icons.checkCircle}
                      </FontAwesome>
                    </SalonTouchableOpacity>

                    <InputButton
                      noIcon
                      onPress={() => {
                        this.selectReferredOption(false);
                        }}
                      label="Other"
                    />
                  </View>
                </InputGroup>
                <SectionDivider />
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
});

export default connect(mapStateToProps, mapActionsToProps)(ClientDetails);
