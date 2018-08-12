import React from 'react';
import { InputButton } from '../index';

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
    />
  );
};
export default ProductInput;

