import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import {
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
} from '../../components/formHelpers';
import {
  AddButton,
} from '../appointmentDetailsScreen/components/appointmentDetails/AppointmentDetails';

import SalonCard from '../../components/SalonCard';
import SalonAvatar from '../../components/SalonAvatar';
import Icon from '../../components/UI/Icon';

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
  <TouchableOpacity onPress={props.onPress}>
    <SalonCard
      bodyChildren={(
        <View style={styles.guestContainer}>
          <Text style={{
              flex: 1,
              fontSize: 14,
              lineHeight: 22,
              color: 'black',
              fontFamily: 'Roboto-Medium',
            }}
          >Lauren Chapman
          </Text>
          <FontAwesome style={{
            color: '#115ECD',
            fontSize: 20,
            marginLeft: 12,
          }}
          >{Icons.angleRight}
          </FontAwesome>
        </View>
      )}
      backgroundColor="white"
    />
  </TouchableOpacity>
);

const ServiceInfo = props => (
  <Text style={styles.serviceInfo}>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>{props.waitTime}</Text>
    <Text style={{ fontSize: 10 }}> min</Text>
    <Text style={{ fontSize: 13 }}>  |  </Text>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>${props.price}</Text>
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
    <InputText placeholder={props.placeholder} />
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
      <Text style={styles.serviceTime}>11:00 am</Text>
      <Icon
        name="longArrowRight"
        size={11}
        color="#727A8F"
        type="light"
        style={{ marginHorizontal: 5 }}
      />
      <Text style={styles.serviceTime}>12:00 pm</Text>
    </View>
  </View>
);

const ServiceCard = ({ data, ...props }) => (
  <SalonCard
    bodyStyles={{ paddingTop: 7, paddingBottom: 13 }}
    backgroundColor="white"
    bodyChildren={
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={props.onPress}
        >
          <Text style={styles.serviceTitle}>Corrective Color</Text>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
          >
            <ServiceInfo price={40} waitTime={60} />
            <FontAwesome style={{
              color: '#115ECD',
              fontSize: 20,
              marginLeft: 15,
            }}
            >{Icons.angleRight}
            </FontAwesome>
          </View>
        </TouchableOpacity>
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
            hasBadge
            badgeComponent={
              <FontAwesome style={{
                color: '#1DBF12', fontSize: 10,
              }}
              >{Icons.lock}
              </FontAwesome>
          }
            image={{ uri: 'https://qph.fs.quoracdn.net/main-qimg-60b27864c5d69bdce69e6413b9819214' }}
          />
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: '#2F3142',
          }}
          >Provider Name
          </Text>
        </View>
        <View style={{
            height: 1, alignSelf: 'stretch', backgroundColor: '#E0EAF7', marginVertical: 7,
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SalonAppointmentTime startTime="12:00" />
          <TouchableOpacity onPress={props.onPressDelete}>
            <Icon
              name="trash"
              size={12}
              color="#D1242A"
              type="regular"
            />
          </TouchableOpacity>
        </View>
      </View>
    }
  />
);

export default class NewAppointmentScreen extends React.Component {
  static navigationOptions = rootProps => ({
    headerTitle: 'New Appointment',
  })

  constructor(props) {
    super(props);

    this.state = {
      guestNumber: 0,
      isRecurring: false,
      guestServices: [],
      selectedClient: null,
      selectedProvider: null,
      mainServices: ['service'],
    };
  }

  addMainService = () => {
    const { mainServices } = this.state;
    mainServices.push('service');
    this.setState({ mainServices });
  }

  addGuestService = () => {
    const { guestServices } = this.state;
    guestServices.push('service');
    this.setState({ guestServices });
  }

  deleteMainService = () => {
    const { mainServices } = this.state;
    mainServices.splice(0, 1);
    this.setState({ mainServices });
  }

  deleteGuestService = () => {
    const { guestServices } = this.state;
    guestServices.splice(0, 1);
    this.setState({ guestServices });
  }

  onPressGuest = () => alert('Not Implemented');

  onPressService = (service) => {
    this.props.navigation.navigate('ModifyApptService', { service });
  }

  onChangeRecurring = isRecurring => this.setState({ isRecurring });

  onChangeProvider = (selectedProvider) => {
    this.setState({ selectedProvider });
  }

  onChangeClient = (selectedClient) => {
    this.setState({ selectedClient });
  }

  onChangeGuestNumber = (action, guestNumber) => {
    this.setState({ guestNumber });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputGroup style={{ marginTop: 15 }}>
          <ProviderInput
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={this.onChangeProvider}
          />
          <InputDivider />
          <InputDate
            noIcon
            placeholder="Date"
            selectedDate={this.state.selectedDate}
            onPress={selectedDate => this.setState({ selectedDate })}
          />
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Client" />
        <InputGroup>
          <ClientInput
            navigate={this.props.navigation.navigate}
            selectedClient={this.state.selectedClient}
            onChange={this.onChangeClient}
            extraComponents={[
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AppointmentFormulas');
                }}
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Icon
                  name="stickyNoteO"
                  size={20}
                  color="#115ECD"
                  type="light"
                />
              </TouchableOpacity>,
              <TouchableOpacity
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
              </TouchableOpacity>,
            ]}
          />
          <InputDivider />
          <InputLabel
            label="Email"
            value={this.state.selectedClient !== null ? this.state.selectedClient.email : ''}
          />
          <InputDivider />
          <InputLabel
            label="Phone"
            value={this.state.selectedClient !== null ? this.state.selectedClient.phone : ''}
          />
          <InputDivider />
          <InputNumber
            value={this.state.guestNumber}
            onChange={this.onChangeGuestNumber}
            label="Multiple Guests"
            singularText="guest"
            pluralText="guests"
          />
        </InputGroup>
        <View>
          <SubTitle title="Main Client" />
          {this.state.mainServices.map(item => (
            <ServiceCard
              onPress={this.onPressService}
              onPressDelete={this.deleteMainService}
              key={Math.random().toString()}
              data={item}
            />
          ))}
          <AddButton
            onPress={this.addMainService}
            iconStyle={{ marginLeft: 10, marginRight: 6 }}
            title="add service"
          />
        </View>
        <View>
          <SubTitle title="1 Guest" />
          <Guest onPress={this.onPressGuest} />
          {this.state.guestServices.map(item => (
            <ServiceCard
              onPress={this.onPressService}
              onPressDelete={this.deleteGuestService}
              key={Math.random().toString()}
              data={item}
            />
          ))}
          <AddButton
            onPress={this.addGuestService}
            iconStyle={{ marginLeft: 10, marginRight: 6 }}
            title="add service"
          />
        </View>
        <InputGroup>
          <InputSwitch
            text="Recurring appt."
            onChange={this.onChangeRecurring}
            value={this.state.isRecurring}
          />
        </InputGroup>
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
          >60min / $50
          </Text>
        </View>
        <InputGroup style={{
          marginVertical: 30,
          paddingVertical: 10,
        }}
        >
          <LabeledTextarea label="Remarks" placeholder="Please specify" />
        </InputGroup>
      </ScrollView>
    );
  }
}
