import React from 'react';
import { Text } from 'react-native';
import { InputButton } from '../index';
import styles from '../styles';

const ProductInput = (props) => {
  const value = props.selectedProduct ? props.selectedProduct.name : '';
  return (
    <InputButton
      {...props}
      onPress={() => {
        props.navigate(props.apptBook ? 'ApptBookProducts' : 'Products', {
          actionType: 'update',
          dismissOnSelect: true,
          onChangeProduct: product => props.onChange(product),
        });
      }}
      value={value}
      label="Product"
    >
      {props.placeholder && !props.selectedProduct ? (
        <Text style={styles.labelText}>{props.placeholder}</Text>
      ) : null}
    </InputButton>
  );
};
export default ProductInput;
