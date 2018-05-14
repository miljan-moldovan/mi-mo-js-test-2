import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import moment from 'moment';
import { Picker, DatePicker } from 'react-native-wheel-datepicker';

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
} from '../../components/formHelpers';
import {
  AddButton,
} from '../appointmentDetailsScreen/components/appointmentDetails/AppointmentDetails';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonCard from '../../components/SalonCard';
import SalonAvatar from '../../components/SalonAvatar';
import Icon from '../../components/UI/Icon';
import apiWrapper from '../../utilities/apiWrapper';

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


const caretRight = (
  <FontAwesome style={styles.timeCaretIcon}>{Icons.angleRight}</FontAwesome>
);

const Guest = props => (
  <SalonCard
    bodyChildren={(
      <ClientInput
        style={{ flex: 1 }}
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
    paddingBottom: 0,
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
  const employeePhoto = apiWrapper.getEmployeePhoto(!data.employee.isFirstAvailable ? data.employee.id : 0);
  return (
    <SalonCard
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
              defaultComponent={<DefaultAvatar provider={data.employee} />}
            />
            <Text style={{
              fontSize: 14,
              lineHeight: 22,
              color: '#2F3142',
            }}
            >{data.employee.isFirstAvailable ? 'First Available' : data.employee.fullName}
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
                name="trash"
                size={12}
                color="#D1242A"
                type="regular"
              />
            </SalonTouchableOpacity>
          </View>
        </View>
      }
    />
  );
};

export default class NewAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if (params !== undefined) {
      if ('redirect' in params && params.redirect) {
        navigation.navigate('SalonCalendar');
      }
    }

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
          onPress={() => navigation.state.params.handleSave()}
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

    this.props.navigation.setParams({ handleSave: this.handleSave });
    this.state = {
      isRecurring: false,
      recurringPickerOpen: false,
      recurringNumber: 1,
      recurringType: 'Weeks',
      guests: [],
      guestServices: [],
      selectedClient: null,
      selectedProvider: null,
      mainServices: [],
    };
  }


  addMainService = () => {
    const { mainServices } = this.state;
    mainServices.push('service');
    this.setState({ mainServices });
  }

  addGuestService = (guestIndex) => {
    const { guestServices } = this.state;
    guestServices.push('service');
    this.setState({ guestServices });
  }

  deleteMainService = (serviceIndex) => {
    const { mainServices } = this.state;
    mainServices.splice(0, 1);
    this.setState({ mainServices });
  }

  deleteGuestService = (guestIndex, serviceIndex) => {
    const newGuests = this.state.guests;
    const newGuest = newGuests[guestIndex];

    newGuest.services.splice(serviceIndex, 1);
    newGuests[guestIndex] = newGuest;

    this.setState({ guests: newGuests });
  }

  onPressGuest = () => alert('Not Implemented');

  onPressService = (service) => {
    this.props.navigation.navigate('ModifyApptService', { service });
  }

  onChangeRecurring = isRecurring => this.setState({ isRecurring: !isRecurring });

  onChangeProvider = (selectedProvider) => {
    this.setState({ selectedProvider });
  }

  onChangeClient = (selectedClient) => {
    this.setState({ selectedClient });
  }

  onChangeGuestNumber = (action, guestNumber) => {
    if (this.props.newAppointmentState.guests.length < guestNumber) {
      this.props.newAppointmentActions.addGuest();
    } else {
      this.props.newAppointmentActions.removeGuest();
    }
  }

  handleSave = () => {
    const callback = () => {
      this.props.navigation.goBack();
    };
    this.props.navigation.setParams({ redirect: true });
    this.props.newAppointmentActions.bookNewAppt();
  }

  render() {
    const {
      employee,
      service,
      client,
      body,
      date,
      startTime,
      guests,
      totalDuration,
      totalPrice,
    } = this.props.newAppointmentState;
    const { params } = this.props.navigation.state;
    if (params !== undefined) {
      if ('redirect' in params && params.redirect) {
        return this.props.navigation.navigate('SalonCalendar');
      }
    }

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
            value={`${body.date.format('ddd, MM/DD/YYYY')}, ${startTime}`}
          />
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Client" />
        <InputGroup>
          <ClientInput
            navigate={this.props.navigation.navigate}
            selectedClient={client}
            onChange={this.props.newAppointmentActions.setNewApptClient}
            extraComponents={[
              <SalonTouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AppointmentFormulas');
                }}
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Icon
                  name="stickyNote"
                  size={20}
                  color="#115ECD"
                  type="light"
                />
              </SalonTouchableOpacity>,
              <SalonTouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AppointmentFormulas');
                }}
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Icon
                  name="infoCircle"
                  size={20}
                  color="#115ECD"
                  type="light"
                />
              </SalonTouchableOpacity>,
            ]}
          />
          <InputDivider />
          <InputLabel
            label="Email"
            value={client !== null ? client.email : ''}
          />
          <InputDivider />
          <InputLabel
            label="Phone"
            value={client !== null ? client.phones[0].value : ''}
          />
          <InputDivider />
          <InputNumber
            value={this.props.newAppointmentState.guests.length}
            onChange={this.onChangeGuestNumber}
            label="Multiple Guests"
            singularText="guest"
            pluralText="guests"
          />
        </InputGroup>
        <View>
          <SubTitle title={this.props.newAppointmentState.guests.length > 0 ? 'Main Client' : 'Services'} />
          {body.items.map((item, itemIndex) => (item.service !== null ? (
            <ServiceCard
              onPress={this.onPressService}
              onPressDelete={() => this.props.newAppointmentActions.removeNewApptItem(itemIndex)}
              key={Math.random().toString()}
              data={item}
            />
          ) : null))}
          <AddButton
            onPress={() => {
              if (client !== null) {
                return this.props.navigation.navigate('ModifyApptService', { client });
              }
                return alert('Select a client first');
            }}
            iconStyle={{ marginLeft: 10, marginRight: 6 }}
            title="Add service"
          />
        </View>
        <View>
          <SubTitle title={guestsLabel} />
          {
            this.props.newAppointmentState.guests.map((guest, guestIndex) => (
              <View>
                <Guest
                  index={guestIndex}
                  navigate={this.props.navigation.navigate}
                  selectedClient={guest.client}
                  onPress={this.onPressGuest}
                  onChange={selectedClient =>
                    this.props.newAppointmentActions.setGuestClient(guestIndex, selectedClient)
                  }
                />
                {
                  guest.services.map((item, serviceIndex) => (
                    <ServiceCard
                      data={item}
                      key={Math.random().toString()}
                      onPress={this.onPressService}
                      onPressDelete={() => this.props.newAppointmentActions.removeGuestService(guestIndex, serviceIndex)}
                    />
                  ))
                }
                <AddButton
                  onPress={() => {
                    if (guest.client !== null) {
                      return this.props.navigation.navigate('ModifyApptService', { guestIndex, client: guest.client });
                    }
                      return alert('Select a guest first');
                  }}
                  iconStyle={{ marginLeft: 10, marginRight: 6 }}
                  title="Add service"
                />
              </View>
            ))
          }
        </View>
        <InputGroup>
          <InputSwitch
            text="Recurring appt."
            value={this.state.isRecurring}
            onChange={this.onChangeRecurring}
          />
        </InputGroup>
        {this.state.isRecurring && (
          <View>
            <SubTitle title="Repeat Every" />
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
            }}
            >Event will occur every month on the same day each month
            </Text>
          </View>
      )}
        <View style={{ paddingVertical: 32, paddingHorizontal: 8 }}>
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
            onChangeText={this.props.newAppointmentActions.setNewApptRemarks}
          />
        </InputGroup>
      </ScrollView>
    );
  }
}
