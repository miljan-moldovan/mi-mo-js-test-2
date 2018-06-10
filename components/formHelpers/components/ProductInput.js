import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class ProductInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProduct: 'selectedProduct' in this.props ? this.props.selectedProduct : null,
    };
  }

    handleProductSelection = (product) => {
      this.setState({ selectedProduct: product });
      this.props.onChange(product);
    }

    handlePress = () => {
      this.props.navigate('Products', {
        actionType: 'update',
        dismissOnSelect: true,
        onChangeProduct: product => this.handleProductSelection(product),
      });
    }

    render() {
      const value = this.state.selectedProduct ? this.state.selectedProduct.name : null;
      return (
        <SalonTouchableOpacity
          style={[styles.inputRow, { justifyContent: 'center' }]}
          onPress={this.handlePress}
        >
          <Text style={[styles.labelText]}>Product</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={[styles.inputText]}>{value}</Text>
          </View>
          <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
        </SalonTouchableOpacity>
      );
    }
}
