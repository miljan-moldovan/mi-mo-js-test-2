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

    this.state = this.getStateFromParams();
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  getStateFromParams = () => {
    const params = this.props.navigation.state.params || {};
    const serviceItem = params.serviceItem || false;
    const client = params.client || null;
    const date = params.date || moment();

    const state = {
      date,
      canSave: false,
      canRemove: !!params.onRemoveService,
      selectedClient: serviceItem.guestId ? get(serviceItem.service, 'client', null) : client,
      selectedProvider: get(serviceItem.service, 'employee', null),
      selectedService: get(serviceItem.service, 'service'),
      startTime: get(serviceItem.service, 'fromTime', moment()),
      endTime: get(serviceItem.service, 'toTime', moment().add(15, 'm')),
      requested: get(serviceItem.service, 'requested', true),
      bookBetween: get(serviceItem.service, 'bookBetween', false),
      gapTime: +get(serviceItem.service, 'gapTime', 0),
      afterTime: +get(serviceItem.service, 'afterTime', 0),
      assignedRoom: get(serviceItem.service, 'assignedRoom', null),
      assignedResource: get(serviceItem.service, 'assignedResource', null),
    };

    state.length = moment.duration(state.endTime.diff(state.startTime));

    return state;
  }

  componentDidMount() {
    this.validate();
  }

  handleSelectService = (selectedService) => {
    const { startTime } = this.state;
    let endTime = null;
    if ('maxDuration' in selectedService) {
      endTime = moment(startTime).add(moment.duration(selectedService.maxDuration));
    }
    const length = moment.duration(endTime.diff(startTime));
    this.setState({
      selectedService,
      endTime,
      length,
    }, this.validate);
  }

  handleSave = () => {
    const {
      canSave,
      selectedClient,
      selectedProvider,
      selectedService,
      startTime,
      endTime,
      requested,
      bookBetween,
      gapTime,
      afterTime,
      assignedRoom,
      assignedResource,
    } = this.state;

    if (canSave) {
      const { params } = this.props.navigation.state;
      const serviceItem = {
        client: selectedClient,
        employee: selectedProvider,
        service: selectedService,
        fromTime: startTime,
        toTime: endTime,
        requested,
        bookBetween,
        gapTime,
        afterTime,
        room: assignedRoom,
        resource: assignedResource,
      };

      params.onSaveService(serviceItem);
      this.props.navigation.goBack();
    }
  }

  handleSelectProvider = (selectedProvider) => {
    this.setState({
      selectedProvider,
    }, this.validate);
  }

  handleRequested = (requested) => {
    this.setState({ requested: !requested });
  }

  onPressRemove = () => {
    const params = this.props.navigation.state.params || {};
    if (params.onRemoveService) {
      params.onRemoveService();
    }
    return this.props.navigation.goBack();
  }

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
      canRemove,
      selectedProvider,
      selectedService,
      startTime,
      endTime,
      requested,
      bookBetween,
      gapTime,
      afterTime,
      length,
      assignedRoom,
      assignedResource,
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
          <InputLabel
            label="Price"
            value={selectedService === null ? '' : `$${selectedService.price}`}
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
            value={`${moment.duration(length).asMinutes()} min`}
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
                label="Gap Time"
                singularText="min"
                pluralText="min"
              />
              <InputDivider />
              <InputNumber
                value={afterTime}
                onChange={(action, afterTime) => this.setState({ afterTime })}
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
        {canRemove && (
          <RemoveButton title="Remove Service" onPress={this.onPressRemove} />
        )}
        <SectionDivider />
      </ScrollView>
    );
  }
}
