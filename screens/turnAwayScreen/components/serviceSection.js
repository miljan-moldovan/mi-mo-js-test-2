import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import SalonAvatar from '../../../components/SalonAvatar';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import styles from './stylesServiceSection';

import {
  ProviderInput,
  InputDivider,
  ServiceInput,
  DefaultAvatar,
  SchedulePicker,
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

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }

  showDateTimePicker = (date, service, index, type) => {
    this.setState({
      isDateTimePickerVisible: true,
      date: date.toDate(),
      service,
      index,
      type,
    });
  }

  handleDateSelection = (date) => {
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
    newService.service = data;
    newService.myServiceId = data.id;
    const durationInMinutes = moment.duration(data.minDuration).asMinutes();
    newService.toTime = moment(newService.fromTime, 'HH:mm:ss').add(durationInMinutes, 'minutes');
    this.props.onUpdate(index, newService);
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
          noLabel
          queueList
          filterByService
          placeholder={false}
          apptBook={this.props.apptBook}
          navigate={this.props.navigate}
          selectedService={service.service}
          selectedProvider={service.provider}
          rootStyle={styles.providerRootStyle}
          headerProps={{ title: 'Providers', ...this.props.cancelButton() }}
          onChange={provider => this.handleProviderSelection(provider, service, index)}
        />
        <InputDivider style={styles.middleSectionDivider} />
        <ServiceInput
          noPlaceholder
          apptBook={this.props.apptBook}
          rootStyle={styles.providerRootStyle}
          nameKey={service.service && service.service.description ? 'description' : 'name'}
          navigate={this.props.navigate}
          selectedProvider={service.provider}
          selectedService={service.service}
          headerProps={{ title: 'Services', ...this.props.cancelButton() }}
          onChange={(selectedService) => { this.handleServiceSelection(selectedService, service, index); }}
        />
        <InputDivider style={styles.middleSectionDivider} />
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
          titleIOS="Pick Time"
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDateSelection}
          onCancel={this.hideDateTimePicker}
          mode="time"
          minuteInterval={this.props.minuteInterval}
          date={this.state.date}
          minimumDate={moment('7:00:00', 'hh:mm:ss').toDate()}
          maximumDate={moment('23:45:00', 'hh:mm:ss').toDate()}
        />
      </View>
    );
  }
}

ServiceSection.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
  cancelButton: PropTypes.func.isRequired,
  minuteInterval: PropTypes.number,
};
ServiceSection.defaultProps = {
  minuteInterval: 1,
};
export default ServiceSection;
