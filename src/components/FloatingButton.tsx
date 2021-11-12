import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from './SalonTouchableOpacity';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 18,
    bottom: 38,
    width: 56,
    height: 56,
    borderRadius: 40,
    backgroundColor: '#67A3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

const floatingButton = props => (
  <View style={[styles.root, props.rootStyle]}>
    <SalonTouchableOpacity style={styles.buttonContainer} onPress={props.handlePress}>
      {props.children}
    </SalonTouchableOpacity>
  </View>
);

floatingButton.propTypes = {
  handlePress: PropTypes.func.isRequired,
  children: PropTypes.element,
  rootStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

floatingButton.defaultProps = {
  children: null,
  rootStyle: null,
};

export default floatingButton;
