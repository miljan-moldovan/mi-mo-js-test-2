import React from 'react';
import { View, StyleSheet } from 'react-native';

import { InputSwitch } from '../../formHelpers';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 138,
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

const firstAvailableBtn = ({ rootStyles, switchStyle }) => (
  <View style={[styles.container, rootStyles]}>
    <InputSwitch
      text="First Available"
      onChange={() => {}}
      textStyle={styles.textStyle}
      switchStyle={styles.switchStyle}
      textRight
    />
  </View>
);

export default firstAvailableBtn;
