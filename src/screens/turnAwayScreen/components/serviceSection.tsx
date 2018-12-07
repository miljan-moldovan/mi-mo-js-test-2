import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {get, cloneDeep} from 'lodash';
import moment from 'moment';
import {
  getEmployeePhotoSource,
} from '../../../utilities/helpers/getEmployeePhotoSource';
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
import ProviderSchedulePicker
  from '../../../components/formHelpers/components/ProviderSchedulePicker';
import DateTime from '../../../constants/DateTime';

class ServiceSection extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      currentPickerOpen: null,
      services: props.services,
      date: new Date (),
      service: null,
      index: 0,
      type: '',
      isDateTimePickerVisible: false,
      minuteInterval: 15,
    };
  }

  componentWillReceiveProps (nextPros) {
    if (nextPros.services.length > 0) {
      this.setState ({services: nextPros.services});
    }
  }

  handlePickerToggle = (itemId, type) => {
    this.setState (state => {
      const isOpen =
        state.currentPickerOpen &&
        state.currentPickerOpen.type === type &&
        state.currentPickerOpen.itemId === itemId;
      return {
        ...state,
        currentPickerOpen: isOpen
          ? null
          : {
              itemId,
              type,
            },
      };
    });
  };

  hideDateTimePicker = () => {
    this.setState ({isDateTimePickerVisible: false});
  };

  showDateTimePicker = (date, service, index, type) => {
    this.setState ({
      date: date.toDate (),
      service,
      index,
      type,
    });
  };

  handleDateSelection = date => {
    const {service, type} = this.state;
    const newService = cloneDeep (service);
    newService[type] = moment (date.getTime ());
    if (type === 'fromTime') {
      newService.toTime = moment (newService.fromTime).add (newService.length);
    }
    newService.length = newService.fromTime.diff (newService.toTime);
    this.props.onUpdate (this.state.index, newService);
    this.hideDateTimePicker ();
  };

  onChangeTimePicker = (itemId, time, type) => {
    const services = cloneDeep (this.state.services);
    const index = services.findIndex (itm => itm.itemId === itemId);
    services[index][type] = time;
    this.setState ({
      services,
    });
  };

  handleProviderSelection = (provider, service, index) => {
    const newService = service;
    newService.provider = provider;

    newService.myEmployeeId = provider.isFirstAvailable ? null : provider.id;
    this.props.onUpdate (index, newService);
  };

  handleServiceSelection = (data, service, index) => {
    const newService = service;
    newService.service = data;
    newService.myServiceId = data.id;
    const durationInMinutes = moment.duration (data.minDuration).asMinutes ();
    newService.toTime = moment (newService.fromTime, 'HH:mm:ss').add (
      durationInMinutes,
      'minutes'
    );
    this.props.onUpdate (index, newService);
  };

  showDateTimePickerToTime = (service, index) => {
    this.showDateTimePicker (service.toTime, service, index, 'toTime');
  };

  showDateTimePickerFromTime = (service, index) => {
    this.showDateTimePicker (service.fromTime, service, index, 'fromTime');
  };

  renderService = (service, index) => {
    const {currentPickerOpen} = this.state;
    const isOpenStartTimePicker =
      currentPickerOpen &&
      currentPickerOpen.itemId === service.itemId &&
      currentPickerOpen.type === 'startTime';
    const isOpenEndTimePicker =
      currentPickerOpen &&
      currentPickerOpen.itemId === service.itemId &&
      currentPickerOpen.type === 'endTime';
    const toggleStartTimePicker = () =>
      this.handlePickerToggle (service.itemId, 'startTime');
    const toggleEndTimePicker = () =>
      this.handlePickerToggle (service.itemId, 'endTime');
    const onChangeStartTime = time =>
      this.onChangeTimePicker (service.itemId, time, 'fromTime');
    const onChangeEndTime = time =>
      this.onChangeTimePicker (service.itemId, time, 'toTime');
    return (
      <View style={styles.serviceRow} key={service.itemId}>
        <View style={styles.iconContainer}>
          <SalonTouchableOpacity
            onPress={() => this.props.onRemove (service.itemId)}
          >
            <View style={styles.row}>
              <FontAwesome style={styles.removeIcon}>
                {Icons.minusCircle}
              </FontAwesome>
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
            headerProps={{title: 'Providers', ...this.props.cancelButton ()}}
            onChange={provider =>
              this.handleProviderSelection (provider, service, service.itemId)}
          />
          <InputDivider style={styles.middleSectionDivider} />
          <ServiceInput
            noPlaceholder
            apptBook={this.props.apptBook}
            rootStyle={styles.providerRootStyle}
            nameKey={
              service.service && service.service.description
                ? 'description'
                : 'name'
            }
            navigate={this.props.navigate}
            selectedProvider={service.provider}
            selectedService={service.service}
            headerProps={{title: 'Services', ...this.props.cancelButton ()}}
            onChange={selectedService => {
              this.handleServiceSelection (
                selectedService,
                service,
                service.itemId
              );
            }}
          />
          <InputDivider style={styles.middleSectionDivider} />
          <SchedulePicker
            date={this.props.date}
            isOpen={isOpenStartTimePicker}
            toggle={toggleStartTimePicker}
            label="Start"
            format={DateTime.displayTime}
            onChange={onChangeStartTime}
            value={service.fromTime}
          />
          <InputDivider style={styles.middleSectionDivider} />
          <SchedulePicker
            date={this.props.date}
            isOpen={isOpenEndTimePicker}
            toggle={toggleEndTimePicker}
            label="End"
            format={DateTime.displayTime}
            onChange={onChangeEndTime}
            value={service.toTime}
          />
        </View>
      </View>
    );
  };

  render () {
    return (
      <View style={styles.container}>
        {this.state.services.map ((service, index) =>
          this.renderService (service, index)
        )}
        <SalonTouchableOpacity onPress={this.props.onAdd}>
          <View style={styles.addRow}>
            <FontAwesome style={styles.plusIcon}>
              {Icons.plusCircle}
            </FontAwesome>
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
          minimumDate={moment ('7:00:00', 'hh:mm:ss').toDate ()}
          maximumDate={moment ('23:45:00', 'hh:mm:ss').toDate ()}
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
  services: PropTypes.arrayOf (PropTypes.object).isRequired,
  cancelButton: PropTypes.func.isRequired,
  minuteInterval: PropTypes.number,
};
ServiceSection.defaultProps = {
  minuteInterval: 1,
};
export default ServiceSection;
