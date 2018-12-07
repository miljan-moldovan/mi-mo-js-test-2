import * as React from 'react';
import {
  Text,
} from 'react-native';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import Colors from '../../../constants/Colors';
import styles from '../styles';

const Button = (props) => {
  const backgroundColor = props.disabled ?
    Colors.mediumGrey : props.backgroundColor || Colors.defaultBlue;
  const borderColor = props.disabled ? Colors.heavyGrey : Colors.defaultBlue;
  const buttonStyle = {
    borderColor,
    backgroundColor,
  };
  const buttonTextStyle = { color: props.color || 'white' };
  return (
    <SalonTouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={[styles.buttonContainer, buttonStyle, props.style]}
    >
      <Text style={[styles.buttonText, buttonTextStyle]}>{props.text}</Text>
    </SalonTouchableOpacity>
  );
};
export default Button;
