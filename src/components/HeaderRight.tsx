import * as React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from './SalonTouchableOpacity';

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 5,
  },
});

const headerRight = props => (<SalonTouchableOpacity disabled={props.disabled} style={styles.buttonContainer} onPress={props.handlePress}>
  {props.button}
</SalonTouchableOpacity>
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
