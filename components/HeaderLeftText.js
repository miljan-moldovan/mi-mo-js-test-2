import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
});

const headerLeftText = (props) => {
  return (<TouchableOpacity onPress={props.handlePress}>
    <Text style={styles.text}>Cancel</Text>
  </TouchableOpacity>);
};

headerLeftText.propTypes = {
  handlePress: PropTypes.func,
};

headerLeftText.defaultProps = {
  handlePress: null,
};

export default headerLeftText;
