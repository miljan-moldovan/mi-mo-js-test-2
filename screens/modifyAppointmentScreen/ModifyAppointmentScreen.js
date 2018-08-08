import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import moment from 'moment';
import { get } from 'lodash';

import {
  DefaultAvatar,
  InputGroup,
  InputText,
  InputLabel,
  InputDate,
  SectionTitle,
  InputSwitch,
  InputDivider,
  ClientInput,
  ProviderInput,
  InputNumber,
  InputButton,
  ServiceInput,
  LabeledTextInput,
  SalonTimePicker,
  ValidatableInput,
  RemoveButton,
  LabeledTextarea,
} from '../../components/formHelpers';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonCard from '../../components/SalonCard';
import SalonAvatar from '../../components/SalonAvatar';
import Icon from '../../components/UI/Icon';
import { getEmployeePhoto } from '../../utilities/apiWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Roboto-Bold',
    color: '#727A8F',
  },
  timeCaretIcon: {
    fontSize: 12,
    marginHorizontal: 3,
  },
  serviceTitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
  serviceInfo: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: 'Roboto-Light',
    color: '#727A8F',
  },
  serviceTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  serviceTime: {
    color: '#72838F',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Roboto',
  },
  guestContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default class ModifyAppointmentScreen extends React.Component {
  isValidEmailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  isValidPhoneNumberRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  clientPhoneTypes = {
    cell: 2,
    home: 1,
    work: 0,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return ({
      headerTitle: 'Modify Appointment',
      headerLeft: (
        <SalonTouchableOpacity
          onPress={() => { params.handleCancel(); }}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: 'white',
          }}
          >Cancel
          </Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          onPress={() => params.handleSave()}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: 'white',
          }}
          >Done
          </Text>
        </SalonTouchableOpacity>
      ),
    });
  }

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ handleSave: this.handleSave, handleCancel: this.handleCancel });
    const { appointment } = this.props.state;
    this.state = this.getStateFromAppointment(appointment);
  }

  getStateFromAppointment = (appt) => {
    const selectedService = get(appt, 'service', null);
    const price = get(selectedService, 'price', '0');
    const startTime = moment(get(appt, 'fromTime', null), 'hh:mm');
    const endTime = moment(get(appt, 'toTime', null), 'hh:mm');
    const selectedClient = get(appt, 'client', null);
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.getClientInfo(selectedClient);
    const state = {
      price,
      selectedService,
      clientEmail,
      clientPhone,
      clientPhoneType,
      selectedClient,
      canSave: false,
      date: moment(get(appt, 'date', moment())),
      selectedProvider: get(appt, 'bookedByEmployee', null),
      startTime,
      endTime,
      requested: get(appt, 'requested', true),
      bookBetween: get(appt, 'bookBetween', false),
      gapTime: moment.duration(get(appt, 'gapTime', 0)).asMinutes(),
      afterTime: moment.duration(get(appt, 'afterTime', 0)).asMinutes(),
      room: get(appt, 'room', null),
      resource: get(appt, 'resource', null),
      clientType: get(appt, 'clientType', 0),
      remarks: get(appt, 'remarks', ''),
      startTimePickerOpen: false,
      endTimePickerOpen: false,
    };

    state.length = moment.duration(state.endTime.diff(state.startTime));

    return state;
  }

  handleSelectService = (selectedService) => {
    const { startTime } = this.state;
    let endTime = null;
    if ('maxDuration' in selectedService) {
      endTime = moment(startTime).add(moment.duration(selectedService.maxDuration));
    }
    const length = moment.duration(endTime.diff(startTime));
    const price = get(selectedService, 'price', '0');
    this.setState({
      selectedService,
      endTime,
      length,
      price,
    }, this.validate);
  }

  handleSelectClient = (selectedClient) => {
    this.setState({
      selectedClient,
    }, this.validate);
  }

  handleSelectProvider = (selectedProvider) => {
    this.setState({
      selectedProvider,
    }, this.validate);
  }

  handleRequested = (requested) => {
    this.setState({ requested: !requested }, this.validate);
  }

  handleChangeEndTime = (endTimeDateObj) => {
    const { startTime } = this.state;
    const endTime = moment(endTimeDateObj);
    if (startTime.isAfter(endTime)) {
      return alert("Start time can't be after end time");
    }
    return this.setState({
      endTime,
      length: moment.duration(endTime.diff(startTime)),
    }, this.validate);
  }

  handleChangeStartTime = (startTimeDateObj) => {
    const { endTime } = this.state;
    const startTime = moment(startTimeDateObj);
    if (startTime.isAfter(endTime)) {
      return alert("Start time can't be after end time");
    }
    return this.setState({
      startTime,
      length: moment.duration(endTime.diff(startTime)),
    }, this.validate);
  }

  handleSave = () => null

  handleCancel = () => {
    const { selectedService, selectedProvider } = this.state;
    const serviceTitle = get(selectedService, 'name', null);
    const lastName = String(get(selectedProvider, 'lastName', ''));
    const employeeName = `${get(selectedProvider, 'name', selectedProvider.firstName || '')} ${lastName.length ? lastName[0] : ''}.`;
    const alertBody = serviceTitle ?
      `Are you sure you want to discard this new appointment for service ${serviceTitle} w/ ${employeeName}?` :
      `Are you sure you want to discard this new appointment with ${employeeName}?`;

    Alert.alert(
      'Discard New Appointment?',
      alertBody,
      [
        { text: 'No, Thank You', onPress: () => null },
        { text: 'Yes, Discard', onPress: () => this.props.navigation.goBack() },
      ],
    );
  }

  cancelApptModal = () => {
    // const params = this.props.navigation.state.params || {};
    // if (params.onRemoveService) {
    //   params.onRemoveService();
    // }
    // return this.props.navigation.goBack();
  }

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
  })

  toggleStartTimePicker = () => this.setState(({ startTimePickerOpen }) => ({
    startTimePickerOpen: !startTimePickerOpen,
  }))

  toggleEndTimePicker = () => this.setState(({ endTimePickerOpen }) => ({
    endTimePickerOpen: !endTimePickerOpen,
  }))

  getClientInfo = (client) => {
    const phones = this.createPhonesArr(get(client, 'phones', []));
    const [clientPhone] = phones.filter(item => get(item, 'type', null) === this.clientPhoneTypes.cell);
    return {
      clientPhone,
      clientEmail: get(client, 'email', ''),
      clientPhoneType: clientPhone !== '' ? phones.findIndex(phone => get(phone, 'value', null) === clientPhone) : 0,
    };
  }
  createPhonesArr = (phones) => {
    const createPhone = (type) => {
      const cell = phones.find(itm => get(itm, 'type', null) === this.clientPhoneTypes[type]);
      if (
        !cell ||
        !cell.value ||
        !cell.value.trim() ||
        !this.isValidPhoneNumberRegExp.test(cell.value)
      ) {
        return { type: this.clientPhoneTypes[type], value: '' };
      }
      return cell;
    };
    return [
      createPhone('cell'),
      createPhone('home'),
      createPhone('work'),
    ];
  }

  goToClientInfo = (client) => {
    this.props.navigation.navigate('ClientInfo', { client });
  }

  shouldUpdateClientInfo = async () => {
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.state;
    const { client } = this.props.newAppointmentState;
    const currentPhone = client.phones.find(phone => phone.type === this.clientPhoneTypes.cell);
    const hasEmailChanged = clientEmail !== client.email;
    const hasPhoneChanged = clientPhone !== currentPhone.value;
    const isValidEmail = this.isValidEmailRegExp.test(clientEmail) && clientEmail !== '' && hasEmailChanged;
    const isValidPhone = this.isValidPhoneNumberRegExp.test(clientPhone) && clientPhone !== '' && hasPhoneChanged;
    if (!isValidEmail && !isValidPhone) {
      return false;
    }
    const phones = isValidPhone && hasPhoneChanged ? [
      {
        type: this.clientPhoneTypes.cell,
        value: clientPhone,
      },
      ...client.phones.filter(phone => phone.type !== this.clientPhoneTypes.cell),
    ] : client.phones;
    const email = isValidEmail ? clientEmail : client.email;
    const updated = await Client.putContactInformation(
      client.id,
      {
        id: client.id,
        email,
        phones: this.createPhonesArr(phones),
        confirmationType: 1,
      },
    );
    return updated;
  }

  onValidateEmail = () => this.shouldUpdateClientInfo()

  onValidatePhone = () => this.shouldUpdateClientInfo()

  validate = () => {
    const {
      selectedProvider,
      selectedService,
    } = this.state;
    let valid = false;
    if (selectedProvider !== null || selectedService !== null) {
      valid = true;
    }
    this.setState({ canSave: valid });
    this.props.navigation.setParams({ canSave: valid });
  }

  setPrice = (price) => {
    this.setState({ price: price.replace(/\D/g, '') });
  }

  renderExtraClientButtons = isDisabled => ([
    <SalonTouchableOpacity

      key={Math.random().toString()}
      onPress={() => {
        // const isFormulas = this.props.settingState.data.PrintToTicket === 'Formulas';
        // const url = isFormulas ? 'ClientFormulas' : 'ClientNotes';
        this.props.navigation.navigate('ClientNotes', { client: this.state.selectedClient });
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
    <SalonTouchableOpacity
      key={Math.random().toString()}
      onPress={() => {
        this.goToClientInfo(this.state.selectedClient);
      }}
      style={{
        marginHorizontal: 5,
      }}
    >
      <Icon
        name="infoCircle"
        size={20}
        color="#115ECD"
        type="regular"
      />
    </SalonTouchableOpacity>,
  ]);

  render() {
    const { appointment } = this.props.state;
    if (appointment === null) {
      return this.props.navigation.navigate('SalonCalendar');
    }
    const {
      date,
      selectedClient,
      selectedProvider,
      selectedService,
      startTime,
      endTime,
      requested,
      bookBetween,
      gapTime,
      afterTime,
      length,
      room,
      price,
      resource,
      clientEmail,
      clientPhone,
    } = this.state;
    const isDisabled = this.props.formulasAndNotesState.notes.length < 1;
    return (
      <ScrollView style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <InputLabel
            label="Booked by"
            value={(
              <Text style={{
                fontSize: 14,
                lineHeight: 18,
                color: '#727A8F',
              }}
              >{`${selectedProvider.name} ${selectedProvider.lastName}`}
              </Text>
            )}
          />
          <InputDivider />
          <InputButton
            label="Date"
            value={`${date.format('ddd, MM/DD/YYYY')}, ${startTime.format('hh:mm A')}`}
            onPress={() => null}
          />
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Client" />
        <InputGroup>
          <ClientInput
            apptBook
            navigate={this.props.navigation.navigate}
            label={selectedClient === null ? 'Select Client' : 'Client'}
            headerProps={{
              title: 'Clients',
              leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
              leftButtonOnPress: (navigation) => {
                navigation.goBack();
              },
            }}
            selectedClient={selectedClient}
            onChange={this.handleSelectClient}
            extraComponents={selectedClient !== null && this.renderExtraClientButtons(isDisabled)}
          />
          <InputDivider />
          <ValidatableInput
            label="Email"
            value={clientEmail}
            regex={this.isValidEmailRegExp}
            onValidated={this.onValidateEmail}
            onChangeText={email => this.setState({ clientEmail: email }, this.shouldUpdateClientInfo)}
          />
          <InputDivider />
          <ValidatableInput
            label="Phone"
            regex={this.isValidPhoneNumberRegExp}
            value={clientPhone}
            onValidated={this.onValidatePhone}
            onChangeText={phone => this.setState({ clientPhone: phone }, this.shouldUpdateClientInfo)}
          />
        </InputGroup>
        <SectionTitle value="Service" />
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            apptBook
            noPlaceholder
            selectedProvider={selectedProvider}
            navigate={this.props.navigation.navigate}
            selectedService={selectedService}
            onChange={this.handleSelectService}
            headerProps={{ title: 'Services', ...this.cancelButton() }}
          />
          <InputDivider />
          <ProviderInput
            apptBook
            filterByService
            filterList={this.props.apptBookState.providers}
            noPlaceholder
            navigate={this.props.navigation.navigate}
            selectedProvider={selectedProvider}
            onChange={this.handleSelectProvider}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
          />
          <InputDivider />
          <InputSwitch
            text="Provider is requested"
            value={requested}
            onChange={this.handleRequested}
          />
          <InputDivider />
          <LabeledTextInput
            label="Price"
            value={`$ ${price}`}
            keyboardType="numeric"
            onChangeText={this.setPrice}
          />
        </InputGroup>
        <SectionTitle value="Time" />
        <InputGroup>
          <SalonTimePicker
            label="Start"
            value={startTime}
            isOpen={this.state.startTimePickerOpen}
            onChange={this.handleChangeStartTime}
            toggle={this.toggleStartTimePicker}
          />
          <InputDivider />
          <SalonTimePicker
            label="Ends"
            value={endTime}
            isOpen={this.state.endTimePickerOpen}
            onChange={this.handleChangeEndTime}
            toggle={this.toggleEndTimePicker}
          />
          <InputDivider />
          <InputLabel
            label="Length"
            value={(
              <Text style={{
                fontSize: 14,
                lineHeight: 18,
                color: '#727A8F',
              }}
              >{`${moment.duration(length).asMinutes()} min`}
              </Text>
            )}
          />
          <InputDivider />
          <InputSwitch
            text="Gap"
            value={bookBetween}
            onChange={bookBetween => this.setState({ bookBetween: !bookBetween })}
          />
          {bookBetween && (
            <View>
              <InputDivider />
              <InputNumber
                value={gapTime}
                onChange={(action, gapTime) => this.setState({ gapTime })}
                step={15} // TODO should be apptgrid step
                label="Gap Time"
                singularText="min"
                pluralText="min"
              />
              <InputDivider />
              <InputNumber
                value={afterTime}
                onChange={(action, afterTime) => this.setState({ afterTime })}
                label="After"
                step={15}
                singularText="min"
                pluralText="min"
              />
            </View>
          )}
        </InputGroup>
        <SectionTitle value="Room & Resource" />
        <InputGroup>
          <InputButton
            onPress={() => {
              this.props.navigation.navigate('SelectRoom', {
                onSelect: selectedRoom => this.setState({ room: selectedRoom }),
              });
            }}
            label="Assigned Room"
            value={room ? room.name : 'None'}
          />
          <InputDivider />
          <InputButton
            onPress={() => {
              this.props.navigation.navigate('SelectResource', {
                onSelect: selectedResource => this.setState({ resource: selectedResource }),
              });
            }}
            label="Assigned Resource"
            value={resource ? resource.name : 'None'}
          />
        </InputGroup>
        <InputGroup style={{
          marginVertical: 30,
          paddingVertical: 10,
        }}
        >
          <LabeledTextarea
            label="Remarks"
            placeholder="Please specify"
            onChangeText={this.onChangeRemarks}
          />
        </InputGroup>
        <RemoveButton title="Cancel Appointment" onPress={this.cancelApptModal} />
      </ScrollView>
    );
  }
}
