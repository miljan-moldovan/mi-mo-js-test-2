import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment';

import {
  InputGroup,
  SectionTitle,
  ServiceInput,
  ProviderInput,
  SectionDivider,
  InputSwitch,
  InputLabel,
  InputNumber,
  InputButton,
  InputDivider,
  RemoveButton,
} from '../../components/formHelpers';
import Icon from '../../components/UI/Icon';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
});

// const shape = {
//   date: moment(),
//   fromTime: '',
//   toTime: '',
//   gapTime: '',
//   afterTime: '',
//   bookBetween: false,
//   employeeId: 0,
//   bookedByEmployeeId: 0,
//   serviceId: 0,
//   clientId: 0,
//   requested: false,
//   roomId: 0,
//   roomOrdinal: 0,
//   resourceId: 0,
//   resourceOrdinal: 0,
//   primaryAppointmentId: 0,
//   isFirstAvailable: false,
// };


export default class ModifyApptServiceScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let title = 'New Service';
    if ('params' in navigation.state && navigation.state.params !== undefined) {
      if ('item' in navigation.state.params) {
        title = navigation.state.params.item.service.name;
      }
    }
    return {
      title,
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
    };
  };

  constructor(props) {
    super(props);
    const {
      body,
    } = this.props.newAppointmentState;
    const { client } = this.props.navigation.state.params;
    this.props.navigation.setParams({ handleSave: this.handleSave });
    this.state = {
      selectedClient: null,
      selectedProvider: null,
      selectedService: null,
      startTime: null,
      endTime: null,
      length: null,
      gap: false,
      gapTime: 0,
      afterGap: 0,
      assignedRoom: null,
      assignedResource: null,
      body: {
        date: body.date,
        client,
        requested: false,
        clientId: client.id,
      },
    };
  }

  handleSelectService = (selectedService) => {
    const {
      startTime,
    } = this.props.newAppointmentState;
    const newBody = this.state.body;

    let endTime = null;
    if ('maxDuration' in selectedService) {
      endTime = moment(startTime, 'HH:mm').add(moment.duration(selectedService.maxDuration));
    }

    newBody.service = selectedService;
    newBody.serviceId = selectedService.id;
    newBody.fromTime = startTime;
    newBody.toTime = endTime.format('HH:mm');
    this.setState({ selectedService, body: newBody, endTime: endTime.format('HH:mm A') });
  }

  handleSave = () => {
    const { body } = this.state;
    const { params } = this.props.navigation.state;
    if ('guestIndex' in params) {
      this.props.newAppointmentActions.addGuestService(params.guestIndex, body);
    } else {
      this.props.newAppointmentActions.addNewApptItem(body);
    }
    this.props.navigation.goBack();
  }

  handleSelectProvider = (selectedProvider) => {
    const newBody = this.state.body;

    newBody.bookedByEmployeeId = selectedProvider.id;
    newBody.employeeId = selectedProvider.id;
    newBody.employee = selectedProvider;
    this.setState({ selectedProvider, body: newBody });
  }

  handleRequested = (requested) => {
    const newBody = this.state.body;
    newBody.requested = !requested;
    this.setState({ body: newBody });
  }

  onPressRemove = () => {
    const { body } = this.state;
    const { params } = this.props.navigation.state;
    if (!('serviceIndex' in params)) {
      return this.props.navigation.goBack();
    }

    if ('guestIndex' in params) {
      this.props.newAppointmentActions.removeGuestService(params.guestIndex, serviceIndex);
    } else {
      this.props.newAppointmentActions.removeService(body, params.serviceIndex);
    }

    this.props.navigation.goBack();
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            navigate={this.props.navigation.navigate}
            selectedService={this.state.selectedService}
            onChange={this.handleSelectService}
          />
          <InputDivider />
          <ProviderInput
            placeholder=""
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={this.handleSelectProvider}
          />
          <InputDivider />
          <InputSwitch
            text="Provider is requested"
            value={this.state.body.requested}
            onChange={this.handleRequested}
          />
          <InputDivider />
          <InputLabel
            label="Price"
            value={this.state.selectedService === null ? '' : `$${this.state.selectedService.price}`}
          />
        </InputGroup>
        <SectionTitle value="Time" />
        <InputGroup>
          <InputLabel
            label="Starts"
            value={moment(this.props.newAppointmentState.startTime, 'HH:mm').format('HH:mm A')}
          />
          <InputDivider />
          <InputLabel
            label="Ends"
            value={this.state.endTime}
          />
          <InputDivider />
          <InputLabel
            label="Length"
            value={
              this.state.selectedService === null
              ? '' : moment.duration(this.state.selectedService.maxDuration).humanize()
            }
          />
          <InputDivider />
          <InputSwitch
            text="Gap"
            value={this.state.gap}
            onChange={gap => this.setState({ gap: !gap })}
          />
          {this.state.gap && (
            <View>
              <InputDivider />
              <InputNumber
                value={this.state.gapTime}
                onChange={(action, gapTime) => this.setState({ gapTime })}
                label="Gap Time"
                singularText="min"
                pluralText="min"
              />
              <InputDivider />
              <InputNumber
                value={this.state.afterGap}
                onChange={(action, afterGap) => this.setState({ afterGap })}
                label="After"
                singularText="min"
                pluralText="min"
              />
            </View>
        )}
        </InputGroup>
        <SectionTitle value="Room & Resource" />
        <InputGroup>
          <InputButton
            onPress={() => alert('Not Implemented')}
            label="Assigned Room"
            value="None"
          />
          <InputDivider />
          <InputButton
            onPress={() => alert('Not Implemented')}
            label="Assigned Resource"
            value="None"
          />
        </InputGroup>
        <SectionDivider />
        <RemoveButton title="Remove Service" onPress={this.onPressRemove} />
        <SectionDivider />
      </ScrollView>
    );
  }
}
