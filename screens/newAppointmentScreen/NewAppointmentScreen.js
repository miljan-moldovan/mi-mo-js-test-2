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
import apiWrapper from '../../utilities/apiWrapper';

const styles = StyleSheet.create({
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


const caretRight = (
  <FontAwesome style={styles.timeCaretIcon}>{Icons.angleRight}</FontAwesome>
);

const Guest = props => (
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
);

const ServiceInfo = props => (
  <Text style={styles.serviceInfo}>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>{props.waitTime}</Text>
    <Text style={{ fontSize: 13 }}>  |  </Text>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>$ {props.price}</Text>
  </Text>
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

const SalonAppointmentTime = props => (
  <View style={[styles.serviceTimeContainer, { alignItems: 'center' }]}>
    <Icon
      size={12}
      color="#727A8F"
      name="clockO"
      type="light"
      style={{ marginRight: 5 }}
    />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.serviceTime}>{props.from}</Text>
      <Icon
        name="longArrowRight"
        size={11}
        color="#727A8F"
        type="light"
        style={{ marginHorizontal: 5 }}
      />
      <Text style={styles.serviceTime}>{props.to}</Text>
    </View>
  </View>
);

const ServiceCard = ({ data, ...props }) => {
  const employee = data.employee || null;
  const isFirstAvailable = data.isFirstAvailable || false;
  const employeePhoto = apiWrapper.getEmployeePhoto(isFirstAvailable ? 0 : employee.id);
  return ([
    <SalonCard
      containerStyles={{ marginVertical: 0, marginBottom: 10 }}
      bodyStyles={{ paddingTop: 7, paddingBottom: 13 }}
      backgroundColor="white"
      bodyChildren={
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <SalonTouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={props.onPress}
          >
            <Text style={styles.serviceTitle}>{data.service.name}</Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
            >
              <ServiceInfo price={data.service.price} waitTime={`${moment.duration(data.service.maxDuration).asMinutes()}min`} />
              <FontAwesome style={{
                color: '#115ECD',
                fontSize: 20,
                marginLeft: 15,
              }}
              >{Icons.angleRight}
              </FontAwesome>
            </View>
          </SalonTouchableOpacity>
          <View style={{
            flexDirection: 'row', marginTop: 5, alignItems: 'center', justifyContent: 'flex-start',
          }}
          >
            <SalonAvatar
              wrapperStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
              width={26}
              borderWidth={1}
              borderColor="transparent"
              hasBadge={data.requested}
              badgeComponent={
                <FontAwesome style={{
                  color: '#1DBF12', fontSize: 10,
                }}
                >{Icons.lock}
                </FontAwesome>
              }
              image={{ uri: employeePhoto }}
              defaultComponent={<ActivityIndicator />}
            />
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: '#2F3142',
              }}
            >{isFirstAvailable ? 'First Available' : `${employee.name} ${employee.lastName}`}
            </Text>
          </View>
          <View style={{
              height: 1, alignSelf: 'stretch', backgroundColor: '#E0EAF7', marginVertical: 7,
            }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SalonAppointmentTime
              from={moment(data.fromTime, 'HH:mm').format('HH:mm A')}
              to={moment(data.toTime, 'HH:mm').format('HH:mm A')}
            />
            <SalonTouchableOpacity onPress={props.onPressDelete}>
              <Icon
                name="trashAlt"
                size={12}
                color="#D1242A"
                type="regular"
              />
            </SalonTouchableOpacity>
          </View>
        </View>
      }
    />,
    props.hasConflicts ? (<ConflictBox
      style={{
        marginHorizontal: 10,
        marginVertical: 3,
      }}
      onPress={() => alert('conflicts')}
    />) : null,
  ]);
};

export default class NewAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation, ...props }) => {
    const { params } = navigation.state;
    const canSave = params ? params.canSave : false;

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
          onPress={() => (canSave ? navigation.state.params.handleSave() : null)}
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

    this.props.navigation.setParams({ canSave: false, handleSave: this.handleSave });
    const params = this.props.navigation.state.params || {};
    const newAppt = params.newAppt || {};
    const serviceItems = [];
    if (
      newAppt.client !== null &&
      newAppt.service !== null &&
      newAppt.bookedByEmployee !== null
    ) {
      serviceItems.push({
        itemId: uuid(),
        guestId: false,
        service: {
          employee: newAppt.bookedByEmployee,
          service: newAppt.service,
          client: newAppt.client,
          fromTime: newAppt.fromTime,
          toTime: newAppt.toTime,
          requested: newAppt.requested,
        },
      });
    }

