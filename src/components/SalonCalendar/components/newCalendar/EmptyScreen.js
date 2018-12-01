import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Icon from '@/components/common/Icon';

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconsContainer: {
    marginBottom: 20,
  },
  exclamationIcon: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: 'rgb(239, 239, 244)',
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(74, 74, 74)',
  },
});

const emptyScreen = () => (
  <View style={styles.container}>
    <View style={styles.iconsContainer}>
      <Icon name="userCircle" size={100} color="rgb(222, 224, 226)" />
      <Icon
        name="exclamationCircle"
        type="solid"
        size={40}
        color="rgb(222, 224, 226)"
        style={styles.exclamationIcon}
      />
    </View>
    <Text style={styles.textStyle}>No providers available</Text>
  </View>
);

export default emptyScreen;
