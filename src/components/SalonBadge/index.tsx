import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    minWidth: 15,
    height: 15,
    backgroundColor: '#082E66',
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
    color: '#fff',
  },
});

const badge = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.textStyle}>{text}</Text>
  </View>
);

badge.propTypes = {
  text: PropTypes.string.isRequired,
};

export default badge;
