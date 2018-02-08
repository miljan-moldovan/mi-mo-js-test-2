import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 12,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
});

const AlphabeticalHeader = props => (<Text style={styles.text}>{props.headerData.header}</Text>);

export default AlphabeticalHeader;
