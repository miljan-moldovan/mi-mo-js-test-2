import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 5,
  },
});

const headerRight = props => (<TouchableOpacity disabled={props.disabled} style={styles.buttonContainer} onPress={props.handlePress}>
  {props.button}
</TouchableOpacity>
);

headerRight.propTypes = {
  handlePress: PropTypes.func,
  button: PropTypes.element.isRequired,
  disabled: PropTypes.boolean,
};

headerRight.defaultProps = {
  handlePress: null,
  disabled: false,
};

export default headerRight;
