import React from 'react';
import { View, StyleSheet } from 'react-native';

import { InputSwitch } from '../../formHelpers';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: '#110A24',
    fontFamily: 'Roboto',
    fontSize: 10,
    fontWeight: '500',
  },
  switchStyle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8}],
  },
});

const firstAvailableBtn = ({ rootStyles, switchStyle, onChange, value }) => (
  <View style={[styles.container, rootStyles]}>
    <InputSwitch
      text="First Avl."
      onChange={onChange}
      textStyle={styles.textStyle}
      switchStyle={styles.switchStyle}
      textRight
      value={value}
    />
  </View>
);

export default firstAvailableBtn;
