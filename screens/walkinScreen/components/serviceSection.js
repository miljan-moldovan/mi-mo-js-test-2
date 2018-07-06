import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import SalonAvatar from '../../../components/SalonAvatar';
import { InputSwitch, InputDivider, InputGroup, InputButton } from '../../../components/formHelpers';
import { getEmployeePhoto } from '../../../utilities/apiWrapper';


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
  serviceRow: {
    flexDirection: 'column',
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
  handleProviderSelection = (newProvider) => {
    this.props.onUpdateProvider(newProvider);
  }

  handlePressProvider = () => {
    this.props.navigate('Providers', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeProvider: this.handleProviderSelection,
    });
  }

  handleServiceSelection = (newService) => {
    this.props.onUpdateService(newService);
  }

  handlePressService = () => {
    this.props.navigate('Services', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeService: this.handleServiceSelection,
    });
  }

  renderProvider = () => {
    const { provider } = this.props;
    const providerName = !provider.isFirstAvailable ? ((`${provider.name || ''} ${provider.lastName || ''}`).toUpperCase()) : 'First Available';

    if (provider) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <SalonAvatar
            wrapperStyle={{ marginRight: 5 }}
            width={26}
            borderWidth={1}
            borderColor="transparent"
            image={{ uri: getEmployeePhoto(!provider.isFirstAvailable ? provider.id : 0) }}
          />
          <Text style={styles.textData}>{`${providerName}`}</Text>
        </View>
      );
    }
    return (
      <Text style={styles.label}>Provider</Text>
    );
  }

  renderService = () => {
    const { service } = this.props;
    if (service) {
      return (
        <Text style={styles.textData}>{service.name}</Text>
      );
    }
    return (
      <Text style={styles.label}>Service</Text>
    );
  }

  render() {
    const { service, provider } = this.props;
    return (
      <InputGroup>
        <InputButton label={this.renderService()} onPress={this.handlePressService} />
        <InputDivider />
        <InputButton label={this.renderProvider()} onPress={this.handlePressProvider} />
        {!this.props.provider.isFirstAvailable && <InputDivider />}
        {!this.props.provider.isFirstAvailable && <InputSwitch
          textStyle={styles.textLabel}
          onChange={this.props.onUpdateIsProviderRequested}
          text="Provider is Requested?"
          value={this.props.isProviderRequested}
        />}
      </InputGroup>
    );
  }
}


ServiceSection.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default ServiceSection;
