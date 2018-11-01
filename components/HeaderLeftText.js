import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from './SalonTouchableOpacity';

const styles = StyleSheet.create({
  button: { paddingLeft: 10 },
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#fff',
  },
});

const headerLeftText = props => (
  <SalonTouchableOpacity style={styles.button} onPress={props.handlePress}>
    <Text style={styles.text}>Cancel</Text>
  </SalonTouchableOpacity>
);

headerLeftText.propTypes = {
  handlePress: PropTypes.func,
};

headerLeftText.defaultProps = {
  handlePress: null,
};

export default headerLeftText;
