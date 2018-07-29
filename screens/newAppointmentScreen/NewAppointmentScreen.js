import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import moment from 'moment';
import { Picker, DatePicker } from 'react-native-wheel-datepicker';
import uuid from 'uuid/v4';
import { last, get, flatten, isNil, sortBy, chain } from 'lodash';

import {
  DefaultAvatar,
  LabeledTextInput,
  InputGroup,
  InputText,
  InputLabel,
  SectionTitle,
  InputSwitch,
  InputDivider,
  ClientInput,
  InputNumber,
  InputButton,
} from '../../components/formHelpers';
import {
  AddButton,
} from '../appointmentDetailsScreen/components/appointmentDetails/AppointmentDetails';
import {
  ConflictBox,
} from '../../components/slidePanels/SalonNewAppointmentSlide';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonCard from '../../components/SalonCard';
import SalonAvatar from '../../components/SalonAvatar';
import Icon from '../../components/UI/Icon';
import { Store, Client, AppointmentBook } from '../../utilities/apiWrapper';
import { getEmployeePhoto } from '../../utilities/apiWrapper/api';

import ServiceCard from './components/ServiceCard';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
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

const RemoveGuest = ({ onPress }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 10 }}>
    <SalonTouchableOpacity
      style={{ flexDirection: 'row' }}
      onPress={onPress}
    >
      <Icon
        name="timesCircle"
        type="solid"
        color="red"
        size={10}
      />
      <Text style={{
        color: '#D1242A',
        marginLeft: 4,
        fontSize: 10,
        lineHeight: 12,
        fontFamily: 'Roboto-Bold',
      }}
      >REMOVE
      </Text>
    </SalonTouchableOpacity>
  </View>
);

const Guest = props => (
  <View style={{ flexDirecton: 'column' }}>
    <RemoveGuest onPress={() => props.onRemove()} />
    <SalonCard
      bodyStyles={{ paddingVertical: 0 }}
      bodyChildren={(
        <ClientInput
          style={{ flex: 1, height: 40, paddingRight: 0 }}
          label={false}
          apptBook
          placeholder="Select a Client"
          selectedClient={props.selectedClient}
          onChange={client => props.onChange(client)}
          iconStyle={{ color: '#115ECD' }}
          headerProps={{
            title: 'Clients',
            leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
            leftButtonOnPress: navigation => navigation.goBack(),
          }}
          {...props}
        />
      )}
      backgroundColor="white"
    />
  </View>
);


const SubTitle = props => (
  <View style={{
    height: 54,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  }}
  ><Text style={styles.subTitle}>{props.title.toUpperCase()}</Text>
  </View>
);

const LabeledTextarea = props => (
  <View style={{
    flex: 1,
    flexDirection: 'column',
  }}
  >
    <Text style={{
      fontSize: 14,
      lineHeight: 22,
      color: '#110A24',
      fontFamily: 'Roboto',
    }}
    >{props.label}
    </Text>
    <InputText onChangeText={props.onChangeText} placeholder={props.placeholder} />
  </View>
);

