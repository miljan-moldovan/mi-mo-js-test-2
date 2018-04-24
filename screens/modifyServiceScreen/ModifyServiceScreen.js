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
import * as actions from '../../actions/queue';

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
      services: 'services' in params ? params.services : null,
      selectedService: 'service' in params ? params.service : null,
      appointment: 'appointment' in params ? params.appointment : null,
      selectedProvider: 'service' in params ? {
        id: params.service ? (!params.service.isFirstAvailable ? params.service.employeeId : 0) : null,
        name: params.service ? (!params.service.isFirstAvailable ? params.service.employeeFirstName : 'First') : null,
        lastName: params.service ? (!params.service.isFirstAvailable ? params.service.employeeLastName : 'Available') : null,
      } : null,
      selectedPromotion: 'promotion' in params ? params.promotion : null,
      providerRequested: false,
      price: 'service' in params ? params.service.price : 0,
      discount: '0',
    };
  }

  onSave = () => {
    alert('Not implemented');

    // const { service, index } = this.state;
    // this.saveQueue();
    //
    // this.props.navigation.goBack();
  }

  removeService = (index) => {

  }

  saveQueue = () => {
    const newServices = [];


    for (let i = 0; i < this.state.services.length; i++) {
      const oldService = this.state.services[i];

      let newService = {
        serviceId: oldService.serviceId,
        employeeId: oldService.employeeId,
        promotionCode: oldService.promoCode,
        isProviderRequested: oldService.isProviderRequested,
        priceEntered: oldService.price,
        isFirstAvailable: oldService.isFirstAvailable,
      };

      if (oldService.id === this.state.service.id) {
        newService = {
          serviceId: this.state.selectedService.id,
          employeeId: 'isFirstAvailable' in this.state.selectedProvider ? null : this.state.selectedProvider.id,
          promotionCode: this.state.selectedPromotion ? this.state.selectedPromotion.promoCode : null,
          isProviderRequested: this.state.selectedService.isProviderRequested,
          priceEntered: this.state.selectedService.price,
          isFirstAvailable: 'isFirstAvailable' in this.state.selectedProvider,
        };
      }

      newServices.push(newService);
    }


    this.props.putQueue(this.state.service.id, {
      clientId: this.state.appointment.client.id,
      serviceEmployeeClientQueues: newServices,
      productEmployeeClientQueues: [],
    }).then((response) => {


    }).catch((error) => {
    });
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
                selectedService: selected,
              });
            }}
          />
          <InputDivider />
          <ProviderInput
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={(provider) => {
              this.setState({
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
                this.removeService(this.state.index);
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
