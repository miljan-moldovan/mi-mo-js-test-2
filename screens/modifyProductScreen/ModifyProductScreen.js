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
import apiWrapper from '../../utilities/apiWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});

export default class ModifyProductScreen extends React.Component {
  static navigationOptions = rootProps => ({
    headerTitle: 'product' in rootProps.navigation.state.params ?
      'Modify Product' : 'Add Product',
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
    this.props.navigation.setParams({ onSave: this.onSave.bind(this) });

    this.state = {
      index: 'index' in params ? params.index : null,
      selectedProduct: 'product' in params ? params.product.product : null,
      selectedProvider: 'product' in params ? params.product.provider : null,
      price: 'product' in params ? params.product.price : '$0',
      discount: 0,
    };
  }

  onSave = () => {
    this.props.appointmentDetailsActions.addProduct({ product: this.state.selectedProduct, provider: this.state.selectedProvider }, this.state.index);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ProductInput
            navigate={this.props.navigation.navigate}
            selectedProduct={this.state.selectedProduct}
            onChange={(selectedProduct) => {
              this.setState({ selectedProduct, price: selectedProduct.price });
            }}
          />
          <InputDivider />
          <ProviderInput
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={(selectedProvider) => {
              this.setState({ selectedProvider });
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
          <InputLabel label="Discount" value={this.state.discount} />
          <InputDivider />
          <InputLabel label="Price" value={this.state.price} />
        </InputGroup>
        <SectionDivider />
        {this.state.index !== null && (
          <InputGroup>
            <TouchableOpacity
              style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                this.props.appointmentDetailsActions.removeProduct(this.state.index);
                this.props.navigation.goBack();
              }}
            >
              <Text style={{
                fontSize: 14, lineHeight: 22, color: '#D1242A', fontFamily: 'Roboto-Medium',
                }}
              >
                Remove Product
              </Text>
            </TouchableOpacity>
          </InputGroup>
        )}
      </View>
    );
  }
}
