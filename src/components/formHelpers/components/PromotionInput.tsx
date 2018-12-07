import * as React from 'react';
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
      icon = 'default',
      label = 'Promotion',
      placeholder = 'Select Promotion',
      selectedPromotion,
    } = this.props;
    const value = selectedPromotion ? selectedPromotion.name : null;
    return (
      <InputButton
        icon={icon}
        value={value}
        label={label}
        onPress={this.handlePress}
        placeholder={placeholder}
      />
    );
  }
}
PromotionInput.propTypes = {
  ...propTypesObj,
  mode: PropTypes.oneOf(['service', 'product']),
  navigate: PropTypes.func.isRequired,
  selectedPromotion: PropTypes.node.isRequired,
  onChangePromotion: PropTypes.func.isRequired,
};
PromotionInput.defaultProps = {
  ...defaultPropsObj,
  mode: 'service',
};
