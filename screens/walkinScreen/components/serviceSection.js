import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';

import { InputSwitch } from '../../../components/formHelpers';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  innerRow: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
    paddingLeft: 16,
    alignItems: 'center',
    paddingRight: 16,
  },
  lastInnerRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
  },
  addRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#C0C1C6',
  },
  plusIcon: {
    color: '#115ECD',
    fontSize: 22,
    marginRight: 5,
  },
  textData: {
    fontFamily: 'Roboto-Medium',
    color: '#110A24',
    fontSize: 14,
  },
  textLabel: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
  },
  textSwitch: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
    marginLeft: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#C0C1C6',
    paddingLeft: 16,
  },
  iconContainer: {
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDataContainer: {
    flex: 1,
  },
  removeIcon: {
    marginRight: 8,
    fontSize: 22,
    color: '#D1242A',
  },
  carretIcon: {
    fontSize: 20,
    color: '#727A8F',
  },
  label: {
    fontFamily: 'Roboto-Medium',
    color: '#727A8F',
    fontSize: 14,
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
});

class ServiceSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service: null,
      index: 0,
      type: '',
    };
  }

  handleSwitch = (service) => {
    alert('Not implemented');
  }

  handleProviderSelection = (provider, service, index) => {
    const newService = service;
    newService.provider = provider;
    this.props.onUpdate(index, newService);
  }

  handlePressProvider = (service, index) => {
    this.props.navigate('Providers', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeProvider: provider => this.handleProviderSelection(provider, service, index),
    });
  }

  handleServiceSelection = (data, service, index) => {
    const newService = service;
    newService.service = data;
    this.props.onUpdate(index, newService);
  }

  handlePressService = (service, index) => {
    this.props.navigate('Services', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeService: data => this.handleServiceSelection(data, service, index),
    });
  }

  renderProvider = (provider) => {
    if (provider) {
      return (
        <Text style={styles.textData}>{`${provider.name} ${provider.lastName}`}</Text>
      );
    }
    return (
      <Text style={styles.label}>Provider</Text>
    );
  }

  renderServiceInfo = (service) => {
    if (service) {
      return (
        <Text style={styles.textData}>{service.name}</Text>
      );
    }
    return (
      <Text style={styles.label}>Service</Text>
    );
  }

  renderService = (service, index) => (
    <View style={styles.serviceRow} key={index}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => this.props.onRemove(index)}>
          <View style={styles.row}>
            <FontAwesome style={styles.removeIcon}>{Icons.minusCircle}</FontAwesome>
            <Text style={styles.textLabel}>service</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.serviceDataContainer}>
        <TouchableOpacity onPress={() => this.handlePressService(service, index)}>
          <View style={styles.innerRow}>
            {this.renderServiceInfo(service.service)}
            <View style={styles.dataContainer}>
              <FontAwesome style={styles.carretIcon}>{Icons.angleRight}</FontAwesome>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handlePressProvider(service, index)}>
          <View style={styles.innerRow}>
            {this.renderProvider(service.provider)}
            <View style={styles.dataContainer}>
              <FontAwesome style={styles.carretIcon}>{Icons.angleRight}</FontAwesome>
            </View>
          </View>
        </TouchableOpacity>
        <InputSwitch textStyle={styles.textSwitch} onChange={this.handleSwitch} text="Provider is Requested?" value={service.isProviderRequested} />
      </View>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        {this.props.services.map((service, index) => this.renderService(service, index))}
        <TouchableOpacity onPress={this.props.onAdd}>
          <View style={styles.addRow}>
            <FontAwesome style={styles.plusIcon}>{Icons.plusCircle}</FontAwesome>
            <Text style={styles.textLabel}>add Service</Text>
          </View>
        </TouchableOpacity>
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
