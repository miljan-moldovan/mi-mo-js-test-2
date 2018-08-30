import React, { Component } from 'react';
import { View, Text } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import SalonAvatar from '../../../components/SalonAvatar';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import styles from './stylesServiceSection';

import {
  ProviderInput,
  InputDivider,
  ServiceInput,
  InputSwitch,
} from '../../../components/formHelpers';


class ServiceSection extends Component {
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
    this.props.onUpdate(index, newService);
  }

  handleUpdateIsProviderRequested= (service, index) => {
    const newService = service;
    newService.isProviderRequested = !newService.isProviderRequested;
    this.props.onUpdate(index, newService);
  }

  renderProvider = (provider) => {
    const providerName = provider ? (!provider.isFirstAvailable ? ((`${provider.name} ${provider.lastName}`)) : 'First Available') : '';

    if (provider) {
      return (
        <View style={styles.providerContainer}>
          <SalonAvatar
            width={26}
            image={getEmployeePhotoSource(provider)}
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
      return (
        <Text style={[styles.textData, { marginLeft: 0 }]}>{service.name}</Text>
      );
    }
    return (
      <Text style={styles.label}>Service</Text>
    );
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
          noPlaceholder
          rootStyle={styles.providerRootStyle}
          nameKey={service.service && service.service.description ? 'description' : 'name'}
          selectedProvider={service.provider}
          navigate={this.props.navigate}
          selectedService={service.service}
          headerProps={{ title: 'Services', ...this.props.cancelButton() }}
          onChange={(selectedService) => { this.handleServiceSelection(selectedService, service, index); }}
        />
        {service.provider && !service.provider.isFirstAvailable && <InputDivider style={styles.middleSectionDivider} />}
        {service.provider && !service.provider.isFirstAvailable && <InputSwitch
          textStyle={styles.textLabel}
          style={styles.providerRequestedStyle}
          onChange={() => { this.handleUpdateIsProviderRequested(service, index); }}
          text="Provider is Requested?"
          value={service.isProviderRequested}
        />}
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
