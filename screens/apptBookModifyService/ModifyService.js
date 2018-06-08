import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import { get } from 'lodash';

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
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;

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
          onPress={() => (canSave ? navigation.state.params.handleSave() : null)}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: canSave ? 'white' : 'rgba(0,0,0,.3)',
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
    const params = this.props.navigation.state.params || {};
    const client = params.client || null;

    const startTime = params.startTime || moment();
    this.props.navigation.setParams({ handleSave: this.handleSave });
    this.state = {
      selectedClient: client,
      selectedProvider: null,
      selectedService: null,
      startTime,
      canRemove: params.onRemoveService || false,
      endTime: null,
      length: null,
      bookBetween: false,
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
    const newBody = this.state.body;
    const { startTime } = this.state;
    let endTime = null;
    if ('maxDuration' in selectedService) {
      endTime = moment(startTime).add(moment.duration(selectedService.maxDuration));
    }

    newBody.service = selectedService;
    newBody.serviceId = selectedService.id;
    newBody.fromTime = startTime;
    newBody.toTime = endTime;
    this.setState({
      selectedService,
      endTime,
      body: newBody,
    }, this.validate);
  }

  handleSave = () => {
    if (this.state.canSave) {
      const { body } = this.state;
      const { params } = this.props.navigation.state;

      if ('guestId' in params) {
        params.onSaveService(body, params.guestId);
      } else {
        params.onSaveService(body);
      }
      this.props.navigation.goBack();
    }
  }

  handleSelectProvider = (selectedProvider) => {
    const newBody = this.state.body;

    newBody.employee = selectedProvider;
    this.setState({
      selectedProvider,
      body: newBody,
    }, this.validate);
  }

  handleRequested = (requested) => {
    const newBody = this.state.body;
    newBody.requested = !requested;
    this.setState({ body: newBody });
  }

  onPressRemove = () => {
    const { params } = this.props.navigation.state;
    if (!('serviceIndex' in params)) {
      return this.props.navigation.goBack();
    }

    params.onRemoveService(params.serviceIndex, params.guestIndex || false);
    return this.props.navigation.goBack();
  };

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
  })

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

  render() {
    const {
      selectedProvider,
      selectedService,
      startTime,
      endTime,
    } = this.state;
    return (
      <ScrollView style={styles.container}>
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
            selectedProvider={this.state.selectedProvider}
            onChange={this.handleSelectProvider}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
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
            value={startTime.format('HH:mm A')}
          />
          <InputDivider />
          <InputLabel
            label="Ends"
            value={moment(endTime).isValid() ? endTime.format('HH:mm A') : '-'}
          />
          <InputDivider />
          <InputLabel
            label="Length"
            value={
              this.state.selectedService === null
              ? '-' : `${moment.duration(this.state.selectedService.maxDuration).asMinutes()} min`
            }
          />
          <InputDivider />
          <InputSwitch
            text="Gap"
            value={this.state.bookBetween}
            onChange={bookBetween => this.setState({ bookBetween: !bookBetween })}
          />
          {this.state.bookBetween && (
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
        {this.state.canRemove && (
          <RemoveButton title="Remove Service" onPress={this.onPressRemove} />
        )}
        <SectionDivider />
      </ScrollView>
    );
  }
}
