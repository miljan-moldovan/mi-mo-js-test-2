import React from 'react';
import {
  View,
  Text,
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
import * as actions from '../../actions/queue';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';

export default class ModifyServiceScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    // const canSave = params.canSave || false;
    const canSave = true;

    return {
      tabBarVisible: false,
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {'service' in params ? 'Modify Service' : 'Add Service'}
          </Text>
        </View>
      ),

      headerLeft: (
        <SalonTouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.leftButtonText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          disabled={!canSave}
          onPress={() => {
          if (params.onSave) {
            params.onSave();
          }
        }}
        >
          <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
        </SalonTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ ...params, onSave: this.onSave.bind(this) });

    debugger //eslint-disable-line

    this.state = {
      index: 'index' in params ? params.index : null,
      service: 'service' in params ? params.service : null,
      services: 'services' in params ? params.services : null,
      selectedService: 'service' in params ? params.service : null,
      appointment: 'appointment' in params ? params.appointment : null,
      selectedProvider: 'service' in params ? params.service.employee : null,
      selectedPromotion: 'promotion' in params ? params.promotion : null,
      providerRequested: false,
      price: 'service' in params ? params.service.price : 0,
      discount: '0',
    };
  }

  state = {
    index: null,
    service: null,
    services: null,
    selectedService: null,
    appointment: null,
    selectedProvider: null,
    selectedPromotion: null,
    providerRequested: false,
    price: 0,
    discount: '0',
  };

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

onChangeProvider = (provider) => {
  this.setState({
    selectedProvider: provider,
  });
}

cancelButton = () => ({
  leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
  leftButtonOnPress: (navigation) => {
    navigation.goBack();
  },
})

handleSelectService = (selected) => {
  this.setState({
    selectedService: selected,
  });
}

render() {
  return (
    <View style={styles.container}>
      <InputGroup style={{ marginTop: 16 }}>
        <ServiceInput
          noPlaceholder
          selectedProvider={this.state.selectedProvider}
          navigate={this.props.navigation.navigate}
          selectedService={this.state.selectedService}
          onChange={this.handleSelectService}
          headerProps={{ title: 'Services', ...this.cancelButton() }}
        />
        <InputDivider />
        <ProviderInput
          noPlaceholder
          showFirstAvailable={false}
          filterByService
          style={styles.innerRow}
          selectedProvider={this.state.selectedProvider}
          label="Provider"
          iconStyle={styles.carretIcon}
          avatarSize={20}
          navigate={this.props.navigation.navigate}
          headerProps={{ title: 'Providers', ...this.cancelButton() }}
          onChange={this.onChangeProvider}
        />
        {this.state.selectedProvider && !this.state.selectedProvider.isFirstAvailable && <InputDivider />}
        {this.state.selectedProvider && !this.state.selectedProvider.isFirstAvailable && <InputSwitch
          value={this.state.providerRequested}
          onChange={providerRequested => this.setState({ providerRequested })}
          text="Provider is requested?"
        />}
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
        <SalonTouchableOpacity
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
        </SalonTouchableOpacity>
      </InputGroup>
      )}
    </View>
  );
}
}
