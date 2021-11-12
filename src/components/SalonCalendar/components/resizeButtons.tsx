import * as React from 'react';
import { View, PanResponder, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const styles = {
  container: {
    position: 'absolute',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  btnContainer: {
    padding: 15,
  },
};

const resizeButton = ({ position, isDisabled, onPress, color }) => (
  <View style={[styles.container, position]}>
    <TouchableWithoutFeedback disabled={isDisabled} onPressIn={onPress}>
      <View style={styles.btnContainer}>
        <View style={[styles.btn, { borderColor: color }]} />
      </View>
    </TouchableWithoutFeedback>
  </View>
);

export default resizeButton;