    this.state = {
      isRecurring: false,
      isLoading: false,
      canSave: false,
      date: get(newAppt, 'date', moment()),
      bookedByEmployee: get(newAppt, 'bookedByEmployee', null),
      client: get(newAppt, 'client', null),
      startTime: get(newAppt, 'fromTime', moment().startOf('day').add(7 * 60, 'min')),
      endTime: get(newAppt, 'toTime', moment().startOf('day').add((7 * 60) + 15, 'min')),
      serviceItems,
      guests: [],
      conflicts: [],
      recurringPickerOpen: false,
      recurringNumber: 1,
      recurringType: 'Weeks',
      // startTime,
      // endTime,
      totalPrice: 0,
      totalDuration: 0,
      clientEmail: '',
      clientPhone: '',
    };
  }

  componentDidMount() {
    this.calculateTotals();
  }

  deleteMainService = (serviceIndex) => {
    const { serviceItems } = this.state;
    serviceItems.splice(serviceIndex, 1);
    this.setState({ serviceItems });
  }

  deleteGuestService = (guestIndex, serviceIndex) => {
    const newGuests = this.state.guests;
    const newGuest = newGuests[guestIndex];

    newGuest.services.splice(serviceIndex, 1);
    newGuests[guestIndex] = newGuest;

    this.setState({ guests: newGuests });
  }

  addService = (service, guestId = false) => {
    const {
      client,
      startTime,
      serviceItems,
      totalDuration,
      bookedByEmployee,
    } = this.state;
    const fromTime = moment(startTime).add(moment.duration(totalDuration));
    const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
    const newServiceItem = {
      service,
      client: guestId ? get(this.getGuest(guestId), 'client', null) : client,
      requested: true,
      employee: bookedByEmployee,
      fromTime,
      toTime,
    };

    serviceItems.push({
      itemId: uuid(),
      guestId,
      service: newServiceItem,
    });
    this.setState({ serviceItems }, this.validate);
  }

  onPressService = (serviceId, guestId = false) => {
    this.props.navigation.navigate('ModifyApptService', {
      guestId,
      client: guestId ? get(this.getGuest(guestId), 'client', null) : this.state.client,
      date: this.state.date,
      serviceItem: this.getServiceItem(serviceId),
      onSaveService: service => this.updateService(serviceId, service, guestId),
      onRemoveService: () => this.removeService(serviceId),
    });
  }

  updateService = (itemId, updatedService, guestId = false) => {
    const serviceIndex = this.state.serviceItems.findIndex(item => item.itemId === itemId);
    const newServiceItems = this.state.serviceItems;
    const serviceItem = {
      guestId,
      itemId,
      service: updatedService,
    };
    newServiceItems.splice(serviceIndex, 1, serviceItem);
    this.setState({ serviceItems: newServiceItems }, this.validate);
  }

  removeService = (serviceId) => {
    const serviceIndex = this.state.serviceItems.findIndex(item => item.itemId === serviceId);
    const newServiceItems = this.state.serviceItems;
    newServiceItems.splice(serviceIndex, 1);
    this.setState({ serviceItems: newServiceItems }, this.validate);
  }

  setGuest = (client, guestId) => {
    const newGuests = this.state.guests;
    const guestIndex = newGuests.findIndex(item => item.guestId === guestId);
    newGuests[guestIndex].client = client;
    this.setState({ guests: newGuests }, this.validate);
  }

  getGuestServices = guestId => this.state.serviceItems.filter(item => item.guestId === guestId)

  getGuest = guestId => this.state.guests.find(item => item.guestId === guestId)

  getServiceItem = serviceId => this.state.serviceItems.find(item => item.itemId === serviceId)

  onChangeRecurring = isRecurring => this.setState({ isRecurring: !isRecurring });

  onChangeProvider = (employee) => {
    this.setState({ employee }, this.validate);
  }

  onChangeClient = (client) => {
    this.setState({ client }, this.validate);
  }

  onChangeRemarks = remarks => this.setState({ remarks })

  onChangeGuestNumber = (action, guestNumber) => {
    const newGuests = this.state.guests;
    if (this.state.guests.length < guestNumber) {
      newGuests.push({
        guestId: uuid(),
        client: null,
      });
    } else {
      newGuests.pop();
    }
    this.setState({ guests: newGuests }, this.validate);
  }

  handleAddMainService = () => {
    const { client, bookedByEmployee } = this.state;
    if (client !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        filterByProvider: true,
        employeeId: bookedByEmployee.id,
        onChangeService: this.addService,
      });
    }
    return alert('Select a client first');
  }

  getMainServices = () => this.state.serviceItems.filter(item => !item.guestId)

  checkConflicts = () => {
    const {
      date,
      client,
      bookedByEmployee,
      serviceItems,
      guests,
    } = this.state;

    let servicesToCheck = [];

    this.setState({
      conflicts: [],
    });

    if (!client || !bookedByEmployee) {
      return;
    }

    servicesToCheck = serviceItems.filter(serviceItem => serviceItem.service.service &&
        serviceItem.service.employee &&
        serviceItem.service.employee.id !== null &&
        (serviceItem.guestId ? serviceItem.service.client : true));

    if (!servicesToCheck.length) {
      return;
    }

    const conflictData = {
      date: date.format('YYYY-MM-DD'),
      clientId: client.id,
      items: [],
    };
    servicesToCheck.forEach((serviceItem) => {
      if (
        serviceItem.service &&
        serviceItem.service.employee &&
        serviceItem.service.employee.id === 0
      ) {
        return;
      }

      conflictData.items.push({
        appointmentId: serviceItem.service.id ? serviceItem.service.id : null,
        clientId: serviceItem.guestId ? serviceItem.service.client.id : client.id,
        serviceId: serviceItem.service.service.id,
        employeeId: serviceItem.service.employee.id,
        fromTime: serviceItem.service.fromTime.format('HH:mm:ss', { trim: false }),
        toTime: serviceItem.service.toTime.format('HH:mm:ss', { trim: false }),
        gapTime: moment().startOf('day').add(moment.duration(+serviceItem.service.gapTime, 'm')).format('HH:mm:ss', { trim: false }),
        afterTime: moment().startOf('day').add(moment.duration(+serviceItem.service.afterTime, 'm')).format('HH:mm:ss', { trim: false }),
        bookBetween: !!serviceItem.service.gapTime,
        roomId: get(serviceItem.service, 'roomId', null),
        roomOrdinal: get(serviceItem.service, 'roomOrdinal', null),
        resourceId: get(serviceItem.service, 'resourceId', null),
        resourceOrdinal: get(serviceItem.service, 'resourceOrdinal', null),
      });
    });

    apiWrapper.doRequest('checkConflicts', {
      body: conflictData,
    })
      .then((conflicts) => this.setState({ conflicts }));
  }

  handleAddGuestService = (guestId) => {
    const { bookedByEmployee } = this.state;
    if (guestId !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        filterByProvider: true,
        employeeId: bookedByEmployee.id,
        onChangeService: service => this.addService(service, guestId),
      });
    }
    return alert('Select a guest first');
  }

  handleSave = () => {
    if (this.state.canSave) {
      const {
        date,
        client,
        bookedByEmployee,
        remarks,
        serviceItems,
      } = this.state;
      const callback = () => {
        this.props.apptBookActions.setGridView();
        this.props.navigation.navigate('SalonCalendar');
      };
      // this.props.navigation.setParams({ redirect: true });
      this.props.newAppointmentActions.bookNewAppt({
        date,
        client,
        bookedByEmployee,
        remarks,
        rebooked: false,
        items: serviceItems.map(item => ({ isGuest: item.guestId, ...item.service })),
      }, callback);
    }
  }

  calculateTotals = () => {
    const {
      startTime,
      serviceItems,
    } = this.state;

    this.setState({
      totalDuration: this.totalLength(),
      totalPrice: this.totalPrice(),
    });
  }

  validate = () => {
    const {
      date,
      bookedByEmployee,
      client,
      serviceItems,
      conflicts,
    } = this.state;

    let valid = false;
    if (
      date &&
      bookedByEmployee !== null &&
      client !== null &&
      serviceItems.length &&
      !conflicts.length
    ) {
      valid = true;
    }
    this.props.navigation.setParams({ canSave: valid });
    this.setState({ canSave: valid }, () => {
      this.checkConflicts();
      this.calculateTotals();
    });
  }

  totalPrice = () => this.state.serviceItems.reduce((currentPrice, serviceItem) => {
    const servicePrice = serviceItem.service.service.price;
    return currentPrice + servicePrice;
  }, 0)

  totalLength = () => this.state.serviceItems.reduce((currentLength, serviceItem) => {
    const serviceLength = moment.duration(serviceItem.service.service.maxDuration);
    return currentLength.add(serviceLength);
  }, moment.duration(0))

  resetTimeForServices = (items, index, initialFromTime) => {
    items.forEach((item, i) => {
      if (i > index) {
        const prevItem = items[i - 1];
        item.service.fromTime = prevItem && prevItem.service.toTime.clone() || initialFromTime;
        item.service.toTime = item.service.fromTime.clone().add(item.service.maxDuration);
      }
    });
  }

  renderExtraClientButtons = () => ([
    <SalonTouchableOpacity
      key={Math.random().toString()}
      onPress={() => {
        this.props.navigation.navigate('ClientNotes', { client: this.state.client });
      }}
      style={{
        marginHorizontal: 5,
      }}
    >
      <Icon
        name="fileText"
        size={20}
        color="#115ECD"
        type="regular"
      />
    </SalonTouchableOpacity>,
    <SalonTouchableOpacity
      key={Math.random().toString()}
      onPress={() => {
        debugger
        this.props.navigation.navigate('ClientNotes', { client: this.state.client });
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
      date,
      client,
      bookedByEmployee: employee,
      startTime,
      conflicts,
      guests,
      totalPrice,
      totalDuration,
      clientEmail,
      clientPhone,
      isLoading,
    } = this.state;
    const displayDuration = moment.duration(totalDuration).asMilliseconds() === 0 ? '0 min' : `${moment.duration(totalDuration).asMinutes()} min`;
    const guestsLabel = guests.length === 0 || guests.length > 1 ? `${guests.length} Guests` : `${guests.length} Guest`;
    return (
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
          <InputLabel
            label="Date"
            value={`${date.format('ddd, MM/DD/YYYY')}, ${startTime.format('HH:mm A')}`}
          />
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Client" />
        <InputGroup>
          <ClientInput
            navigate={this.props.navigation.navigate}
            apptBook
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
            extraComponents={client !== null && this.renderExtraClientButtons()}
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
            value={this.state.guests.length}
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
                marginVertical: 3,
              }}
              onPress={() => this.props.navigation.navigate('Conflicts', {
                date,
                conflicts,
                startTime,
                endTime: moment(startTime).add(moment.duration(totalDuration)),
              })}
            />
          )}
          {this.getMainServices().map((item, itemIndex) => (
            <ServiceCard
              onPress={() => this.onPressService(item.itemId)}
              onPressDelete={() => this.deleteMainService(itemIndex)}
              key={item.itemId}
              data={item.service}
            />
          ))}
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
        {this.state.guests.length > 0 && (
          <View>
            <SubTitle title={guestsLabel} />
            {
              this.state.guests.map((guest, guestIndex) => (
                <View>
                  <Guest
                    index={guestIndex}
                    navigate={this.props.navigation.navigate}
                    selectedClient={guest.client || null}
                    onChange={selectedClient => this.setGuest(selectedClient, guest.guestId)}
                  />
                  {
                    this.getGuestServices(guest.guestId).map(item => (
                      <ServiceCard
                        key={item.itemId}
                        data={item.service}
                        onPress={() => this.onPressService(item.itemId, guest.guestId)}
                        onPressDelete={() => this.removeService(item.itemId)}
                      />
                    ))
                  }
                  <AddButton
                    style={{ marginVertical: 5 }}
                    onPress={() => this.handleAddGuestService(guest.guestId)}
                    iconStyle={{ marginLeft: 10, marginRight: 6 }}
                    title="Add service"
                  />
                </View>
              ))
            }
          </View>
        )}
        <InputGroup style={{ marginVertical: 20 }}>
          <InputSwitch
            text="Recurring appt."
            value={this.state.isRecurring}
            onChange={this.onChangeRecurring}
          />
        </InputGroup>
        {this.state.isRecurring && (
          <View>
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
    );
  }
}
