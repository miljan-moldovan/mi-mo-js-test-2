import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  InputGroup,
  InputDivider,
  InputSwitch,
  ServiceInput,
  ProviderInput,
  SectionDivider,
  PromotionInput,
  InputLabel,
} from '../../components/formHelpers';
import apiWrapper from '../../utilities/apiWrapper';
import Icon from '../../components/UI/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default class ModifyServiceScreen extends React.Component {
  static navigationOptions = rootProps => ({
    headerTitle: <Text style={styles.titleText}>{'service' in rootProps.navigation.state.params ?
      'Modify Service' : 'Add Service'}
    </Text>,
    headerLeft:

  <TouchableOpacity
    onPress={() => { rootProps.navigation.goBack(); }}
  >
    <Icon
      name="angleLeft"
      type="regular"
      color="white"
      size={26}
    />
  </TouchableOpacity>,

    headerRight: (
      <TouchableOpacity
        onPress={rootProps.navigation.state.params.onSave}
      >
        <Text style={{ fontSize: 16, color: 'white' }}>Save</Text>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ ...params, onSave: this.onSave.bind(this) });

    this.state = {
      index: 'index' in params ? params.index : null,
      service: 'service' in params ? params.service : null,
      selectedService: 'service' in params ? params.service : null,
      selectedProvider: 'service' in params ? {
        id: !params.service.isFirstAvailable ? params.service.employeeId : 0,
        name: !params.service.isFirstAvailable ? params.service.employeeFirstName : 'First',
        lastName: !params.service.isFirstAvailable ? params.service.employeeLastName : 'Available',
      } : null,
      selectedPromotion: 'promotion' in params ? params.promotion : null,
      providerRequested: false,
      price: 'service' in params ? params.service.price : 0,
      discount: '0',
    };
  }

  onSave = () => {
    const { service, index } = this.state;
    this.props.appointmentDetailsActions.addService({ service, index });
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            navigate={this.props.navigation.navigate}
            selectedService={this.state.selectedService}
            onChange={(selected) => {
              this.setState({
                service: { name: selected.name },
                selectedService: selected,
              });

              apiWrapper.doRequest('getService', {
                path: {
                  id: selected.id,
                },
              })
                .then((service) => {
                  this.setState({
                    price: service.price,
                    selectedService: selected,
                    service: { ...this.state.service, ...service, name: selected.name },
                  });
                })
                .catch((err) => {
                  console.warn(err);
                });
            }}
          />
          <InputDivider />
          <ProviderInput
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={(provider) => {
              this.setState({
                service: {
                  ...this.state.service,
                  employeeId: provider.id,
                  employeeFirstName: provider.name,
                  employeeMiddleName: provider.middleName,
                  employeeLastName: provider.lastName,
                  employeeFullName: provider.fullName,
                },
                selectedProvider: provider,
              });
            }}
          />
          <InputDivider />
          <InputSwitch
            value={this.state.providerRequested}
            onChange={providerRequested => this.setState({ providerRequested })}
            text="Provider is requested?"
          />
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <PromotionInput
            navigate={this.props.navigation.navigate}
            onChange={(promotion) => {
              this.setState({ selectedPromotion: promotion });
            }}
          />
          <InputDivider />
          <InputLabel label="Discount" value={`${this.state.discount}`} />
          <InputLabel label="Price" value={`$${this.state.price}`} />
        </InputGroup>
        <SectionDivider />
        {this.state.index !== null && (
          <InputGroup>
            <TouchableOpacity
              style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                this.props.appointmentDetailsActions.removeService(this.state.index);
                this.props.navigation.goBack();
              }}
            >
              <Text style={{
              fontSize: 14, lineHeight: 22, color: '#D1242A', fontFamily: 'Roboto-Medium',
              }}
              >
              Remove Service
              </Text>
            </TouchableOpacity>
          </InputGroup>
      )}
      </View>
    );
  }
}
