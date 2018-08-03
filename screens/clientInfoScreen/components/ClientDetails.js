import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import moment from 'moment';
import { find } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
      editionMode: false,
      pointerEvents: 'none',
      selectedClient: null,
    };

    this.handleClientSelection.bind(this);
  }


  componentWillMount() {
    const address = this.props.client.address.split(',');
    debugger //eslint-disable-line

    if (address.length > 1) {
      this.props.client.address = address[0].trim();
      this.props.client.city = address[1].trim();
      const address_second = address[2].trim();
      const state_name = address_second.split(' ')[0];

      const state = find(states, { value: state_name.toUpperCase() });
      this.props.client.state = state;

      this.props.client.zip = address_second.split(' ')[1];
    }


    this.setState({
      client: this.props.client,
      editionMode: this.props.editionMode,
      pointerEvents: this.props.editionMode ? 'auto' : 'none',
    });
  }

  onChangeClientField = (field, value) => {
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

    navigate('Clients', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeClient: this.handleClientSelection,
    });
  }

  render() {
    return (
      <View style={styles.container}>

        {false
          // this.props.employeeScheduleState.isLoading
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
                    onChangeText={(text) => { this.onChangeClientField('id', text); }}
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
                  <ClientInput
                    apptBook
                    label={false}
                    selectedClient={this.state.selectedClient}
                    placeholder={this.state.selectedClient === null ? 'Select Client' : 'Client'}
                    placeholderStyle={styles.placeholderText}
                    style={styles.clientInput}
                    extraComponents={this.state.selectedClient === null ?
                      <Text style={styles.optionaLabel}>Optional</Text> : null}
                    onPress={this.handlePressClient}
                    navigate={this.props.navigation.navigate}
                    headerProps={{ title: 'Clients', ...this.cancelButton() }}
                    onChange={this.handleClientSelection}
                  />
                </InputGroup>
                <SectionDivider />
                <InputGroup>
                  <InputButton
                    noIcon
                    childrenContainerStyle={{
                      justifyContent: 'center', alignItems: 'center',
                    }}
                    onPress={() => alert('pressed')}
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

export default ClientDetails;
