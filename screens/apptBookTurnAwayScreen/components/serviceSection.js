import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { getEmployeePhoto } from '../../../utilities/apiWrapper';
import SalonAvatar from '../../../components/SalonAvatar';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import styles from './stylesServiceSection';

import {
  ProviderInput,
  InputDivider,
  ServiceInput,
} from '../../../components/formHelpers';


class ServiceSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      service: null,
      index: 0,
      type: '',
      isDateTimePickerVisible: false,
      minuteInterval: 15,
    };
  }

  hideDateTimePicker =() => {
    this.setState({ isDateTimePickerVisible: false });
  }

  showDateTimePicker =(date, service, index, type) => {
    this.setState({
      isDateTimePickerVisible: true,
      date: date.toDate(),
      service,
      index,
      type,
    });
  }

  handleDateSelection=(date) => {
    const newService = this.state.service;
    newService[this.state.type] = moment(date.getTime());
    this.props.onUpdate(this.state.index, newService);
    this.hideDateTimePicker();
  }

  handleProviderSelection = (provider, service, index) => {
    const newService = service;
    newService.provider = provider;
    newService.myEmployeeId = provider.id;
    this.props.onUpdate(index, newService);
  }


  handleServiceSelection = (data, service, index) => {
    const newService = service;
    debugger //eslint-disable-line
    newService.service = data;
    newService.myServiceId = data.id;
    const durationInMinutes = moment.duration(data.minDuration).asMinutes();
    newService.toTime = moment(newService.fromTime, 'HH:mm:ss').add(durationInMinutes, 'minutes');
    this.props.onUpdate(index, newService);
  }

  renderProvider = (provider) => {
    const providerName = provider ? (!provider.isFirstAvailable ? ((`${provider.name} ${provider.lastName}`)) : 'First Available') : '';
    const providerPhoto = provider ? (getEmployeePhoto(!provider.isFirstAvailable ? provider.id : 0)) : '';

    if (provider) {
      return (<View style={styles.providerContainer}>
        <SalonAvatar
          width={26}
          image={{ uri: providerPhoto }}
        />
        <Text style={styles.textData}>{providerName}</Text>
      </View>

      );
    }
    return (
      <Text style={styles.label}>Provider</Text>
    );
  }

  renderServiceInfo = (serviceContainer, service) => {
    if (service) {
      const durationInMinutes = moment.duration(service.minDuration).asMinutes();
      serviceContainer.toTime = moment(serviceContainer.fromTime, 'HH:mm:ss').add(durationInMinutes, 'minutes');
      return (
        <Text style={[styles.textData, { marginLeft: 0 }]}>{service.name}</Text>
      );
    }
    return (
      <Text style={styles.label}>Service</Text>
    );
  }

  showDateTimePickerToTime = (service, index) => {
    this.showDateTimePicker(service.toTime, service, index, 'toTime');
  }

  showDateTimePickerFromTime = (service, index) => {
    this.showDateTimePicker(service.fromTime, service, index, 'fromTime');
  }

  renderService = (service, index) => (
    <View style={styles.serviceRow} key={index}>
      <View style={styles.iconContainer}>
        <SalonTouchableOpacity onPress={() => this.props.onRemove(index)}>
          <View style={styles.row}>
            <FontAwesome style={styles.removeIcon}>{Icons.minusCircle}</FontAwesome>
            <Text style={styles.textData}>service</Text>
          </View>
        </SalonTouchableOpacity>
      </View>
      <View style={styles.serviceDataContainer}>
        <ProviderInput
          apptBook
          showFirstAvailable={false}
          noLabel
          filterByService
          rootStyle={styles.providerRootStyle}
          selectedProvider={service.provider}
          placeholder="Provider"
          navigate={this.props.navigate}
          headerProps={{ title: 'Providers', ...this.props.cancelButton() }}
          onChange={(provider) => { this.handleProviderSelection(provider, service, index); }}
        />
        <InputDivider style={styles.middleSectionDivider} />

        <ServiceInput
          apptBook
          noPlaceholder
          rootStyle={styles.providerRootStyle}
          nameKey={service.service && service.service.description ? 'description' : 'name'}
          selectedProvider={service.provider}
          navigate={this.props.navigate}
          selectedService={service.service}
          headerProps={{ title: 'Services', ...this.props.cancelButton() }}
          onChange={(selectedService) => { this.handleServiceSelection(selectedService, service, index); }}
        />
        <InputDivider style={styles.middleSectionDivider} />
        {/*  <SalonTouchableOpacity onPress={() => this.handlePressService(service, index)}>
          <View style={styles.innerRow}>
            {this.renderServiceInfo(service, service.service)}
            <View style={styles.dataContainer}>
              <FontAwesome style={styles.carretIcon}>{Icons.angleRight}</FontAwesome>
            </View>
          </View>
        </SalonTouchableOpacity> */}
        <SalonTouchableOpacity onPress={() => this.showDateTimePickerFromTime(service, index)}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Start</Text>
            <View style={styles.dataContainer}>
              <Text style={styles.textData}>{service.fromTime.format('hh:mm a')}</Text>
            </View>
          </View>
        </SalonTouchableOpacity>
        <SalonTouchableOpacity onPress={() => this.showDateTimePickerToTime(service, index)}>
          <View style={styles.lastInnerRow}>
            <Text style={styles.label}>End</Text>
            <View style={styles.dataContainer}>
              <Text style={styles.textData}>{service.toTime.format('hh:mm a')}</Text>
            </View>
          </View>
        </SalonTouchableOpacity>
      </View>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        {this.props.services.map((service, index) => this.renderService(service, index))}
        <SalonTouchableOpacity onPress={this.props.onAdd}>
          <View style={styles.addRow}>
            <FontAwesome style={styles.plusIcon}>{Icons.plusCircle}</FontAwesome>
            <Text style={styles.textData}>add service</Text>
          </View>
        </SalonTouchableOpacity>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDateSelection}
          onCancel={this.hideDateTimePicker}
          mode="time"
          minuteInterval={this.state.minuteInterval}
          date={this.state.date}
        />
      </View>
    );
  }
}

ServiceSection.propTypes = {
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default ServiceSection;
