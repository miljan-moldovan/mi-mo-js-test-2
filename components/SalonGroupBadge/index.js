import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../UI/Icon';

const styles = StyleSheet.create({
  container: {
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#082E66',
    borderWidth: 1,
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
    color: '#2F3142',
  },
  collarContainer: {
    paddingHorizontal: 4,
    backgroundColor: '#082E66',
  },
});

const badge = ({ text }) => (
  <View style={styles.container}>
    <Icon color="#082E66" size={16} name="userPlus" type="solid" />
    <Text style={styles.textStyle}>{text}</Text>
    <Icon color="#fff" size={16} name="dollar" type="solid" />
  </View>
);

badge.propTypes = {
  text: PropTypes.string.isRequired,
};

export default badge;
