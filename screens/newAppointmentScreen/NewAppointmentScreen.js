import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import FontAwesome, {Icons} from 'react-native-fontawesome';

import {
  InputGroup,
  InputButton,
  InputLabel,
  InputDate,
  SectionTitle,
  SectionDivider,
  InputDivider,
  ClientInput,
  ProviderInput,
  InputNumber,
} from '../../components/formHelpers';
import SalonCard from '../../components/SalonCard';
import SalonAvatar from '../../components/SalonAvatar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeCaretIcon: {
    fontSize: 12,
    marginHorizontal: 3,
  },
});


const caretRight = (
  <FontAwesome style={styles.timeCaretIcon}>{Icons.angleRight}</FontAwesome>
);

const SalonAppointmentTime = props => (
  <View style={[styles.serviceTimeContainer, { alignItems: 'center' }]}>
    <FontAwesome style={styles.serviceClockIcon}>{Icons.clockO}</FontAwesome>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.serviceTime}> {props.startTime}</Text>
      {caretRight}
      <Text style={styles.serviceTime}>REM Wait</Text>
      <Text style={styles.serviceRemainingWaitTime}> 7m</Text>
    </View>
  </View>
);

const ServiceCard = props => (
  <SalonCard
    backgroundColor="white"
    bodyChildren={
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1 }}>Thangs</Text>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignSelf: 'flex-end',
              alignItems: 'flex-start',
            }}
          >
            <Text>30m | $40</Text>
            <FontAwesome>{Icons.angleRight}</FontAwesome>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <SalonAvatar
            wrapperStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 15,
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
          <Text>{`Provider Name`}</Text>
        </View>
        <View style={{height: 1, alignSelf: 'stretch', backgroundColor: '#E0EAF7', marginVertical: 7 }} />
        <View>
          <SalonAppointmentTime startTime="12:00" />
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
      selectedClient: null,
      selectedEmail: null,
      selectedPhone: null,
      selectedProvider: null,
    };
  }

  onChangeProvider = (selectedProvider) => {
    this.setState({ selectedProvider });
  }

  onChangeClient = (selectedClient) => {
    console.log(selectedClient);
    this.setState({ selectedClient });
  }

  onChangeGuestNumber = (action, guestNumber) => {
    console.log(action, guestNumber); 
    this.setState({ guestNumber });
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 15 }}>
          <ProviderInput
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={this.onChangeProvider}
          />
          <InputDivider />
          <InputDate />
        </InputGroup>
        <SectionTitle value="Client" />
        <InputGroup>
          <ClientInput
            navigate={this.props.navigation.navigate}
            selectedClient={this.state.selectedClient}
            onChange={this.onChangeClient}
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
          <InputNumber
            value={this.state.guestNumber}
            onChange={this.onChangeGuestNumber}
            pluralText="Multiple Guests"
            singularText="Multiple Guests"
          />
        </InputGroup>
        <ServiceCard />
      </View>
    );
  }
}
