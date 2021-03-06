import * as React from 'react';
import { Text } from 'react-native';
import { get } from 'lodash';
import { InputButton } from '../index';
import styles from '../styles';

const ProductInput = (props) => {
  const {
    apptBook,
    navigate,
    onChange,
    icon = 'default',
    label = 'Product',
    selectedProduct,
    recommendationSystem,
  } = props;
  const value = get(selectedProduct, 'name', '');
  const onPress = () => {
    navigate(apptBook ? 'ApptBookProducts' : 'Products', {
      selectedProduct,
      actionType: 'update',
      dismissOnSelect: true,
      recommendationSystem,
      onChangeProduct: product => onChange(product),
    });
  };
  return (
    <InputButton
      {...props}
      icon={icon}
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
