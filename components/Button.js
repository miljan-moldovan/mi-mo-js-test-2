import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = {
  light: StyleSheet.create({
    button: {
      // width: 140,
      // height: 60,
      paddingHorizontal: 40,
      paddingVertical: 15,
      backgroundColor: 'white',
      borderColor: '#67A3C7',
      borderWidth: 1,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: '#67A3C7', fontSize: 18 },
  }),
  primary: StyleSheet.create({
    button: {
      // width: 140,
      // height: 60,
      paddingHorizontal: 40,
      paddingVertical: 15,
      backgroundColor: '#67A3C7',
      borderColor: '#67A3C7',
      borderWidth: 1,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: 'white', fontSize: 18 },
  }),
  small: StyleSheet.create({
    button: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: '#67A3C7',
      borderColor: '#67A3C7',
      flex: 0,
      alignSelf: 'center',
    },
    text: { color: 'white', fontSize: 12 },
  }),
};

const Button = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={[styles[props.type].button, {alignSelf: 'center'}]}
  >
    <Text style={styles[props.type].text}>{props.text}</Text>
  </TouchableOpacity>
);

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Button.defaultProps = {
  type: 'primary',
};
export default Button;
