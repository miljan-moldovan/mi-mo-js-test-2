import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
});


const headerLateral = (props) => {
  console.log('headerLateral', props);

  props.handlePress();
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={props.handlePress}>
      {props.button}
    </TouchableOpacity>
  );
};


headerLateral.propTypes = {
  handlePress: PropTypes.func,
  button: PropTypes.element.isRequired,
};

headerLateral.defaultProps = {
  handlePress: null,
};

export default headerLateral;
