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
    paddingLeft: 4,
  },
  textStyle: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
    color: '#2F3142',
    marginHorizontal: 2,
  },
  dollarContainer: {
    height: '100%',
    paddingHorizontal: 4,
    backgroundColor: '#082E66',
    borderTopRightRadius: 7.5,
    borderBottomRightRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const badge = ({ text }) => (
  <View style={styles.container}>
    <Icon color="#082E66" size={12} name="userPlus" type="solid" />
    <Text style={styles.textStyle}>{text.toUpperCase()}</Text>
    <View style={styles.dollarContainer}>
      <Icon color="#fff" size={10} name="dollar" type="solid" />
    </View>
  </View>
);

badge.propTypes = {
  text: PropTypes.string.isRequired,
};

export default badge;
