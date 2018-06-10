import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Alert,
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
  ServiceInput,
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

export default class ModifyAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if (params !== undefined) {
      if ('redirect' in params && params.redirect) {
        navigation.navigate('SalonCalendar');
      }
    }

    return ({
      headerTitle: 'Modify Appointment',
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
    const { appointment } = this.props.state;
    this.state = {
      remarks: appointment.remarks ? appointment.remarks : '',
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
    // if (this.props.newAppointmentState.guests.length < guestNumber) {
    //   this.props.newAppointmentActions.addGuest();
    // } else {
    //   this.props.newAppointmentActions.removeGuest();
    // }
  }

  handleSave = () => {
    Alert.alert(
      'Apppointment Saved',
      'Saving the appointment is yet to be implemented',
      [
        { text: 'OK', onPress: () => this.props.navigation.goBack() },
      ],
    );
  }

  renderExtraClientButtons = () => [
    <SalonTouchableOpacity
      onPress={() => {
        this.props.navigation.navigate('AppointmentFormulas');
      }}
      style={{
        marginHorizontal: 5,
      }}
    >
      <Icon
        name="fileAlt"
        size={20}
        color="#115ECD"
        type="regular"
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
        type="regular"
      />
    </SalonTouchableOpacity>,
  ];

  render() {
    const { appointment } = this.props.state;
    if (appointment === null) {
      return this.props.navigation.navigate('SalonCalendar');
    }
    const {
      employee,
      service,
      client,
    } = appointment;

    const startTime = moment(appointment.fromTime, 'HH:mm');
    const startTimeText = startTime.format('HH:mm A');
    const endTime = moment(appointment.toTime, 'HH:mm');
    const endTimeText = moment(appointment.toTime, 'HH:mm').format('HH:mm A');
    const duration = startTime.diff(endTime);
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
            value={`${moment(appointment.date).format('ddd, MM/DD/YYYY')}, ${startTimeText}`}
          />
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Client" />
        <InputGroup>
          <ClientInput
            navigate={this.props.navigation.navigate}
            selectedClient={client}
            onChange={newClient => alert(`newClient selected ${newClient.name}`)}
            extraComponents={client !== null ? this.renderExtraClientButtons : []}
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
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Service" />
        <InputGroup>
          <ServiceInput
            selectedService={service}
            navigate={this.props.navigation.navigate}
            onChange={newService => alert(`Selected new service ${newService}`)}
          />
          <ProviderInput
            label="Provider"
            navigate={this.props.navigation.navigate}
            selectedProvider={employee}
            avatarSize={20}
            onChange={provider => alert(`Selected provider ${provider.name}`)}
          />
          <InputSwitch
            text="Provider is Requested?"
            value={appointment.requested}
            onChange={() => {}}
          />
          <InputLabel
            label="Price"
            value={`$${service.price}`}
          />
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Time" />
        <InputGroup>
          <InputLabel
            label="Starts"
            value={startTimeText}
          />
          <InputLabel
            label="Ends"
            value={endTimeText}
          />
          <InputLabel
            label="Duration"
            value={`${moment.duration(duration).asMinutes()} min`}
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
            value={this.state.remarks}
            onChangeText={text => this.setState({ remarks: text })}
          />
        </InputGroup>
      </ScrollView>
    );
  }
}
