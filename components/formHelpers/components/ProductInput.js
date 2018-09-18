import React from 'react';
import { Text } from 'react-native';
import { get } from 'lodash';
import { InputButton } from '../index';
import styles from '../styles';

const ProductInput = (props) => {
  const {
    apptBook,
    navigate,
    onChange,
    label = 'Product',
    selectedProduct,
  } = props;
  const value = get(selectedProduct, 'name', '');
  const onPress = () => {
    navigate(apptBook ? 'ApptBookProducts' : 'Products', {
      selectedProduct,
      actionType: 'update',
      dismissOnSelect: true,
      onChangeProduct: product => onChange(product),
    });
  };
  return (
    <InputButton
      {...props}
      value={value}
      label={label}
      onPress={onPress}
    >
      {props.placeholder && !props.selectedProduct ? (
        <Text style={styles.labelText}>{props.placeholder}</Text>
      ) : null}
    </InputButton>
  );
};
export default ProductInput;
