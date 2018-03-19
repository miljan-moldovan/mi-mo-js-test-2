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
  ProductInput,
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

export default class ModifyProductScreen extends React.Component {
  static navigationOptions = rootProps => ({
    headerTitle: rootProps.navigation.state.params.actionType === 'new' ?
      'Add Product' : 'Modify Product',
  });
  constructor(props) {
    super(props);

    this.state = {
      selectedProduct: null,
      selectedProvider: null,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ProductInput
            navigate={this.props.navigation.navigate}
            selectedProduct={this.state.selectedProduct}
            onChange={(product) => {
              this.setState({ selectedProduct: product });
            }}
          />
          <InputDivider />
          <ProviderInput
            navigate={this.props.navigation.navigate}
            onChange={(provider) => {
              this.setState({ selectedProvider: provider });
            }}
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
          <InputDivider />
          <InputLabel label="Price" value="$40" />
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <TouchableOpacity style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
              fontSize: 14, lineHeight: 22, color: '#D1242A', fontFamily: 'Roboto-Medium',
              }}
            >
              Remove Product
            </Text>
          </TouchableOpacity>
        </InputGroup>
      </View>
    );
  }
}
