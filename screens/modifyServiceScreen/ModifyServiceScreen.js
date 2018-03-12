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
    headerTitle: rootProps.navigation.state.params.actionType === 'new' ?
      'Add Service' : 'Modify Service',
  });
  constructor(props) {
    super(props);

    this.state = {
      selectedService: null,
      selectedProvider: null,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup>
          <ServiceInput
            navigate={this.props.navigation.navigate}
            onChange={(service) => {
              this.setState({ selectedService: service });
            }}
          />
          <InputDivider />
          <ProviderInput
            navigate={this.props.navigation.navigate}
            onChange={(provider) => {
              this.setState({ selectedProvider: provider });
            }}
          />
          <InputDivider />
          <InputSwitch
            onChange={value => alert(`Switched to ${value}`)}
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
