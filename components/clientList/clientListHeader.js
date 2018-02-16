import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#110A24',
    fontSize: 17,
    marginLeft: 20,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
});

const ClientListHeader = props => (<Text style={styles.text}>{props.header}</Text>);

export default ClientListHeader;
