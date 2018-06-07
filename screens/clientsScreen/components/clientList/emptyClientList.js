import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../../../../components/UI/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  circle: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#C0C1C6',
  },
  textContainer: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: '#727A8F',
    fontWeight: '500',
    textAlign: 'center',
  },
  textDesc: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#727A8F',
    textAlign: 'center',
  },
});

const emptyClientList = ({ props }) => (
  <View style={styles.container}>
    <View style={styles.circle}>
      <Icon color="#C0C1C6" size={50} name="search" type="regular" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.textTitle}>Search for clients above.</Text>
      <Text style={styles.textDesc}>Type name, code, phone number or email</Text>
    </View>
  </View>
);

export default emptyClientList;
