import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
  InputDivider,
  ProductInput,
  ProviderInput,
  SectionDivider,
  PromotionInput,
  InputLabel,
} from '../../components/formHelpers';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class ModifyProductScreen extends React.Component {
  static navigationOptions = rootProps => ({
    headerTitle: (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{'product' in rootProps.navigation.state.params ?
              'Modify Product' : 'Add Product'}
        </Text>
      </View>
    ),
    headerLeft: (
      <SalonTouchableOpacity
        style={styles.leftButton}
        onPress={() => { rootProps.navigation.goBack(); }}
      >
        <View style={styles.leftButtonContainer}>
          <Text style={styles.leftButtonText}>
            <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
          </Text>
        </View>
      </SalonTouchableOpacity>
    ),
    headerRight: (
      <SalonTouchableOpacity
        wait={3000}
        onPress={rootProps.navigation.state.params.onSave}
      >
        <View style={styles.rightButtonContainer}>
          <Text style={styles.rightButtonText}>Save</Text>
        </View>
      </SalonTouchableOpacity>
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
    alert('Not Implemented');
    // this.props.appointmentDetailsActions.addProduct({ product: this.state.selectedProduct, provider: this.state.selectedProvider }, this.state.index);
    // this.props.navigation.goBack();
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
            <SalonTouchableOpacity
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
            </SalonTouchableOpacity>
          </InputGroup>
        )}
      </View>
    );
  }
}
