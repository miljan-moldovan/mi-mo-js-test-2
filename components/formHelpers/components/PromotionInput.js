import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { InputButton, propTypesObj, defaultPropsObj } from '../index';

export default class PromotionInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPromotion: null,
    };
  }

  handlePromoSelection = (promotion) => {
    this.props.onChange(promotion);
  }

  handlePress = () => {
    const {
      mode,
      navigate,
      selectedPromotion,
    } = this.props;
    navigate('Promotions', {
      mode,
      selectedPromotion,
      dismissOnSelect: true,
      onChangePromotion: promotion => this.handlePromoSelection(promotion),
    });
  }

  render() {
    const {
      label,
      placeholder,
      selectedPromotion,
    } = this.props;
    const value = selectedPromotion ? selectedPromotion.name : null;
    return (
      <InputButton
        value={value}
        label={label || 'Product'}
        onPress={this.handlePress}
        placeholder={placeholder || 'Select Product'}
      />
    );
  }
}
PromotionInput.propTypes = {
  ...propTypesObj,
  mode: PropTypes.oneOf(['service', 'product']),
  navigate: PropTypes.func.isRequired,
  selectedPromotion: PropTypes.any.isRequired,
  onChangePromotion: PropTypes.func.isRequired,
};
PromotionInput.defaultProps = {
  ...defaultPropsObj,
  mode: 'service',
};
