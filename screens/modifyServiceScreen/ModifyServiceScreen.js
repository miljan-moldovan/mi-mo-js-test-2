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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});

export default class ModifyServiceScreen extends React.Component {
  static navigationOptions = rootProps => ({
    headerTitle: 'service' in rootProps.navigation.state.params ?
      'Add Service' : 'Modify Service',
    headerRight: (
      <TouchableOpacity
        onPress={rootProps.navigation.state.params.onSave}
      >
        <Text style={{ fontSize: 14, color: 'white' }}>Save</Text>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ ...params, onSave: this.onSave.bind(this) });
    this.state = {
      selectedService: 'service' in params ? params.service : null,
      selectedProvider: 'service' in params ? params.service.employeeId : null,
      selectedPromotion: 'promotion' in params ? params.promotion : null,
      providerRequested: false,
    };
  }

  onSave = () => {
    this.props.appointmentDetailsActions.addService(this.state);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            navigate={this.props.navigation.navigate}
            selectedService={this.state.selectedService}
            onChange={(service) => {
              this.setState({ selectedService: service });
            }}
          />
          <InputDivider />
          <ProviderInput
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={(provider) => {
              this.setState({ selectedProvider: provider });
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
          <InputLabel label="Discount" value="20%" />
          <InputLabel label="Price" value="$40" />
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <TouchableOpacity style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
              fontSize: 14, lineHeight: 22, color: '#D1242A', fontFamily: 'Roboto-Medium',
              }}
            >
              Remove Service
            </Text>
          </TouchableOpacity>
        </InputGroup>
      </View>
    );
  }
}