export default class NewAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params || {};
    const canSave = screenProps.isNewApptValid;
    return ({
      headerTitle: 'New Appointment',
      headerLeft: (
        <SalonTouchableOpacity
          onPress={() => { navigation.goBack(); }}
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
          onPress={() => (canSave ? params.handleSave() : null)}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: canSave ? 'white' : 'rgba(0,0,0,0.3)',
          }}
          >Done
          </Text>
        </SalonTouchableOpacity>
      ),
    });
  }

  constructor(props) {
    super(props);

    const {
      client,
    } = this.props.newAppointmentState;
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.getClientInfo(client);

    this.state = {
      isRecurring: false,
      canSave: false,
      clientEmail,
      clientPhone,
      clientPhoneType,
    };
  }

  componentDidMount() {
    this.checkConflicts();
  }

  addService = (selectedServices, guestId = false) => {
    const {
      client,
      startTime,
      bookedByEmployee,
    } = this.props.newAppointmentState;
    const {
      service,
      addons = [],
      recommended = [],
      required = null,
    } = selectedServices;
    const length = this.totalLength();
    const serviceLength = moment.duration(service.maxDuration);
    const fromTime = moment(startTime).add(length);
    const toTime = moment(fromTime).add(serviceLength);

    const newService = {
      service,
      length: serviceLength,
      client: guestId ? get(this.getGuest(guestId), 'client', null) : client,
      requested: true,
      employee: bookedByEmployee,
      fromTime,
      toTime,
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
    this.props.newAppointmentActions.addServiceItemExtras(
      newServiceItem.itemId, // parentId
      'addon', // extraService type
      addons,
    );
    this.props.newAppointmentActions.addServiceItemExtras(
      newServiceItem.itemId, // parentId
      'recommended', // extraService type
      recommended,
    );
    this.props.newAppointmentActions.addServiceItemExtras(
      newServiceItem.itemId, // parentId
      'required', // extraService type
      required,
    );

    return this.checkConflicts();
  }

  updateContactInformation = () => {
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.state;
    const { client } = this.props.newAppointmentState;
    Client.putContactInformation(
      client.id,
      {
        id: client.id,
        email: clientEmail || null,
        phones: [
          {
            type: clientPhoneType,
            value: clientPhone,
          },
          ...client.phones.filter(phone => phone.value && phone.type !== clientPhoneType),
        ],
        confirmationType: 1,
      },
    )
      .then((res) => {

      })
      .catch(err => console.warn(err));
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
      onRemoveService: () => this.removeService(serviceId),
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
    const clientPhone = phones.reduce((phone, currentPhone) => (currentPhone.value ? currentPhone.value : phone), '');
    return {
      clientPhone,
      clientEmail: get(client, 'email', ''),
      clientPhoneType: clientPhone !== '' ? phones.findIndex(phone => phone.value === clientPhone) : 0,
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

  getMainServices = () => this.props.newAppointmentState.serviceItems.filter(item => !item.guestId && !item.parentId)

  getAddonsForService = serviceId => this.props.newAppointmentState.serviceItems.filter(item => item.parentId === serviceId)

  updateService = (serviceId, updatedService, guestId = false) => {
    this.props.newAppointmentActions.updateServiceItem(serviceId, updatedService, guestId);
    this.checkConflicts();
  }

  removeService = (serviceId) => {
    this.props.newAppointmentActions.removeServiceItem(serviceId);
    this.checkConflicts();
  }


  onChangeRecurring = isRecurring => isRecurring // this.setState({ isRecurring: !isRecurring });

  onChangeProvider = (employee) => {
    this.setState({ employee }, this.checkConflicts);
  }

  onChangeClient = (client) => {
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.getClientInfo(client);
    this.props.formulaActions.getFormulasAndNotes(client.id);
    this.props.newAppointmentActions.setClient(client);
    this.setState({
      clientEmail, clientPhone, clientPhoneType,
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
    const { client, bookedByEmployee } = this.props.newAppointmentState;
    if (client !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        selectExtraServices: true,
        filterByProvider: true,
        clientId: client.id,
        employeeId: bookedByEmployee.id,
        onChangeService: this.addService,
      });
    }
    return alert('Select a client first');
  }

  changeDateTime = () => this.props.navigation.navigate('ChangeNewApptDateTime')

  checkConflicts = () => this.props.newAppointmentActions.getConflicts(() => this.validate())

  handleAddGuestService = (guestId) => {
    const { bookedByEmployee } = this.props.newAppointmentState;
    const guest = this.getGuest(guestId);
    const { client = null } = guest;
    if (client !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        selectExtraServices: true,
        filterByProvider: true,
        clientId: get(client, 'id', null),
        employeeId: bookedByEmployee.id,
        onChangeService: service => this.addService(service, guestId),
      });
    }

    return alert('Select a guest first');
  }

  handleSave = () => {
    if (this.props.isValidAppointment) {
      const {
        date,
        client,
        bookedByEmployee,
        remarks,
        serviceItems,
      } = this.props.newAppointmentState;
      const successCallback = () => {
        this.props.navigation.navigate('SalonCalendar');
        // this.props.newAppointmentActions.cleanForm();
        this.props.apptBookActions.setGridView();
      };
      const errorCallback = () => {
        this.checkConflicts();
      };
      this.updateContactInformation();
      this.props.newAppointmentActions.quickBookAppt(successCallback, errorCallback);
    }
  }

  validate = () => {
    const canSave = this.props.isValidAppointment;
    this.props.navigation.setParams({ canSave });
  }

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
        this.props.navigation.navigate('ClientNotes', { client: this.props.newAppointmentState.client });
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
        // TODO
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
    const {
      isLoading,
      isBooking,
      date,
      client,
      bookedByEmployee: employee,
      startTime,
      conflicts,
      guests,
    } = this.props.newAppointmentState;
    const {
      clientEmail,
      clientPhone,
    } = this.state;
    const totalPrice = this.totalPrice();
    const totalDuration = this.totalLength();
    // const isFormulas = this.props.settingState.data.PrintToTicket === 'Formulas';
    const isDisabled = this.props.formulasAndNotesState.notes.length < 1;
    const displayDuration = moment.duration(totalDuration).asMilliseconds() === 0 ? '0 min' : `${moment.duration(totalDuration).asMinutes()} min`;
    const guestsLabel = guests.length === 0 || guests.length > 1 ? `${guests.length} Guests` : `${guests.length} Guest`;
    return (
      <View style={styles.container}>
        {(isLoading || isBooking) ? (
          <View style={{
            position: 'absolute',
            top: 0,
            paddingBottom: 60,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#cccccc',
            opacity: 0.3,
            zIndex: 999,
            elevation: 2,
          }}
          ><ActivityIndicator />
          </View>
        ) : null}
        <ScrollView style={styles.container}>
          <InputGroup style={{ marginTop: 15 }}>
            <InputLabel
              label="Booked by"
              value={(
                <Text style={{
                  fontSize: 14,
                  lineHeight: 18,
                  color: '#727A8F',
                }}
                >{`${employee.name} ${employee.lastName}`}
                </Text>
              )}
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
            <LabeledTextInput
              label="Email"
              value={clientEmail}
              onChangeText={clientEmail => this.setState({ clientEmail })}
            />
            <InputDivider />
            <LabeledTextInput
              label="Phone"
              value={clientPhone}
              onChangeText={clientPhone => this.setState({ clientPhone })}
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
            <SubTitle title={guests.length > 0 ? 'Main Client' : 'Services'} />
            {conflicts.length > 0 && (
              <ConflictBox
                style={{
                  marginHorizontal: 10,
                  marginVertical: 10,
                }}
                onPress={() => this.props.navigation.navigate('Conflicts', {
                  date,
                  conflicts,
                  startTime,
                  endTime: moment(startTime).add(moment.duration(totalDuration)),
                })}
              />
            )}
            {this.getMainServices().map((item, itemIndex) => [
              (
                <ServiceCard
                  onPress={() => this.onPressService(item.itemId)}
                  onPressDelete={() => this.removeService(item.itemId)}
                  key={item.itemId}
                  addons={this.getAddonsForService(item.itemId)}
                  data={item.service}
                />
              ),
              this.getAddonsForService(item.itemId).map(addon => (
                <ServiceCard
                  key={addon.itemId}
                  data={addon.service}
                  isAddon
                  isRequired={addon.isRequired}
                  hasConflicts={conflicts.length > 0}
                  onPress={() => this.onPressService(addon.itemId)}
                  onPressDelete={() => this.removeService(addon.itemId)}
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
              <SubTitle title={guestsLabel} />
              {
                guests.map((guest, guestIndex) => (
                  <View>
                    <Guest
                      index={guest.guestId}
                      navigate={this.props.navigation.navigate}
                      selectedClient={guest.client || null}
                      onRemove={() => this.removeGuest(guest.guestId)}
                      onChange={selectedClient => this.setGuest(selectedClient, guest.guestId)}
                    />
                    {
                      this.getGuestServices(guest.guestId).map(item => ([
                        (
                          <ServiceCard
                            hasConflicts={conflicts.length > 0}
                            onPress={() => this.onPressService(item.itemId, guest.guestId)}
                            onPressDelete={() => this.removeService(item.itemId)}
                            key={item.itemId}
                            addons={this.getAddonsForService(item.itemId)}
                            data={item.service}
                          />
                        ),
                        this.getAddonsForService(item.itemId).map(addon => (
                          <ServiceCard
                            key={addon.itemId}
                            data={addon.service}
                            isAddon
                            isRequired={addon.isRequired}
                            hasConflicts={conflicts.length > 0}
                            onPress={() => this.onPressService(addon.itemId, guest.guestId)}
                            onPressDelete={() => this.removeService(addon.itemId)}
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
                  onChange={() => alert('API not implemented')}
                />
              </InputGroup>
              <SectionTitle style={{ marginTop: 0, paddingBottom: 12, height: 26 }} value="Repeat Every" />
              <InputGroup>
                <InputButton
                  label="Repeats every"
                  value={`${this.state.recurringNumber} ${this.state.recurringType}`}
                  onPress={() => this.setState({ recurringPickerOpen: !this.state.recurringPickerOpen })}
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
              placeholder="Please specify"
              onChangeText={this.onChangeRemarks}
            />
          </InputGroup>
        </ScrollView>
      </View>
    );
  }
}
